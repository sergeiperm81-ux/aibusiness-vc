"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface PickedPhoto {
  name: string;
  type: string;
  /** Base64 without the data: prefix, cropped to a square. */
  data: string;
}

interface Props {
  onChange: (photo: PickedPhoto | null) => void;
}

/** Size of the on-screen crop frame, and of the square we export. */
const FRAME = 260;
const EXPORT = 480;

/**
 * Phone cameras produce 10 to 20 MB originals. The size of the original does not
 * matter here, because it is scaled down before anything is sent, so the cap only
 * guards the phone's memory and sits well above what a camera makes.
 */
const MAX_SOURCE_BYTES = 40 * 1024 * 1024;

/** Longest edge of the working copy held in memory while the person crops. */
const WORKING_EDGE = 1600;

const IMAGE_NAME = /\.(jpe?g|png|webp|gif|heic|heif|avif|bmp|tiff?)$/i;

const UNREADABLE =
  "This browser cannot open that picture. Phones often save photos as HEIC, which some browsers cannot read. Take a screenshot of the photo and choose the screenshot instead, or email the photo to info [at] aibusiness.vc and we will add it.";

const CANNOT_CROP =
  "Your phone could not prepare the photo here. Send the form without it and email the photo to info [at] aibusiness.vc. We will add it to your profile.";

/**
 * Some Android galleries hand over photos with no MIME type at all, so an empty
 * type is given the benefit of the doubt: decoding it is the real test.
 */
function looksLikeImage(file: File): boolean {
  return file.type.startsWith("image/") || file.type === "" || IMAGE_NAME.test(file.name);
}

function loadViaImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("undecodable"));
    };
    img.src = url;
  });
}

/**
 * Decode the file and hand back a modest JPEG to crop from.
 *
 * Holding a 48-megapixel original in an <img> is what makes older phones drop the
 * page, and a browser that cannot decode the format fails with no event at all if
 * nothing listens for it. Decoding once, up front, turns both into a normal,
 * explained error, and everything after this point works on a small picture.
 */
interface WorkingCopy {
  url: string;
  width: number;
  height: number;
}

async function toWorkingCopy(file: File): Promise<WorkingCopy> {
  let source: ImageBitmap | HTMLImageElement;
  if (typeof createImageBitmap === "function") {
    try {
      source = await createImageBitmap(file);
    } catch {
      source = await loadViaImage(file);
    }
  } else {
    source = await loadViaImage(file);
  }

  const width = "naturalWidth" in source ? source.naturalWidth : source.width;
  const height = "naturalHeight" in source ? source.naturalHeight : source.height;
  if (!width || !height) throw new Error("undecodable");

  const k = Math.min(1, WORKING_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * k);
  canvas.height = Math.round(height * k);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no-canvas");
  // White under transparent PNGs, or they turn black as JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();
  return { url: canvas.toDataURL("image/jpeg", 0.92), width: canvas.width, height: canvas.height };
}

/**
 * Photo picker with zoom and drag-to-position.
 *
 * A portrait is the first thing anyone sees on a profile, so it is worth more
 * than a file input: the person sees exactly the square that will be published
 * and can move the face into it. The crop is done in a canvas on the client, so
 * only the finished square is ever sent.
 */
export function PhotoPicker({ onChange }: Props) {
  const [src, setSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Known the moment the working copy is made, so the preview never depends on
  // an image load event or a parent re-render to learn its own size. Relying on
  // those left the circle blank on some phones: nothing failed, nothing showed.
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // The link to this form mostly travels through LinkedIn, whose mobile app opens
  // it in a built-in browser that often refuses to open the photo picker at all.
  // Nothing on this page can fix that, so the person is told how to get out of it.
  useEffect(() => {
    setInAppBrowser(/LinkedInApp|FBAN|FBAV|Instagram|Line\//i.test(navigator.userAgent));
  }, []);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  /** Scale at which the image just covers the frame. */
  const coverScale = useCallback(() => {
    if (!natural.width || !natural.height) return 1;
    return Math.max(FRAME / natural.width, FRAME / natural.height);
  }, [natural]);

  const emit = useCallback(() => {
    const img = imageRef.current;
    if (!img || !img.complete || !natural.width) return;
    const scale = coverScale() * zoom;
    const dispW = natural.width * scale;
    const dispH = natural.height * scale;
    const left = (FRAME - dispW) / 2 + offset.x;
    const top = (FRAME - dispH) / 2 + offset.y;

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT;
    canvas.height = EXPORT;
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no-canvas");
      const k = EXPORT / FRAME;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, EXPORT, EXPORT);
      ctx.drawImage(img, left * k, top * k, dispW * k, dispH * k);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
      onChange({
        name: fileName || "photo.jpg",
        type: "image/jpeg",
        data: dataUrl.split(",")[1] ?? "",
      });
    } catch {
      // Low-memory phones can refuse a canvas. Say so instead of leaving the
      // person with a photo on screen that silently never reaches the form.
      onChange(null);
      setError(CANNOT_CROP);
    }
  }, [coverScale, natural, zoom, offset, fileName, onChange]);

  // Re-crop whenever the person moves or zooms the picture.
  useEffect(() => {
    if (src) emit();
  }, [src, zoom, offset, emit]);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    // Cleared so that choosing the same file again after an error still fires.
    input.value = "";
    setError("");
    if (!file) return;
    if (!looksLikeImage(file)) {
      setError("That is not an image file. Choose a photo.");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError("That picture is unusually large. Take a screenshot of it and choose the screenshot.");
      return;
    }
    setBusy(true);
    try {
      const working = await toWorkingCopy(file);
      setNatural({ width: working.width, height: working.height });
      setSrc(working.url);
      setFileName(file.name.replace(/\.[^.]+$/, "") + ".jpg");
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } catch {
      setError(UNREADABLE);
    } finally {
      setBusy(false);
    }
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!src) return;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({
      x: drag.ox + (event.clientX - drag.x),
      y: drag.oy + (event.clientY - drag.y),
    });
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function clear() {
    setSrc("");
    setNatural({ width: 0, height: 0 });
    setFileName("");
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    onChange(null);
  }

  const scale = coverScale() * zoom;
  const dispW = (natural.width || FRAME) * scale;
  const dispH = (natural.height || FRAME) * scale;

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div
          className="relative shrink-0 select-none overflow-hidden rounded-full border-4 border-amber-400 bg-white shadow-md"
          style={{ width: FRAME, height: FRAME, cursor: src ? "grab" : "default", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              ref={imageRef}
              src={src}
              alt="Your photo"
              draggable={false}
              onLoad={() => emit()}
              onError={() => {
                clear();
                setError(UNREADABLE);
              }}
              style={{
                position: "absolute",
                width: dispW,
                height: dispH,
                left: (FRAME - dispW) / 2 + offset.x,
                top: (FRAME - dispH) / 2 + offset.y,
                maxWidth: "none",
              }}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center px-6 text-center text-sm font-semibold text-amber-800/70">
              Your face goes here
            </span>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <label className="inline-block cursor-pointer rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-amber-400">
            {busy ? "Preparing your photo…" : src ? "Choose another photo" : "Choose a photo"}
            <input
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleFile}
              disabled={busy}
              className="sr-only"
            />
          </label>

          {src && (
            <>
              <div className="mt-5">
                <label htmlFor="photo-zoom" className="mb-1 block text-xs font-semibold text-gray-700">
                  Zoom
                </label>
                <input
                  id="photo-zoom"
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Drag the picture to move it inside the circle.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mt-3 text-xs font-semibold text-gray-500 underline hover:text-gray-800"
              >
                Remove photo
              </button>
            </>
          )}

          {!src && (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-amber-900">
              A clear portrait, looking at the camera. This is the first thing anyone sees, so it
              is worth a good one.
            </p>
          )}

          {inAppBrowser && !src && (
            <p className="mt-3 max-w-sm rounded-lg bg-white px-3 py-2 text-sm leading-relaxed text-gray-800">
              If the photo picker does not open, you are probably in an app&apos;s built-in
              browser. Open this page in Chrome or Safari from the menu and it will work.
            </p>
          )}

          {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

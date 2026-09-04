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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  /** Scale at which the image just covers the frame. */
  const coverScale = useCallback(() => {
    const img = imageRef.current;
    if (!img || !img.naturalWidth) return 1;
    return Math.max(FRAME / img.naturalWidth, FRAME / img.naturalHeight);
  }, []);

  const emit = useCallback(() => {
    const img = imageRef.current;
    if (!img || !img.naturalWidth) return;
    const scale = coverScale() * zoom;
    const dispW = img.naturalWidth * scale;
    const dispH = img.naturalHeight * scale;
    const left = (FRAME - dispW) / 2 + offset.x;
    const top = (FRAME - dispH) / 2 + offset.y;

    const canvas = document.createElement("canvas");
    canvas.width = EXPORT;
    canvas.height = EXPORT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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
  }, [coverScale, zoom, offset, fileName, onChange]);

  // Re-crop whenever the person moves or zooms the picture.
  useEffect(() => {
    if (src) emit();
  }, [src, zoom, offset, emit]);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That is not an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("The picture is over 8 MB. Try a smaller one.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(String(reader.result ?? ""));
      setFileName(file.name);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
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
    setFileName("");
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    onChange(null);
  }

  const img = imageRef.current;
  const scale = (img?.naturalWidth ? coverScale() : 1) * zoom;
  const dispW = (img?.naturalWidth ?? FRAME) * scale;
  const dispH = (img?.naturalHeight ?? FRAME) * scale;

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
            {src ? "Choose another photo" : "Choose a photo"}
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
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

          {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

import { permanentRedirect } from "next/navigation";

/** The hub moved to /ai-tools; links already shared keep working. */
export default function AiScanMoved(): never {
  permanentRedirect("/ai-tools");
}

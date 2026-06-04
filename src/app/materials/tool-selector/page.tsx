import { permanentRedirect } from "next/navigation";

// Tool retired — redirect old URL to the Tools hub to avoid 404s.
export default function Page() {
  permanentRedirect("/tools");
}

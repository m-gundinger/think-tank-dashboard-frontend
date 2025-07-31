import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export function WhiteboardView() {
  return (
    <div className="fixed inset-0 z-50">
      <Tldraw />
    </div>
  );
}
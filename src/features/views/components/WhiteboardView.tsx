import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export function WhiteboardView() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  );
}

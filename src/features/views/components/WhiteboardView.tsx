import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export function WhiteboardView() {
  // In a real application, you would fetch/save data using the `useApiResource` hooks
  // and connect to a real-time collaboration service (e.g., via WebSockets).
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  );
}

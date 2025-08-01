import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { MyTasksWidget } from "./MyTasksWidget";
import { RecentMentionsWidget } from "./RecentMentionsWidget";

export function HomeDashboard() {
  const layout = [
    { i: "my-tasks", x: 0, y: 0, w: 6, h: 10 },
    { i: "mentions", x: 6, y: 0, w: 6, h: 10 },
  ];
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      isDraggable={true}
      isResizable={true}
    >
      <div key="my-tasks">
        <MyTasksWidget />
      </div>
      <div key="mentions">
        <RecentMentionsWidget />
      </div>
    </GridLayout>
  );
}
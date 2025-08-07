import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainContent } from "@/components/layout/MainContent";
import { Toaster } from "@/components/ui/sonner";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { ActiveAnnouncements } from "@/features/system/components/ActiveAnnouncements";

export function ProtectedLayout() {
  useNotificationSocket();

  return (
    <div className="bg-background text-foreground flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <MainContent>
          <ActiveAnnouncements />
          <div className="mt-4">
            <Outlet />
          </div>
        </MainContent>
      </div>
      <Toaster />
    </div>
  );
}
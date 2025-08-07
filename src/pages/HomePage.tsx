import { HomeDashboard } from "@/features/home/components/HomeDashboard";
import { useGetProfile } from "@/features/user-management/api/useGetProfile";

export function HomePage() {
  const { data: user } = useGetProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName}. Here is your command center for
          tasks, mentions, and notifications.
        </p>
      </div>
      <HomeDashboard />
    </div>
  );
}
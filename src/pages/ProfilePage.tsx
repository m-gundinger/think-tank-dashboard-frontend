import { ProfileForm } from "@/features/profile/components/ProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetProfile } from "@/features/profile/api/useGetProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";

export function ProfilePage() {
  const { data: profile, isLoading } = useGetProfile();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal details, publications, and activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="flex flex-col items-center pt-8">
              {isLoading || !profile ? (
                <Skeleton className="h-32 w-32 rounded-full" />
              ) : (
                <ProfileAvatar user={profile} />
              )}
              <h2 className="mt-4 text-2xl font-semibold">
                {isLoading ? <Skeleton className="h-8 w-40" /> : profile?.name}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-4 w-48" />
                ) : (
                  profile?.roles.join(", ")
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details. This information is visible to
                other users in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

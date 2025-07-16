import { ProfileForm } from "@/features/profile/components/ProfileForm";

export function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Update your personal details.</p>
      </div>
      <ProfileForm />
    </div>
  );
}

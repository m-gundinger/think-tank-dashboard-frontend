import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUploadAvatar } from "../api/useUploadAvatar";
import { Camera, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getAbsoluteUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateProfile } from "../api/useUpdateProfile";
import { useAdminUploadAvatar } from "@/features/admin/users/api/useAdminUploadAvatar";
import { useApiResource } from "@/hooks/useApiResource";
interface ProfileAvatarProps {
  user: any;
  isSelfProfile?: boolean;
}

export function ProfileAvatar({
  user,
  isSelfProfile = true,
}: ProfileAvatarProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selfUploadMutation = useUploadAvatar();
  const adminUploadMutation = useAdminUploadAvatar(user.id);
  const uploadAvatarMutation = isSelfProfile
    ? selfUploadMutation
    : adminUploadMutation;

  const selfUpdateMutation = useUpdateProfile();
  const adminUpdateMutation = useApiResource("admin/users", [
    "users",
  ]).useUpdate();
  const updateProfileMutation = isSelfProfile
    ? selfUpdateMutation
    : adminUpdateMutation;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (PNG, JPEG, or GIF)");
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        const formData = new FormData();
        formData.append("file", file);
        uploadAvatarMutation.mutate(formData, {
          onSuccess: () => setPreview(null),
          onError: () => setPreview(null),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    const payload = isSelfProfile
      ? { avatarUrl: null }
      : { id: user.id, data: { avatarUrl: null } };
    updateProfileMutation.mutate(payload);
  };

  const handleLinkAvatar = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      try {
        new URL(url);
        const payload = isSelfProfile
          ? { avatarUrl: url }
          : { id: user.id, data: { avatarUrl: url } };
        updateProfileMutation.mutate(payload);
      } catch (e) {
        toast.error("Invalid URL provided.");
      }
    }
  };

  const avatarSrc = preview || getAbsoluteUrl(user?.avatarUrl);
  return (
    <div className="relative">
      <Avatar className="h-32 w-32">
        <AvatarImage
          src={avatarSrc}
          alt={user?.name}
          className="h-full w-full object-cover"
        />
        <AvatarFallback className="text-4xl">
          {user?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png,image/jpeg,image/jpg,image/gif"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8 rounded-full"
            disabled={
              uploadAvatarMutation.isPending || updateProfileMutation.isPending
            }
          >
            <Camera className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Camera className="mr-2 h-4 w-4" />
            <span>Upload Photo</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLinkAvatar}>
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>Use Image URL</span>
          </DropdownMenuItem>
          {user?.avatarUrl && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleRemoveAvatar}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Remove Photo</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  message: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive h-8 w-8" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{message}</p>
    </div>
  );
}

"use client";

import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button";

interface ToastButtonProps extends ButtonProps {
  message: string;
  description?: string;
  tone?: "info" | "success";
}

/** A button whose only job (for now) is to surface a "not implemented yet" toast. */
function ToastButton({ message, description, tone = "info", children, ...props }: ToastButtonProps) {
  return (
    <Button
      {...props}
      onClick={() => {
        if (tone === "success") toast.success(message, { description });
        else toast.info(message, { description });
      }}
    >
      {children}
    </Button>
  );
}

export { ToastButton };

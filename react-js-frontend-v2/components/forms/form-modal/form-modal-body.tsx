"use client";

import { ReactNode } from "react";
import { CardContent } from "@/components/ui/card";

interface FormModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function FormModalBody({ children, className }: FormModalBodyProps) {
  return (
    <CardContent
      className={`p-6 overflow-y-auto max-h-[calc(90vh-140px)] ${className ?? ""}`}
    >
      <div className="space-y-4">{children}</div>
    </CardContent>
  );
}

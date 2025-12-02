import React from "react";
import { cn } from "../utils/cn";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Centers page content and applies consistent vertical spacing.
 * Use inside your main layout's <main>.
 */
const PageShell: React.FC<PageShellProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl space-y-6 px-2 pb-8 pt-4 md:px-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageShell;

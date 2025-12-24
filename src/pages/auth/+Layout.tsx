import { useIsMobile } from "#front/hooks/use-mobile.ts";
import { BoardLayout } from "#front/layout/BoardLayout";
import { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();
  if (isMobile) return <div className="w-full h-screen bg-background">
    <div className="h-full flex justify-center items-center relative">
  {children}
    </div>
  </div>;
  return <BoardLayout>{children}</BoardLayout>;
};

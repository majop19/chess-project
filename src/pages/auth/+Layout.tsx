import { BoardLayout } from "#front/layout/BoardLayout";
import { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => {
  return <BoardLayout>{children}</BoardLayout>;
};

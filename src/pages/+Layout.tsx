import { ReactNode } from "react";
import "./styles.css";
import { clientOnly } from "vike-react/clientOnly";
import { Toaster } from "#front/components/ui/sonner";
import { TailwindIndicator } from "#front/components/tailwindIndicator";
import { MenuLayout } from "#front/layout/MenuLayout";

const Providers = clientOnly(() => import("#front/provider/Providers"));

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <Toaster richColors={true} />
      <div className="min-w-screen min-h-screen bg-background">
        <MenuLayout />
        {children}
      </div>
      <TailwindIndicator />
    </Providers>
  );
};

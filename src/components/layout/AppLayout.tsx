import { Outlet, ScrollRestoration } from "react-router-dom";
import Topbar from "./Topbar";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Topbar />
      <main className="flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <ScrollRestoration />
    </div>
  );
}

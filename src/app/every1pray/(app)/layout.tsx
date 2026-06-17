import TabBar from "@/components/TabBar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import DesktopSidebar from "@/components/DesktopSidebar";
import GlobalToggle from "@/components/GlobalToggle";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="desktop-layout">
      <div className="page-topbar">
        <GlobalToggle />
      </div>
      <div className="device-frame">
        <div className="device-notch" />
        <div className="device-screen">
          <ServiceWorkerRegister />
          <main>{children}</main>
          <TabBar />
        </div>
      </div>
      <DesktopSidebar />
    </div>
  );
}

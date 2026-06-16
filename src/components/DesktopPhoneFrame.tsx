import DesktopSidebar from "@/components/DesktopSidebar";
import GlobalToggle from "@/components/GlobalToggle";

export default function DesktopPhoneFrame({
  children,
  bottomSlot,
}: Readonly<{
  children: React.ReactNode;
  bottomSlot?: React.ReactNode;
}>) {
  return (
    <div className="desktop-layout">
      <div className="page-topbar">
        <GlobalToggle />
      </div>
      <div className="device-frame">
        <div className="device-notch" />
        <div className="device-screen">
          {children}
          {bottomSlot}
        </div>
      </div>
      <DesktopSidebar />
    </div>
  );
}

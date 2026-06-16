import DesktopPhoneFrame from "@/components/DesktopPhoneFrame";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import TabBar from "@/components/TabBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DesktopPhoneFrame
      bottomSlot={<TabBar />}
    >
      <ServiceWorkerRegister />
      <main>{children}</main>
    </DesktopPhoneFrame>
  );
}

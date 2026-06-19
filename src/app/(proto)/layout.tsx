import DesktopPhoneFrame from "@/components/DesktopPhoneFrame";

export default function ProtoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DesktopPhoneFrame>
      <main className="proto-shell">{children}</main>
    </DesktopPhoneFrame>
  );
}

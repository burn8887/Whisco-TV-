import Link from "next/link";
import Logo from "@/components/Logo";
import { getFullUser, getActiveProfile } from "@/lib/access";
import { logoutAction } from "@/lib/actions/auth";
import AppNav from "@/components/AppNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getFullUser();
  const profile = await getActiveProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <AppNav
        userName={user?.name || ""}
        avatarColor={user?.avatarColor || "#f97316"}
        profileName={profile?.name}
        profileAvatar={profile?.avatar}
        isAdmin={user?.role === "ADMIN"}
        subStatus={user?.subscription?.status}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}

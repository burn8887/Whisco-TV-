import Link from "next/link";
import Logo from "@/components/Logo";
import { getFullUser, getActiveProfile } from "@/lib/access";
import AppNav from "@/components/AppNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getFullUser();
  const profile = await getActiveProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <AppNav
        userName={user?.name}
        avatarColor={user?.avatarColor}
        profileName={profile?.name}
        profileAvatar={profile?.avatar}
        isAdmin={user?.role === "ADMIN"}
        isLoggedIn={!!user}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}

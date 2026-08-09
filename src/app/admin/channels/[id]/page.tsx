import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChannelForm from "@/components/admin/ChannelForm";

export default async function EditChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const channel = await prisma.channel.findUnique({ where: { id } });
  if (!channel) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold mb-6">Edit Channel</h1>
      <ChannelForm channel={channel} />
    </div>
  );
}

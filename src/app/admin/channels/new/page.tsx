import ChannelForm from "@/components/admin/ChannelForm";

export default function NewChannelPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold mb-6">Add Channel</h1>
      <ChannelForm />
    </div>
  );
}

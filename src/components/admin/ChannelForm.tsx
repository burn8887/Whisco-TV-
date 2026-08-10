import { upsertChannelAction } from "@/lib/actions/admin";

const CATEGORIES = ["News", "Sports", "Entertainment", "Movies", "Kids", "Documentary", "Music", "Lifestyle"];

export default function ChannelForm({ channel }: { channel?: any }) {
  return (
    <form action={upsertChannelAction} className="max-w-2xl space-y-5">
      {channel && <input type="hidden" name="id" value={channel.id} />}

      <div>
        <label className="text-xs font-medium text-zinc-400">Channel Name</label>
        <input name="name" required defaultValue={channel?.name} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Country</label>
          <input name="country" required defaultValue={channel?.country} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Country Code</label>
          <input name="countryCode" required maxLength={2} defaultValue={channel?.countryCode} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 focus:ring-orange-500 outline-none px-3 py-2.5 text-sm uppercase" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-400">Category</label>
        <select name="category" defaultValue={channel?.category || "Entertainment"} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Language</label>
          <input name="language" defaultValue={channel?.language || "English"} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Channel Number</label>
          <input name="number" type="number" defaultValue={channel?.number || 0} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-400">Stream URL (HLS/M3U)</label>
        <input
          name="streamUrl"
          required
          defaultValue={channel?.streamUrl || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"}
          className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm font-mono text-xs"
        />
        <p className="text-[11px] text-zinc-500 mt-1">In production, point this at your Xtream Codes/M3U live feed endpoint.</p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="isHD" defaultChecked={channel?.isHD ?? true} className="accent-orange-500" /> HD
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="isFeatured" defaultChecked={channel?.isFeatured} className="accent-orange-500" /> Featured on homepage
        </label>
      </div>

      <button className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-600">
        {channel ? "Save Changes" : "Create Channel"}
      </button>
    </form>
  );
}

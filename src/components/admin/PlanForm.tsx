import { upsertPlanAction } from "@/lib/actions/admin";

export default function PlanForm({ plan }: { plan?: any }) {
  return (
    <form action={upsertPlanAction} className="max-w-xl space-y-5">
      {plan && <input type="hidden" name="id" value={plan.id} />}

      <div>
        <label className="text-xs font-medium text-zinc-400">Plan Name</label>
        <input name="name" required defaultValue={plan?.name} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Price / month ($)</label>
          <input name="priceMonthly" type="number" step="0.01" required defaultValue={plan?.priceMonthly} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Price / year ($)</label>
          <input name="priceYearly" type="number" step="0.01" required defaultValue={plan?.priceYearly} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Max Screens</label>
          <input name="maxScreens" type="number" required defaultValue={plan?.maxScreens || 1} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Max Profiles</label>
          <input name="maxProfiles" type="number" required defaultValue={plan?.maxProfiles || 1} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Sort Order</label>
          <input name="sortOrder" type="number" defaultValue={plan?.sortOrder || 0} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-zinc-400">Streaming Quality</label>
          <select name="hdQuality" defaultValue={plan?.hdQuality || "HD"} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm">
            <option>SD</option>
            <option>HD</option>
            <option>FHD</option>
            <option>4K</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Channel Access Tier</label>
          <select name="channelAccess" defaultValue={plan?.channelAccess || "BASIC"} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm">
            <option>BASIC</option>
            <option>STANDARD</option>
            <option>PREMIUM</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-400">Description</label>
        <textarea name="description" rows={2} required defaultValue={plan?.description} className="mt-1 w-full rounded-lg bg-black/40 ring-1 ring-white/10 outline-none px-3 py-2.5 text-sm" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="vodAccess" defaultChecked={plan?.vodAccess ?? true} className="accent-orange-500" /> VOD Access
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="featured" defaultChecked={plan?.featured} className="accent-orange-500" /> Featured / Most Popular
        </label>
      </div>

      <button className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-600">{plan ? "Save Changes" : "Create Plan"}</button>
    </form>
  );
}

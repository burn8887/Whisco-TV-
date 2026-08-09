"use client";

import { updateUserSubStatusAction } from "@/lib/actions/admin";
import { useRef } from "react";

const STATUSES = ["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"];

export default function UserStatusSelect({ userId, status }: { userId: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form action={updateUserSubStatusAction} ref={formRef} className="inline-flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="bg-black/40 ring-1 ring-white/10 rounded px-2 py-1 text-xs"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}

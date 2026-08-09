import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PlanForm from "@/components/admin/PlanForm";

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = await prisma.plan.findUnique({ where: { id } });
  if (!plan) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold mb-6">Edit Plan</h1>
      <PlanForm plan={plan} />
    </div>
  );
}

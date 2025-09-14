import { auth } from "@clerk/nextjs/server";
import { PlanProvider } from "@/lib/contexts/PlanContexts";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { has } = await auth();
  const hasProPlan = has({ plan: "pro_user" });
  const hasEnterprisePlan = has({ plan: "entreprise_user" });

  return (
    <PlanProvider hasProPlan={hasProPlan} hasEnterprisePlan={hasEnterprisePlan}>
      {children}
    </PlanProvider>
  );
}

import { Deal } from "@/types";

export function DealDetailContent({ deal }: { deal: Deal }) {
  return <div>Deal Details for {deal.name}</div>;
}

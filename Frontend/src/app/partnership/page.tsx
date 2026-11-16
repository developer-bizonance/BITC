import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function PartnershipPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  if (tab === "corporate") {
    redirect("/partnership/corporate");
  }
  redirect("/partnership/educational");
}

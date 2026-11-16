import { redirect } from "next/navigation";

export default async function FeedbackRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/events/feedback/${id}`);
}


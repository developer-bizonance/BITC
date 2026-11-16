import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { findOrAutoCreateForm } from "@/lib/eventFeedbackStore";
import FeedbackFormClient from "./FeedbackFormClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const form = await findOrAutoCreateForm(id);
    if (form) {
      return {
        title: `Feedback: ${form.eventTitle} | BITC`,
        description: `Submit your feedback for ${form.eventTitle} with ${form.speakerName} at BITC.`,
      };
    }
  } catch {}

  return {
    title: "Event Feedback Form | BITC BIZONANCE",
    description: "Submit your attendee feedback for BITC workshops and events.",
  };
}

export default async function EventFeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await findOrAutoCreateForm(id);

  if (!form) {
    notFound();
  }

  // Canonicalize URL to event name slug if accessed via ID or alternate casing or duplicate hyphens
  const decodedId = decodeURIComponent(id).trim().toLowerCase();
  const canonicalSlug = (form.slug || "").trim().toLowerCase();
  if (canonicalSlug && decodedId !== canonicalSlug && decodedId.replace(/[^a-z0-9]/g, "") === canonicalSlug.replace(/[^a-z0-9]/g, "")) {
    redirect(`/events/feedback/${form.slug}`);
  }

  return <FeedbackFormClient form={form} />;
}


import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { getApiBase } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitc.bizonance.com';

  const staticRoutes = [
    '',
    '/about',
    '/about/our-story',
    '/about/vision-mission',
    '/about/directors-message',
    '/about/our-mentors',
    '/about/careers',
    '/about/alumni',
    '/courses',
    '/courses/it',
    '/courses/management',
    '/courses/design',
    '/placements/cell',
    '/placements/partners',
    '/placements/success-stories',
    '/placements/statistics',
    '/partnership/educational',
    '/partnership/corporate',
    '/resources/blog',
    '/resources/gallery',
    '/resources/faqs',
    '/events',
    '/contact',
    '/scholarships',
    '/future-proof',
  ];

  const routeEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let dbCourses: any[] = [];
  try {
    const apiBase = getApiBase();
    const res = await fetch(`${apiBase}/courses`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      dbCourses = data.courses || [];
    }
  } catch (e) {
    if (process.env.DATABASE_URL) {
      try {
        dbCourses = await prisma.course.findMany({
          select: { slug: true, updatedAt: true },
        });
      } catch (err) {}
    }
  }

  const courseEntries = dbCourses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.updatedAt ? new Date(course.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...routeEntries, ...courseEntries];
}

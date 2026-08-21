import { MetadataRoute } from 'next';
import { courses } from '@/data/courses';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bitc-eight.vercel.app';

  const staticRoutes = [
    '',
    '/about',
    '/about/our-story',
    '/about/vision-mission',
    '/about/directors-message',
    '/about/our-infrastructure',
    '/about/industry-partnerships',
    '/about/our-mentors',
    '/about/awards-recognition',
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
    '/corporate/training',
    '/corporate/upskilling',
    '/corporate/leadership',
    '/partnership/mou',
    '/partnership/workshops',
    '/partnership/fdp',
    '/partnership/industrial-visits',
    '/resources/blog',
    '/resources/gallery',
    '/resources/downloads',
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

  const courseEntries = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...routeEntries, ...courseEntries];
}

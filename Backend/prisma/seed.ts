import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { courses } from '../src/data/courses';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB seeding from dashboard data files...');

  const dataDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Data directory not found at ${dataDir}`);
    return;
  }

  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      let rawData = fs.readFileSync(filePath, 'utf-8');
      
      // Remove BOM if present
      if (rawData.charCodeAt(0) === 0xfeff) {
        rawData = rawData.slice(1);
      }
      
      const parsedData = JSON.parse(rawData);

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        // 1. Seed into CmsData (universal fallback used by CMS routes)
        await prisma.cmsData.upsert({
          where: { key: file },
          update: { data: parsedData },
          create: { key: file, data: parsedData },
        });
        console.log(`✅ Seeded ${file} into CmsData (${parsedData.length} records)`);

        // 2. Specialized seeding for Event model
        if (file === 'events.json') {
          for (const event of parsedData) {
            await prisma.event.upsert({
              where: { id: event.id },
              update: {
                title: event.title,
                date: new Date(event.date),
                type: event.type,
                imageUrl: event.imageUrl,
                venue: event.venue,
                speaker: event.speaker,
                isFeatured: event.isFeatured,
              },
              create: {
                id: event.id,
                title: event.title,
                date: new Date(event.date),
                type: event.type,
                imageUrl: event.imageUrl,
                venue: event.venue,
                speaker: event.speaker,
                isFeatured: event.isFeatured || false,
                createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
              }
            });
          }
          console.log(`✅ Synced ${parsedData.length} events into Event table`);
        }

        // 3. Specialized seeding for Blog model
        if (file === 'blogs.json') {
          for (const blog of parsedData) {
            const blogSlug = blog.slug || blog.title.trim().toLowerCase().replace(/[\s_]+/g, "-");
            await prisma.blog.upsert({
              where: { slug: blogSlug },
              update: {
                title: blog.title,
                content: blog.content,
                author: blog.author,
                publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : null,
              },
              create: {
                id: blog.id,
                title: blog.title,
                slug: blogSlug,
                content: blog.content,
                author: blog.author,
                publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : null,
                createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
              }
            });
          }
          console.log(`✅ Synced ${parsedData.length} blogs into Blog table`);
        }
      } else {
        console.log(`⚠️ Skipped ${file} (empty or invalid array format)`);
      }
    } catch (err) {
      console.error(`❌ Failed to seed ${file}:`, err);
    }
  }

  // 4. Seed Courses from courses.ts
  if (courses && Array.isArray(courses)) {
    console.log('Starting to seed Courses...');
    for (const course of courses) {
      const courseSlug = course.slug || course.title.trim().toLowerCase().replace(/[\s_]+/g, "-");
      try {
        await prisma.course.upsert({
          where: { slug: courseSlug },
          update: {
            title: course.title,
            category: course.category,
            duration: course.duration,
            fees: course.fees,
            price: course.price,
            description: course.description,
            features: course.features,
            image: course.image,
            curriculum: course.curriculum as any,
          },
          create: {
            slug: courseSlug,
            title: course.title,
            category: course.category || "Information Technology",
            duration: course.duration || "6 Months",
            fees: course.fees || "₹36,000",
            price: course.price || 36000,
            description: course.description || "",
            features: course.features || [],
            image: course.image || "",
            curriculum: (course.curriculum || []) as any,
          }
        });
      } catch (err) {
        console.error(`❌ Failed to seed course ${course.title}:`, err);
      }
    }
    console.log(`✅ Synced ${courses.length} courses into Course table`);
  }

  console.log('🎉 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

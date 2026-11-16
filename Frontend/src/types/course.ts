export type CourseModule = {
  title: string;
  topics: string[];
};

export type Certification = {
  slug: string;
  title: string;
  category: string;
  duration: string;
  fees: string;
  price: number;
  description: string;
  features: string[];
  image?: string;
  curriculum: CourseModule[];
};


export interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  company?: string;
  course?: string;
  packageAmt?: string;
  quote: string;
  image: string;
  rating?: number;
  youtubeUrl?: string;
}

export const defaultStories: TestimonialItem[] = [
  {
    id: "testi-1",
    name: "Rahul Sharma",
    role: "Software Engineer",
    company: "TCS",
    course: "Full Stack Development",
    packageAmt: "6 LPA",
    quote: "The MERN stack certification at BITC gave me the practical skills I needed to clear my interviews with ease.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://youtu.be/ec_OJbZ4ByQ",
  },
  {
    id: "testi-2",
    name: "Priya Patel",
    role: "Data Analyst",
    company: "Wipro",
    course: "Data Science & AI",
    packageAmt: "8 LPA",
    quote: "Excellent faculty and hands-on projects. The placement cell was very supportive throughout the process.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://youtu.be/EOanE5wsHDs",
  },
  {
    id: "testi-3",
    name: "Amit Kumar",
    role: "Automation Engineer",
    company: "L&T",
    course: "Industrial Automation",
    packageAmt: "5.5 LPA",
    quote: "The industrial automation training was exactly what the industry demands right now.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "testi-4",
    name: "Simran Kaur",
    role: "Cloud Architect",
    company: "Amazon",
    course: "DevOps & Cloud",
    packageAmt: "12 LPA",
    quote: "BITC helped me build deep practical experience with live projects that gave me confidence during interviews.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "testi-5",
    name: "Vikram Singh",
    role: "UI/UX Designer",
    company: "Infosys",
    course: "UI/UX Design Masterclass",
    packageAmt: "7 LPA",
    quote: "The practical approach to design systems and user research helped me crack my first major design role.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "testi-6",
    name: "Neha Sharma",
    role: "Cyber Security Analyst",
    company: "Tech Mahindra",
    course: "Cyber Security",
    packageAmt: "9 LPA",
    quote: "The hands-on ethical hacking labs were amazing. I got real-world exposure that companies look for.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

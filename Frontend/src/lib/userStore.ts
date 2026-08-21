export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: "student" | "admin";
  createdAt: string;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  courseId: string;
  courseTitle: string;
  status: "PENDING" | "APPROVED" | "UNDER_REVIEW";
  appliedAt: string;
}

// In-memory initial mock data
export const usersDb: UserRecord[] = [
  {
    id: "usr_demo_1",
    name: "Student Candidate",
    email: "student@bizonance.in",
    passwordHash: "password123", // In production hash with bcrypt
    phone: "+91 98765 43210",
    role: "student",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr_admin_1",
    name: "Admin User",
    email: "admin@bizonance.in",
    passwordHash: "$2a$10$YLlckrE8zUYTTMzgi7lkm.NREhZDT1LiEbLqyyZ1t049QX2J/60oK", // admin123
    phone: "+91 99999 99999",
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

export const applicationsDb: ApplicationRecord[] = [];

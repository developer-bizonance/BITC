export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: "student" | "admin" | "faculty" | "recruiter";
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
  status: "PENDING" | "APPROVED" | "UNDER_REVIEW" | "REJECTED";
  appliedAt: string;
}

// In-memory fallback dataset
export const usersDb: UserRecord[] = [
  {
    id: "usr_admin_1",
    name: "Admin User",
    email: "admin@bizonance.in",
    passwordHash: "$2a$10$YLlckrE8zUYTTMzgi7lkm.NREhZDT1LiEbLqyyZ1t049QX2J/60oK", // admin123
    phone: "+91 89567 27311",
    role: "admin",
    createdAt: new Date("2026-08-01").toISOString(),
  }
];

export const applicationsDb: ApplicationRecord[] = [];

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

// In-memory runtime dataset (no hardcoded users; all accounts are in PostgreSQL)
export const usersDb: UserRecord[] = [];

export const applicationsDb: ApplicationRecord[] = [];

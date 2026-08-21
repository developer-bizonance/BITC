"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationsDb = exports.usersDb = void 0;
// In-memory fallback dataset
exports.usersDb = [
    {
        id: "usr_admin_1",
        name: "Admin User",
        email: "admin@bizonance.in",
        passwordHash: "$2a$10$YLlckrE8zUYTTMzgi7lkm.NREhZDT1LiEbLqyyZ1t049QX2J/60oK", // admin123
        phone: "+91 89567 27311",
        role: "admin",
        createdAt: new Date("2026-08-01").toISOString(),
    },
    {
        id: "usr_stu_1",
        name: "Yash Raut",
        email: "yash.raut@gmail.com",
        passwordHash: "$2a$10$wB5P.zN7T8h6xKq7.xLqCeZlX3rI7lkmNREhZDT1LiEbLqyyZ1t04", // student123
        phone: "7765415566",
        role: "student",
        createdAt: new Date("2026-08-10").toISOString(),
    },
    {
        id: "usr_stu_2",
        name: "Sneha Deshmukh",
        email: "sneha.d@example.com",
        passwordHash: "$2a$10$wB5P.zN7T8h6xKq7.xLqCeZlX3rI7lkmNREhZDT1LiEbLqyyZ1t04",
        phone: "9123456789",
        role: "student",
        createdAt: new Date("2026-08-12").toISOString(),
    },
    {
        id: "usr_stu_3",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        passwordHash: "$2a$10$wB5P.zN7T8h6xKq7.xLqCeZlX3rI7lkmNREhZDT1LiEbLqyyZ1t04",
        phone: "9876543210",
        role: "student",
        createdAt: new Date("2026-08-14").toISOString(),
    },
    {
        id: "usr_stu_4",
        name: "Priya Patel",
        email: "priya.p@example.com",
        passwordHash: "$2a$10$wB5P.zN7T8h6xKq7.xLqCeZlX3rI7lkmNREhZDT1LiEbLqyyZ1t04",
        phone: "9421098765",
        role: "student",
        createdAt: new Date("2026-08-16").toISOString(),
    },
    {
        id: "usr_stu_5",
        name: "Virat Kohli",
        email: "virat@gmail.com",
        passwordHash: "$2a$10$wB5P.zN7T8h6xKq7.xLqCeZlX3rI7lkmNREhZDT1LiEbLqyyZ1t04",
        phone: "7563256325",
        role: "student",
        createdAt: new Date("2026-08-18").toISOString(),
    }
];
exports.applicationsDb = [];

"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Home as HomeIcon,
    Info as AboutIcon,
    ChevronDown,
    ChevronRight,
    GraduationCap,
    Award,
    Users,
    Briefcase,
    UserCheck,
    Quote,
    Handshake,
    Mail,
    MessageSquare,
    Inbox,
    Play,
    BookOpen,
    Calendar,
    FileText,
    Image,
    Download,
    HelpCircle,
    LayoutDashboard,
} from "lucide-react"

// Import dashboard components
import Overview from "./Overview.jsx"
import Home from "./Home.jsx"
import About from "./About.jsx"
import ContactEntries from "./ContactEntries.jsx"
import CourseApplications from "./CourseApplications.jsx"
import VideoTestimonials from "./VideoTestimonials.jsx"
import Courses from "./Courses.jsx"
import Events from "./Events.jsx"
import Blogs from "./Blogs.jsx"
import Gallery from "./Gallery.jsx"
import Downloads from "./Downloads.jsx"
import FAQ from "./FAQ.jsx"
import Applications from "./Applications.jsx"
import Students from "./Students.jsx"
import EnquiryTypes from "./EnquiryTypes.jsx"
import StudentConsulting from "./StudentConsulting.jsx"
import EventRegistrations from "./EventRegistrations.jsx"
import ScholarshipApplications from "./ScholarshipApplications.jsx"
import PartnershipApplications from "./PartnershipApplications.jsx"

// Sidebar configuration with Home, About, and Contact Inquiries tabs
const sidebarItems = [
    {
        title: "Dashboard",
        Icon: LayoutDashboard,
        Content: Overview,
    },
    {
        title: "Home",
        Icon: HomeIcon,
        Content: Home,
        subItems: [
            {
                id: "academic-partners",
                title: "Academic Partners",
                Icon: GraduationCap,
            },
            {
                id: "featured-certifications",
                title: "Featured Certifications",
                Icon: Award,
            },
            {
                id: "testimonials",
                title: "Student Success Stories",
                Icon: Quote,
            },
        ],
    },
    {
        title: "About",
        Icon: AboutIcon,
        Content: About,
        subItems: [

            {
                id: "mentors",
                title: "Mentors",
                Icon: Users,
            },
            {
                id: "careers",
                title: "Careers & Openings",
                Icon: Briefcase,
            },

            {
                id: "alumni",
                title: "Our Alumni",
                Icon: UserCheck,
            },

        ],
    },
    {
        title: "Resources",
        Icon: BookOpen,
        Content: Blogs,
        subItems: [
            {
                id: "blogs",
                title: "Blogs",
                Icon: FileText,
            },
            {
                id: "gallery",
                title: "Gallery",
                Icon: Image,
            },
            {
                id: "faq",
                title: "FAQ",
                Icon: HelpCircle,
            },
        ],
    },
    {
        title: "Partnerships",
        Icon: Handshake,
        Content: PartnershipApplications,
        subItems: [
            {
                id: "educational-partnership",
                title: "Educational",
                Icon: GraduationCap,
            },
            {
                id: "corporate-partnership",
                title: "Corporate",
                Icon: Briefcase,
            }
        ]
    },
    {
        title: "Events",
        Icon: Calendar,
        Content: Events,
        subItems: [
            {
                id: "manage-events",
                title: "Manage Events",
                Icon: Calendar,
            },
            {
                id: "view-registrations",
                title: "View Registrations",
                Icon: Users,
            },
        ],
    },

    {
        title: "Contact Inquiries",
        Icon: Mail,
        Content: ContactEntries,
        subItems: [
            {
                id: "inquiries-list",
                title: "View Inquiries",
                Icon: Inbox,
            },
            {
                id: "enquiry-types",
                title: "Enquiry Types",
                Icon: FileText,
            }
        ]
    },
    {
        title: "Student Consulting",
        Icon: MessageSquare,
        Content: StudentConsulting,
    },
    {
        title: "Course Applications",
        Icon: GraduationCap,
        Content: CourseApplications,
    },
    {
        title: "Scholarship Applications",
        Icon: Award,
        Content: ScholarshipApplications,
    },
    {
        title: "Faculty Applications",
        Icon: Briefcase,
        Content: Applications,
    },
]

function Sidebar({ isOpen: propIsOpen }) {
    const [activeTab, setActiveTab] = useState(() => {
        try { return localStorage.getItem("bitc_activeTab") || "Dashboard" } catch { return "Dashboard" }
    })
    const [activeSubTopic, setActiveSubTopic] = useState(() => {
        try { return localStorage.getItem("bitc_activeSubTopic") || "academic-partners" } catch { return "academic-partners" }
    })
    const [expandedMenu, setExpandedMenu] = useState(() => {
        try {
            const tab = localStorage.getItem("bitc_activeTab") || "Dashboard"
            return { [tab]: true }
        } catch { return { Dashboard: true } }
    })
    const [isMobile, setIsMobile] = useState(false)
    const [isOpen, setIsOpen] = useState(propIsOpen)

    // Handle Responsive Layout
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (mobile) setIsOpen(false)
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Sync open state with parent prop on desktop
    useEffect(() => {
        if (!isMobile) setIsOpen(propIsOpen)
    }, [propIsOpen, isMobile])

    const toggleExpand = (title) => {
        setExpandedMenu((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    const iconColors = [
        { bg: "bg-blue-100", text: "text-blue-600" },
        { bg: "bg-purple-100", text: "text-purple-600" },
        { bg: "bg-green-100", text: "text-green-600" },
        { bg: "bg-cyan-100", text: "text-cyan-600" },
        { bg: "bg-orange-100", text: "text-orange-600" },
        { bg: "bg-pink-100", text: "text-pink-600" },
        { bg: "bg-yellow-100", text: "text-yellow-600" },
        { bg: "bg-red-100", text: "text-red-600" },
        { bg: "bg-teal-100", text: "text-teal-600" },
        { bg: "bg-indigo-100", text: "text-indigo-600" },
    ];

    const renderSidebarItem = (item, index) => {
        const isParentActive = activeTab === item.title
        const isExpanded = !!expandedMenu[item.title]
        const colorStyle = iconColors[index % iconColors.length];

        return (
            <div key={index} className="flex flex-col mb-1.5">
                {/* Parent Menu Item */}
                <motion.div
                    className="relative group pr-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <button
                        onClick={() => {
                            setActiveTab(item.title)
                            try { localStorage.setItem("bitc_activeTab", item.title) } catch {}
                            if (item.subItems && item.subItems.length > 0) {
                                setActiveSubTopic(item.subItems[0].id)
                                try { localStorage.setItem("bitc_activeSubTopic", item.subItems[0].id) } catch {}
                            }
                            toggleExpand(item.title)
                        }}
                        className={`flex items-center justify-between w-full py-3 px-4 text-left transition-all duration-200 ease-in-out rounded-r-full text-sm font-semibold cursor-pointer ${
                            isParentActive
                                ? "bg-[#d9efff] text-gray-900"
                                : "text-gray-700 hover:bg-[#e4ebf3]"
                        }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorStyle.bg}`}>
                                <item.Icon
                                    className={`w-4 h-4 ${colorStyle.text}`}
                                />
                            </div>
                            {isOpen && (
                                <span className={`font-semibold ${isParentActive ? "text-gray-900" : "text-gray-700"}`}>
                                    {item.title}
                                </span>
                            )}
                        </div>

                        {isOpen && item.subItems && (
                            <div className="text-gray-400">
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-blue-600" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </div>
                        )}
                    </button>
                </motion.div>

                {/* Sub-Topics Dropdown List */}
                {isOpen && item.subItems && (
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden flex flex-col pl-6 pr-2 mt-1 space-y-1"
                            >
                                {item.subItems.map((sub) => {
                                    const isSubActive =
                                        isParentActive && activeSubTopic === sub.id

                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                setActiveTab(item.title)
                                                setActiveSubTopic(sub.id)
                                                try {
                                                    localStorage.setItem("bitc_activeTab", item.title)
                                                    localStorage.setItem("bitc_activeSubTopic", sub.id)
                                                } catch {}
                                                if (isMobile) setIsOpen(false)
                                            }}
                                            className={`flex items-center space-x-2.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                                                isSubActive
                                                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                        >
                                            <sub.Icon
                                                className={`w-3.5 h-3.5 ${
                                                    isSubActive ? "text-white" : "text-gray-500"
                                                }`}
                                            />
                                            <span>{sub.title}</span>
                                        </button>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        )
    }

    return (
        <div className="relative h-full">
            <div className="flex h-[calc(100vh-5rem)]">
                {/* Sidebar Navigation */}
                <motion.div
                    className="sidebar flex flex-col pt-4 bg-[#f4f7f9] z-10 overflow-y-auto pb-10 overflow-x-hidden [&::-webkit-scrollbar]:hidden"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                    animate={{ width: isOpen ? "17.5rem" : "5rem" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    <div className="flex-1 w-full">
                        {sidebarItems.map((item, index) => renderSidebarItem(item, index))}
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="content flex-1 bg-[#f4f7f9] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTab}-${activeSubTopic}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="h-full"
                        >
                            {activeTab === "Dashboard" && (
                                <Overview />
                            )}
                            {activeTab === "Home" && (
                                <Home
                                    activeSubTopic={activeSubTopic}
                                    setActiveSubTopic={setActiveSubTopic}
                                />
                            )}
                            {activeTab === "About" && (
                                <About
                                    activeSubTopic={activeSubTopic}
                                />
                            )}
                            {activeTab === "Events" && (activeSubTopic === "manage-events" || !activeSubTopic) && (
                                <Events />
                            )}
                            {activeTab === "Events" && activeSubTopic === "view-registrations" && (
                                <EventRegistrations />
                            )}
                            {activeTab === "Resources" && (activeSubTopic === "blogs" || !["gallery", "downloads", "faq"].includes(activeSubTopic)) && (
                                <Blogs />
                            )}
                            {activeTab === "Resources" && activeSubTopic === "gallery" && (
                                <Gallery />
                            )}
                            {activeTab === "Resources" && activeSubTopic === "downloads" && (
                                <Downloads />
                            )}
                            {activeTab === "Resources" && activeSubTopic === "faq" && (
                                <FAQ />
                            )}
                            {activeTab === "Partnerships" && (
                                <PartnershipApplications 
                                    activeSubTopic={activeSubTopic}
                                />
                            )}

                            {activeTab === "Contact Inquiries" && (activeSubTopic === "inquiries-list" || !activeSubTopic) && (
                                <ContactEntries />
                            )}
                            {activeTab === "Contact Inquiries" && activeSubTopic === "enquiry-types" && (
                                <EnquiryTypes />
                            )}
                            {activeTab === "Student Consulting" && (
                                <StudentConsulting />
                            )}
                            {activeTab === "Course Applications" && (
                                <CourseApplications />
                            )}
                            {activeTab === "Scholarship Applications" && (
                                <ScholarshipApplications />
                            )}
                            {activeTab === "Faculty Applications" && (
                                <Applications />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
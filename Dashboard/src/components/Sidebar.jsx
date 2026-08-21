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
} from "lucide-react"

// Import dashboard components
import Home from "./Home.jsx"
import About from "./About.jsx"
import ContactEntries from "./ContactEntries.jsx"
import CourseApplications from "./CourseApplications.jsx"
import EmployeeTestimonials from "./EmployeeTestimonials.jsx"
import VideoTestimonials from "./VideoTestimonials.jsx"
import Courses from "./Courses.jsx"
import Events from "./Events.jsx"
import Blogs from "./Blogs.jsx"
import Gallery from "./Gallery.jsx"
import Downloads from "./Downloads.jsx"
import FAQ from "./FAQ.jsx"
import Applications from "./Applications.jsx"
import Students from "./Students.jsx"

// Sidebar configuration with Home, About, and Contact Inquiries tabs
const sidebarItems = [
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
                id: "industry-partners",
                title: "Industry Partners",
                Icon: Handshake,
            },

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
            {
                id: "employee-testimonials",
                title: "Employee Success Stories",
                Icon: Quote,
            },
        ],
    },
    {
        title: "Placements",
        Icon: Briefcase,
        Content: VideoTestimonials,
        subItems: [
            {
                id: "video-testimonials",
                title: "Video Testimonials",
                Icon: VideoTestimonials.Icon || Play,
            },
        ],
    },
    {
        title: "Events",
        Icon: Calendar,
        Content: Events,
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
                id: "downloads",
                title: "Downloads",
                Icon: Download,
            },
            {
                id: "faq",
                title: "FAQ",
                Icon: HelpCircle,
            },
        ],
    },

    {
        title: "Contact Inquiries",
        Icon: Mail,
        Content: ContactEntries,
    },
    {
        title: "Course Applications",
        Icon: GraduationCap,
        Content: CourseApplications,
    },
    {
        title: "Job Applications",
        Icon: Briefcase,
        Content: Applications,
    },
]

function Sidebar({ isOpen: propIsOpen }) {
    const [activeTab, setActiveTab] = useState(() => {
        try { return localStorage.getItem("bitc_activeTab") || "Home" } catch { return "Home" }
    })
    const [activeSubTopic, setActiveSubTopic] = useState(() => {
        try { return localStorage.getItem("bitc_activeSubTopic") || "academic-partners" } catch { return "academic-partners" }
    })
    const [expandedMenu, setExpandedMenu] = useState(() => {
        try {
            const tab = localStorage.getItem("bitc_activeTab") || "Home"
            return { [tab]: true }
        } catch { return { Home: true } }
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

    const renderSidebarItem = (item, index) => {
        const isParentActive = activeTab === item.title
        const isExpanded = !!expandedMenu[item.title]

        return (
            <div key={index} className="flex flex-col mb-1.5">
                {/* Parent Menu Item */}
                <motion.div
                    className="relative group px-2"
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
                        className={`flex items-center justify-between w-full py-2.5 px-3.5 text-left transition-all duration-200 ease-in-out rounded-xl text-sm font-bold cursor-pointer ${
                            isParentActive
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <item.Icon
                                className={`w-4 h-4 ${
                                    isParentActive ? "text-blue-700" : "text-gray-500"
                                }`}
                            />
                            {isOpen && (
                                <span className="font-bold text-gray-800">
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
                    className="sidebar flex flex-col shadow-sm pt-6 bg-white z-10 border-r border-gray-100"
                    animate={{ width: isOpen ? "16rem" : "5rem" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    <div className="px-3 mb-2">
                        {isOpen && (
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                                Navigation
                            </p>
                        )}
                    </div>
                    {sidebarItems.map((item, index) => renderSidebarItem(item, index))}
                </motion.div>

                {/* Main Content Area */}
                <div className="content flex-1 bg-gray-50/40 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTab}-${activeSubTopic}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="h-full"
                        >
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
                            {activeTab === "Placements" && (
                                <VideoTestimonials />
                            )}
                            {activeTab === "Events" && (
                                <Events />
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

                            {activeTab === "Contact Inquiries" && (
                                <ContactEntries />
                            )}
                            {activeTab === "Course Applications" && (
                                <CourseApplications />
                            )}
                            {activeTab === "Job Applications" && (
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
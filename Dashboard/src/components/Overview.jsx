import React, { useState, useEffect } from "react";
import { 
    Users, Award, Briefcase, GraduationCap, Quote, Calendar, 
    Image, FileText, Handshake, Inbox, MessageSquare, 
    Building2, CircleHelp
} from "lucide-react";
import { getApiUrl, getSiteUrl } from "../utils";

const apiUrl = getApiUrl();
const siteUrl = getSiteUrl();

const Overview = () => {
    const [counts, setCounts] = useState({
        certifications: 0,
        mentors: 0,
        alumni: 0,
        inquiries: 0,
        counseling: 0,
        courseApps: 0,
        scholarships: 0,
        careerApps: 0,
        partnershipApps: 0,
        industryPartners: 0,
        hiringPartners: 0,
        events: 0,
        eventBookings: 0,
        testimonials: 0,
        gallery: 0,
        blogs: 0,
        jobOpenings: 0,
        faqs: 0
    });

    const handleCardClick = (tab, subTopic) => {
        if (!tab) return;
        window.dispatchEvent(new CustomEvent("bitc:navigate", { detail: { tab, subTopic } }));
    };

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [
                    certs, mentors, alums, contacts, counseling, courseApps, scholarships, careerApps,
                    partnerApps, indPartners, hirePartners, evts, regs, testis, gallery, blogs, jobs, faqs
                ] = await Promise.all([
                    fetch(`${apiUrl}/certifications`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/mentors`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/alumni`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/contact`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/inquiries`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/admin/applications`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/scholarships`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/careers/applications`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/partnership-applications`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/industry-partners`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/partners`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/events`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/event-registrations`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/testimonials`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/gallery`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/blogs`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/careers`).then(r => r.json()).catch(() => ({})),
                    fetch(`${apiUrl}/faq`).then(r => r.json()).catch(() => ({}))
                ]);

                // Deduplicate published blogs
                let blogCount = 0;
                if (Array.isArray(blogs?.blogs)) {
                    const seenIds = new Set();
                    const seenSlugs = new Set();
                    const seenTitles = new Set();
                    const normSlug = (s) => (s ? String(s).trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "") : "");
                    const normTitle = (s) => (s ? String(s).trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ") : "");
                    for (const b of blogs.blogs) {
                        if (!b) continue;
                        const idKey = b.id ? String(b.id).trim().toLowerCase() : "";
                        const slugKey = normSlug(b.slug);
                        const titleKey = normTitle(b.title);
                        if (idKey && seenIds.has(idKey)) continue;
                        if (slugKey && seenSlugs.has(slugKey)) continue;
                        if (titleKey && seenTitles.has(titleKey)) continue;
                        if (idKey) seenIds.add(idKey);
                        if (slugKey) seenSlugs.add(slugKey);
                        if (titleKey) seenTitles.add(titleKey);
                        blogCount++;
                    }
                } else {
                    blogCount = blogs?.blogs?.length || 0;
                }

                setCounts({
                    certifications: certs?.certifications?.length || (Array.isArray(certs) ? certs.length : 0),
                    mentors: mentors?.mentors?.length || (Array.isArray(mentors) ? mentors.length : 0),
                    alumni: alums?.alumni?.length || (Array.isArray(alums) ? alums.length : 0),
                    inquiries: contacts?.inquiries?.length || (Array.isArray(contacts) ? contacts.length : 0),
                    counseling: counseling?.inquiries?.length || (Array.isArray(counseling) ? counseling.length : 0),
                    courseApps: courseApps?.applications?.length || (Array.isArray(courseApps) ? courseApps.length : 0),
                    scholarships: scholarships?.applications?.length || (Array.isArray(scholarships) ? scholarships.length : 0),
                    careerApps: careerApps?.applications?.length || (Array.isArray(careerApps) ? careerApps.length : 0),
                    partnershipApps: partnerApps?.applications?.length || (Array.isArray(partnerApps) ? partnerApps.length : 0),
                    industryPartners: indPartners?.partners?.length || (Array.isArray(indPartners) ? indPartners.length : 0),
                    hiringPartners: hirePartners?.partners?.length || (Array.isArray(hirePartners) ? hirePartners.length : 0),
                    events: evts?.events?.length || (Array.isArray(evts) ? evts.length : 0),
                    eventBookings: regs?.registrations?.length || (Array.isArray(regs) ? regs.length : 0),
                    testimonials: testis?.testimonials?.length || (Array.isArray(testis) ? testis.length : 0),
                    gallery: gallery?.items?.length || gallery?.gallery?.length || (Array.isArray(gallery) ? gallery.length : 0),
                    blogs: blogCount,
                    jobOpenings: jobs?.openings?.length || jobs?.careers?.length || (Array.isArray(jobs) ? jobs.length : 0),
                    faqs: faqs?.items?.length || (Array.isArray(faqs) ? faqs.length : 0)
                });
            } catch (err) {
                console.error("Failed to fetch overview counts", err);
            }
        };

        fetchCounts();
    }, []);

    // Clean list of all administrative sections matching the original layout
    const statCards = [
        { 
            label: "Total Certifications", 
            value: counts.certifications, 
            icon: Award, 
            color: "bg-blue-100 text-blue-600",
            tab: "Home",
            subTopic: "featured-certifications"
        },
        { 
            label: "Total Mentors", 
            value: counts.mentors, 
            icon: Users, 
            color: "bg-purple-100 text-purple-600",
            tab: "About",
            subTopic: "mentors"
        },
        { 
            label: "Our Alumni", 
            value: counts.alumni, 
            icon: GraduationCap, 
            color: "bg-green-100 text-green-600",
            tab: "About",
            subTopic: "alumni"
        },
        { 
            label: "Contact Inquiries", 
            value: counts.inquiries, 
            icon: Inbox, 
            color: "bg-cyan-100 text-cyan-600",
            tab: "Contact Inquiries",
            subTopic: "inquiries-list"
        },
        { 
            label: "Student Counseling", 
            value: counts.counseling, 
            icon: MessageSquare, 
            color: "bg-emerald-100 text-emerald-600",
            tab: "Student Counseling",
            subTopic: ""
        },
        { 
            label: "Scholarship Applications", 
            value: counts.scholarships, 
            icon: Award, 
            color: "bg-amber-100 text-amber-600",
            tab: "Scholarship Applications",
            subTopic: ""
        },
        { 
            label: "Career Applications", 
            value: counts.careerApps, 
            icon: Briefcase, 
            color: "bg-violet-100 text-violet-600",
            tab: "Career Applications",
            subTopic: ""
        },
        { 
            label: "Course Applications", 
            value: counts.courseApps, 
            icon: GraduationCap, 
            color: "bg-teal-100 text-teal-600",
            tab: "Course Applications",
            subTopic: ""
        },
        { 
            label: "Partnership Proposals", 
            value: counts.partnershipApps, 
            icon: Handshake, 
            color: "bg-rose-100 text-rose-600",
            tab: "Partnerships",
            subTopic: "corporate-partnership"
        },
        { 
            label: "Event Bookings", 
            value: counts.eventBookings, 
            icon: Calendar, 
            color: "bg-orange-100 text-orange-600",
            tab: "Events",
            subTopic: "view-registrations"
        },
        { 
            label: "Industrial Partners", 
            value: counts.industryPartners, 
            icon: Building2, 
            color: "bg-sky-100 text-sky-600",
            tab: "Partnerships",
            subTopic: "industrial-partners"
        },
        { 
            label: "Top Recruiters", 
            value: counts.hiringPartners, 
            icon: Briefcase, 
            color: "bg-blue-100 text-blue-700",
            tab: "Home",
            subTopic: "top-recruiters"
        },
        { 
            label: "Testimonials", 
            value: counts.testimonials, 
            icon: Quote, 
            color: "bg-pink-100 text-pink-600",
            tab: "Home",
            subTopic: "testimonials"
        },
        { 
            label: "Video/Image Gallery", 
            value: counts.gallery, 
            icon: Image, 
            color: "bg-yellow-100 text-yellow-600",
            tab: "Resources",
            subTopic: "gallery"
        },
        { 
            label: "Published Blogs", 
            value: counts.blogs, 
            icon: FileText, 
            color: "bg-indigo-100 text-indigo-600",
            tab: "Resources",
            subTopic: "blogs"
        },
        { 
            label: "Job Openings", 
            value: counts.jobOpenings, 
            icon: Briefcase, 
            color: "bg-lime-100 text-lime-700",
            tab: "About",
            subTopic: "careers"
        },
        { 
            label: "Platform FAQs", 
            value: counts.faqs, 
            icon: CircleHelp, 
            color: "bg-slate-100 text-slate-600",
            tab: "Resources",
            subTopic: "faq"
        },
    ];

    return (
        <div className="p-5 md:p-6 pb-16 max-w-[1500px]">
            <h1 className="text-2xl font-black text-gray-800 mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                   <Award className="w-4 h-4 text-orange-500" />
                </div>
                Dashboard
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {statCards.map((stat, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => handleCardClick(stat.tab, stat.subTopic)}
                        className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 flex items-center space-x-3.5 hover:shadow-md transition-shadow cursor-pointer hover:border-gray-200"
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-gray-500 text-xs font-medium mb-0.5 truncate" title={stat.label}>{stat.label}</p>
                            <h3 className="text-2xl font-medium text-gray-700 leading-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Overview;
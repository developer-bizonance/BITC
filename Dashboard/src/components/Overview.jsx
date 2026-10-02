import React, { useState, useEffect } from "react";
import { Users, Award, Briefcase, GraduationCap, Quote, Calendar, Image, FileText, Handshake, Inbox } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Overview = () => {
    const [counts, setCounts] = useState({
        certifications: 0,
        mentors: 0,
        inquiries: 0,
        events: 0,
        testimonials: 0,
        blogs: 0,
        gallery: 0,
        alumni: 0
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [certs, mentors, inqs, evts, testis, blogs, gals, alums] = await Promise.all([
                    fetch(`${apiUrl}/certifications`).then(res => res.json()).catch(() => ({})),
                    fetch(`${apiUrl}/mentors`).then(res => res.json()).catch(() => ({})),
                    fetch(`${apiUrl}/inquiries`).then(res => res.json()).catch(() => ({})),
                    fetch(`${apiUrl}/events`).then(res => res.json()).catch(() => ({})),
                    fetch(`${apiUrl}/testimonials`).then(res => res.json()).catch(() => ({})),
                    fetch(`${apiUrl}/blogs`).then(res => res.json()).catch(() => ({})),
                    fetch(`${apiUrl}/gallery`).then(res => res.json()).catch(() => ({})),
                    fetch(`${apiUrl}/alumni`).then(res => res.json()).catch(() => ({})),
                ]);

                setCounts({
                    certifications: certs?.certifications?.length || 0,
                    mentors: mentors?.mentors?.length || 0,
                    inquiries: inqs?.inquiries?.length || 0,
                    events: evts?.events?.length || 0,
                    testimonials: testis?.testimonials?.length || 0,
                    blogs: blogs?.blogs?.length || 0,
                    gallery: gals?.gallery?.length || 0,
                    alumni: alums?.alumni?.length || 0,
                });
            } catch (err) {
                console.error("Failed to fetch overview counts", err);
            }
        };

        fetchCounts();
    }, []);

    const statCards = [
        { label: "Total Certifications", value: counts.certifications, icon: Award, color: "bg-blue-100 text-blue-600" },
        { label: "Total Mentors", value: counts.mentors, icon: Users, color: "bg-purple-100 text-purple-600" },
        { label: "Our Alumni", value: counts.alumni, icon: GraduationCap, color: "bg-green-100 text-green-600" },
        { label: "Contact Inquiries", value: counts.inquiries, icon: Inbox, color: "bg-cyan-100 text-cyan-600" },
        { label: "Event Bookings", value: counts.events, icon: Calendar, color: "bg-orange-100 text-orange-600" },
        { label: "Testimonials", value: counts.testimonials, icon: Quote, color: "bg-pink-100 text-pink-600" },
        { label: "Video/Image Gallery", value: counts.gallery, icon: Image, color: "bg-yellow-100 text-yellow-600" },
        { label: "Published Blogs", value: counts.blogs, icon: FileText, color: "bg-indigo-100 text-indigo-600" },
    ];

    return (
        <div className="p-8 pb-20">
            <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                   <Award className="w-5 h-5 text-orange-500" />
                </div>
                Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition-shadow">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Overview;

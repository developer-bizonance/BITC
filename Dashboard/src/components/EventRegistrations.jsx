import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, Search, RefreshCw, GraduationCap } from "lucide-react";
import { getApiUrl } from "../utils";

const EventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = getApiUrl();

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/event-registrations`);
      if (res.ok) {
        const data = await res.json();
        if (data.registrations) setRegistrations(data.registrations);
      }
    } catch (err) {
      console.warn("Failed to fetch event registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    return (
      reg.name?.toLowerCase().includes(q) ||
      reg.email?.toLowerCase().includes(q) ||
      reg.phone?.toLowerCase().includes(q) ||
      reg.event?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" /> Event Registrations
          </h1>
          <p className="text-gray-500 mt-2">View students registered for upcoming events.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
          />
        </div>
        <button
          onClick={fetchRegistrations}
          className="flex items-center gap-2 px-4 py-2 hover: text-sm whitespace-nowrap hover: bg-blue-400/30 text-slate-900 hover:bg-blue-400/40 font-medium rounded-3xl shadow-md transition-all active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-transparent p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No Registrations Found</h3>
          <p className="text-gray-500">There are no event registrations matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#EDF2FA] text-[#294B7A] text-[11px] uppercase tracking-[0.1em] font-bold border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Education</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRegistrations.map((reg) => {
                  const createdDate = new Date(reg.createdAt);
                  const day = createdDate.getDate().toString().padStart(2, '0');
                  const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');
                  const year = createdDate.getFullYear();
                  const formattedDate = `${day}-${month}-${year}`;
                  const formattedTime = createdDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                      {/* Date */}
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <p className="font-medium text-[#64748B] text-[12px]">{formattedDate}</p>
                        <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{formattedTime}</p>
                      </td>

                      {/* Name & Email */}
                      <td className="px-6 py-5 align-middle max-w-[200px]">
                        <p className="font-medium text-[#334155] text-[13px] truncate whitespace-normal">
                          {reg.name}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] font-medium truncate whitespace-normal mt-0.5">
                          {reg.email}
                        </p>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-5 align-middle whitespace-nowrap">
                        <p className="text-[12px] text-[#475569] font-medium">
                          {reg.phone}
                        </p>
                      </td>

                      {/* Event */}
                      <td className="px-6 py-5 align-middle">
                        {reg.event ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-[#334155] text-[13px]">{reg.event.title}</span>
                            <span className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                              {new Date(reg.event.date).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                            General Update / Newsletter
                          </span>
                        )}
                      </td>

                      {/* Education */}
                      <td className="px-6 py-5 align-middle max-w-[250px]">
                        {(reg.college || reg.course || reg.graduationYear) ? (
                          <div className="flex flex-col text-[12px] text-[#475569] space-y-0.5">
                            {reg.college && <span className="font-medium truncate whitespace-normal">{reg.college}</span>}
                            {reg.course && <span className="truncate whitespace-normal">Course: {reg.course}</span>}
                            {reg.graduationYear && <span>Year: {reg.graduationYear}</span>}
                          </div>
                        ) : (
                          <span className="text-[#94A3B8] text-[12px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;

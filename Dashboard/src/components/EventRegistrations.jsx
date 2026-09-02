import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, Search, RefreshCw, GraduationCap } from "lucide-react";

const EventRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium text-sm whitespace-nowrap"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Registrations Found</h3>
          <p className="text-gray-500">There are no event registrations matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Education</th>
                  <th className="px-6 py-4">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {reg.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-600 gap-2">
                          <Mail className="w-3.5 h-3.5 text-blue-500" />
                          <span>{reg.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600 gap-2">
                          <Phone className="w-3.5 h-3.5 text-green-500" />
                          <span>{reg.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {reg.event ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-blue-700">{reg.event.title}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(reg.event.date).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          General Update / Newsletter
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {(reg.college || reg.course || reg.graduationYear) ? (
                        <div className="flex flex-col text-xs space-y-1">
                          {reg.college && <span className="font-medium text-gray-800 flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-purple-500"/> {reg.college}</span>}
                          {reg.course && <span className="text-gray-600">Course: {reg.course}</span>}
                          {reg.graduationYear && <span className="text-gray-600">Year: {reg.graduationYear}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-500 gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(reg.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;

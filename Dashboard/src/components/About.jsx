import React, { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  ExternalLink,
  Plus,
  Trash2,
  Pencil,
  RefreshCw,
  CheckCircle,
  X,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  Clock,
  Layers,
  Globe,
  MessageSquare,
  Building2,
  Handshake,
  MapPin,
  Star,
  Quote,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./uic/SortableItem";

import EmployeeTestimonials from "./EmployeeTestimonials.jsx";

const About = ({ activeSubTopic = "mentors" }) => {
  // Mentors State
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [isEditMentorOpen, setIsEditMentorOpen] = useState(false);
  const [editingMentorId, setEditingMentorId] = useState(null);
  const [submittingMentor, setSubmittingMentor] = useState(false);
  const [updatingMentor, setUpdatingMentor] = useState(false);
  const [imgError, setImgError] = useState({});

  // Careers / Job Openings State
  const [openings, setOpenings] = useState([]);
  const [openingsLoading, setOpeningsLoading] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [submittingJob, setSubmittingJob] = useState(false);
  const [updatingJob, setUpdatingJob] = useState(false);



  // Alumni State
  const [alumni, setAlumni] = useState([]);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const [isAddAlumniOpen, setIsAddAlumniOpen] = useState(false);
  const [isEditAlumniOpen, setIsEditAlumniOpen] = useState(false);
  const [editingAlumniId, setEditingAlumniId] = useState(null);
  const [submittingAlumni, setSubmittingAlumni] = useState(false);
  const [updatingAlumni, setUpdatingAlumni] = useState(false);
  const [alumniImgError, setAlumniImgError] = useState({});

  // Alumni Companies ("Where Our Alumni Works") State
  const [alumniCompanies, setAlumniCompanies] = useState([]);
  const [alumniCompaniesLoading, setAlumniCompaniesLoading] = useState(false);
  const [isAddAlumniCompanyOpen, setIsAddAlumniCompanyOpen] = useState(false);
  const [isEditAlumniCompanyOpen, setIsEditAlumniCompanyOpen] = useState(false);
  const [editingAlumniCompanyId, setEditingAlumniCompanyId] = useState(null);
  const [submittingAlumniCompany, setSubmittingAlumniCompany] = useState(false);
  const [updatingAlumniCompany, setUpdatingAlumniCompany] = useState(false);

  // Industry Partners State
  const [industryPartners, setIndustryPartners] = useState([]);
  const [industryPartnersLoading, setIndustryPartnersLoading] = useState(false);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [submittingPartner, setSubmittingPartner] = useState(false);
  const [updatingPartner, setUpdatingPartner] = useState(false);



  const [notification, setNotification] = useState(null);

  // Mentor Form Data
  const [mentorForm, setMentorForm] = useState({
    name: "",
    role: "Senior Software Engineer",
    company: "Google",
    exp: "10+ Years",
    area: "Full Stack Development",
    skills: "React, Node.js, System Design",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    thought: "",
  });

  const [editMentorForm, setEditMentorForm] = useState({
    name: "",
    role: "",
    company: "",
    exp: "",
    area: "",
    skills: "",
    img: "",
    thought: "",
  });

  // Job Opening Form Data
  const [jobForm, setJobForm] = useState({
    title: "",
    type: "Full-Time",
    location: "On-Site",
    experience: "2+ Years",
    department: "Academic & Training",
    description: "",
  });

  const [editJobForm, setEditJobForm] = useState({
    title: "",
    type: "Full-Time",
    location: "On-Site",
    experience: "2+ Years",
    department: "Academic & Training",
    description: "",
    status: "Active",
  });


  // Alumni Form Data
  const [alumniForm, setAlumniForm] = useState({
    name: "",
    role: "Software Engineer",
    company: "Google",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    batch: "2024",
    certification: "",
    linkedin: "",
  });

  const [editAlumniForm, setEditAlumniForm] = useState({
    name: "",
    role: "",
    company: "",
    photo: "",
    batch: "2024",
    certification: "",
    linkedin: "",
  });

  // Alumni Companies ("Where Our Alumni Works") Form Data
  const [alumniCompanyForm, setAlumniCompanyForm] = useState({
    name: "",
    logo: "",
    website: "",
  });

  const [editAlumniCompanyForm, setEditAlumniCompanyForm] = useState({
    name: "",
    logo: "",
    website: "",
  });

  // Industry Partner Form Data
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    category: "IT & Services",
    logo: "",
    website: "",
  });

  const [editPartnerForm, setEditPartnerForm] = useState({
    name: "",
    category: "IT & Services",
    logo: "",
    website: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event, listKey, setList, routeName) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Call backend API to save new order
        fetch(`${apiUrl}/${routeName}/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedIds: newOrder.map((item) => item.id),
          }),
        }).catch((err) => {
          console.error(`Failed to reorder ${routeName}:`, err);
          showNotification(`Failed to reorder ${routeName}`, "error");
        });

        return newOrder;
      });
    }
  };

  // Fetch Mentors
  const fetchMentors = async () => {
    setMentorsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/mentors`);
      if (res.ok) {
        const data = await res.json();
        if (data.mentors) setMentors(data.mentors);
      }
    } catch (err) {
      console.warn("Failed to fetch mentors:", err);
    } finally {
      setMentorsLoading(false);
    }
  };

  // Fetch Careers
  const fetchCareers = async () => {
    setOpeningsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/careers`);
      if (res.ok) {
        const data = await res.json();
        if (data.openings) setOpenings(data.openings);
      }
    } catch (err) {
      console.warn("Failed to fetch careers:", err);
    } finally {
      setOpeningsLoading(false);
    }
  };



  // Fetch Alumni
  const fetchAlumni = async () => {
    setAlumniLoading(true);
    try {
      const res = await fetch(`${apiUrl}/alumni`);
      if (res.ok) {
        const data = await res.json();
        if (data.alumni) setAlumni(data.alumni);
      }
    } catch (err) {
      console.warn("Failed to fetch alumni:", err);
    } finally {
      setAlumniLoading(false);
    }
  };

  // Fetch Alumni Companies ("Where Our Alumni Works")
  const fetchAlumniCompanies = async () => {
    setAlumniCompaniesLoading(true);
    try {
      const res = await fetch(`${apiUrl}/alumni-companies`);
      if (res.ok) {
        const data = await res.json();
        if (data.companies) setAlumniCompanies(data.companies);
      }
    } catch (err) {
      console.warn("Failed to fetch alumni companies:", err);
    } finally {
      setAlumniCompaniesLoading(false);
    }
  };

  // Fetch Industry Partners
  const fetchIndustryPartners = async () => {
    setIndustryPartnersLoading(true);
    try {
      const res = await fetch(`${apiUrl}/industry-partners`);
      if (res.ok) {
        const data = await res.json();
        if (data.partners) setIndustryPartners(data.partners);
      }
    } catch (err) {
      console.warn("Failed to fetch industry partners:", err);
    } finally {
      setIndustryPartnersLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchCareers();
    fetchAlumni();
    fetchAlumniCompanies();
    fetchIndustryPartners();
  }, []);

  // Handle Add Mentor
  const handleAddMentor = async (e) => {
    e.preventDefault();
    if (!mentorForm.name.trim()) {
      showNotification("Please enter mentor's full name", "error");
      return;
    }

    setSubmittingMentor(true);
    try {
      const res = await fetch(`${apiUrl}/mentors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mentorForm,
          skills: mentorForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMentors(data.mentors || [data.mentor, ...mentors]);
        setIsAddMentorOpen(false);
        setMentorForm({
          name: "",
          role: "Senior Software Engineer",
          company: "Google",
          exp: "10+ Years",
          area: "Full Stack Development",
          skills: "React, Node.js, System Design",
          img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
        });
        showNotification("Mentor added successfully!");
      } else {
        showNotification(data.error || "Failed to add mentor", "error");
      }
    } catch (err) {
      showNotification("Network error while adding mentor", "error");
    } finally {
      setSubmittingMentor(false);
    }
  };

  // Handle Delete Mentor
  const handleDeleteMentor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Mentors?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/mentors/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setMentors(data.mentors || mentors.filter((m) => m.id !== id));
        showNotification(`"${name}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete mentor", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting mentor", "error");
    }
  };

  const openEditMentor = (mentor) => {
    setEditingMentorId(mentor.id);
    setEditMentorForm({
      name: mentor.name || "",
      role: mentor.role || "",
      company: mentor.company || "",
      exp: mentor.exp || "",
      area: mentor.area || "",
      skills: Array.isArray(mentor.skills) ? mentor.skills.join(", ") : mentor.skills || "",
      img: mentor.img || "",
    });
    setIsEditMentorOpen(true);
  };

  const handleUpdateMentor = async (e) => {
    e.preventDefault();
    if (!editMentorForm.name.trim()) {
      showNotification("Please enter mentor name", "error");
      return;
    }

    setUpdatingMentor(true);
    try {
      const res = await fetch(`${apiUrl}/mentors/${editingMentorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMentorForm),
      });

      const data = await res.json();

      if (res.ok) {
        setMentors(
          data.mentors ||
            mentors.map((m) =>
              m.id === editingMentorId ? data.mentor : m
            )
        );
        setIsEditMentorOpen(false);
        showNotification("Mentor updated successfully!");
      } else {
        showNotification(data.error || "Failed to update mentor", "error");
      }
    } catch (err) {
      showNotification("Network error while updating mentor", "error");
    } finally {
      setUpdatingMentor(false);
    }
  };

  // Handle Add Job Opening
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim()) {
      showNotification("Please enter job title", "error");
      return;
    }

    setSubmittingJob(true);
    try {
      const res = await fetch(`${apiUrl}/careers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });

      const data = await res.json();

      if (res.ok) {
        setOpenings(data.openings || [data.opening, ...openings]);
        setIsAddJobOpen(false);
        setJobForm({
          title: "",
          type: "Full-Time",
          location: "On-Site",
          experience: "2+ Years",
          department: "Academic & Training",
          description: "",
        });
        showNotification("Job opening posted successfully!");
      } else {
        showNotification(data.error || "Failed to post job opening", "error");
      }
    } catch (err) {
      showNotification("Network error while posting job", "error");
    } finally {
      setSubmittingJob(false);
    }
  };

  // Handle Delete Job Opening
  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove opening for "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/careers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setOpenings(data.openings || openings.filter((j) => j.id !== id));
        showNotification(`Opening "${title}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete job opening", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting job opening", "error");
    }
  };

  const openEditJob = (job) => {
    setEditingJobId(job.id);
    setEditJobForm({
      title: job.title || "",
      type: job.type || "Full-Time",
      location: job.location || "On-Site",
      experience: job.experience || "2+ Years",
      department: job.department || "Academic & Training",
      description: job.description || "",
      status: job.status || "Active",
    });
    setIsEditJobOpen(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editJobForm.title.trim()) {
      showNotification("Please enter job title", "error");
      return;
    }

    setUpdatingJob(true);
    try {
      const res = await fetch(`${apiUrl}/careers/${editingJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editJobForm),
      });

      const data = await res.json();

      if (res.ok) {
        setOpenings(
          data.openings ||
            openings.map((j) =>
              j.id === editingJobId ? data.opening : j
            )
        );
        setIsEditJobOpen(false);
        showNotification("Job opening updated successfully!");
      } else {
        showNotification(data.error || "Failed to update job opening", "error");
      }
    } catch (err) {
      showNotification("Network error while updating job opening", "error");
    } finally {
      setUpdatingJob(false);
    }
  };



  // Handle Add Alumni
  const handleAddAlumni = async (e) => {
    e.preventDefault();
    if (!alumniForm.name.trim()) {
      showNotification("Please enter alumni name", "error");
      return;
    }

    setSubmittingAlumni(true);
    try {
      const res = await fetch(`${apiUrl}/alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumniForm),
      });

      const data = await res.json();

      if (res.ok) {
        setAlumni(data.alumni || [data.newAlumni, ...alumni]);
        setIsAddAlumniOpen(false);
        setAlumniForm({
          name: "",
          role: "Software Engineer",
          company: "Google",
          photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
          batch: "2024",
          certification: "",
          linkedin: "",
        });
        showNotification("Alumni profile added successfully!");
      } else {
        showNotification(data.error || "Failed to add alumni", "error");
      }
    } catch (err) {
      showNotification("Network error while adding alumni", "error");
    } finally {
      setSubmittingAlumni(false);
    }
  };

  // Handle Delete Alumni
  const handleDeleteAlumni = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove alumni "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/alumni/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setAlumni(data.alumni || alumni.filter((a) => a.id !== id));
        showNotification(`Alumni "${name}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete alumni", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting alumni", "error");
    }
  };

  const openEditAlumni = (alumniItem) => {
    setEditingAlumniId(alumniItem.id);
    setEditAlumniForm({
      name: alumniItem.name || "",
      role: alumniItem.role || "",
      company: alumniItem.company || "",
      photo: alumniItem.photo || "",
      batch: alumniItem.batch || "2024",
      certification: alumniItem.certification || "",
      linkedin: alumniItem.linkedin || "",
    });
    setIsEditAlumniOpen(true);
  };

  const handleUpdateAlumni = async (e) => {
    e.preventDefault();
    if (!editAlumniForm.name.trim()) {
      showNotification("Please enter alumni name", "error");
      return;
    }

    setUpdatingAlumni(true);
    try {
      const res = await fetch(`${apiUrl}/alumni/${editingAlumniId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAlumniForm),
      });

      const data = await res.json();

      if (res.ok) {
        setAlumni(
          data.alumni ||
            alumni.map((a) =>
              a.id === editingAlumniId ? (data.updatedAlumni || data.alumni) : a
            )
        );
        setIsEditAlumniOpen(false);
        showNotification("Alumni profile updated successfully!");
      } else {
        showNotification(data.error || "Failed to update alumni", "error");
      }
    } catch (err) {
      showNotification("Network error while updating alumni", "error");
    } finally {
      setUpdatingAlumni(false);
    }
  };

  // Handlers for Alumni Companies ("Where Our Alumni Works")
  const handleAddAlumniCompany = async (e) => {
    e.preventDefault();
    if (!alumniCompanyForm.name.trim()) {
      showNotification("Please enter company name", "error");
      return;
    }

    setSubmittingAlumniCompany(true);
    try {
      const res = await fetch(`${apiUrl}/alumni-companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alumniCompanyForm),
      });

      const data = await res.json();

      if (res.ok) {
        setAlumniCompanies(data.companies || [...alumniCompanies, data.company]);
        setIsAddAlumniCompanyOpen(false);
        setAlumniCompanyForm({
          name: "",
          logo: "",
          website: "",
        });
        showNotification("Alumni company added successfully!");
      } else {
        showNotification(data.error || "Failed to add company", "error");
      }
    } catch (err) {
      showNotification("Network error while adding company", "error");
    } finally {
      setSubmittingAlumniCompany(false);
    }
  };

  const openEditAlumniCompany = (company) => {
    setEditingAlumniCompanyId(company.id);
    setEditAlumniCompanyForm({
      name: company.name || "",
      logo: company.logo || "",
      website: company.website || "",
    });
    setIsEditAlumniCompanyOpen(true);
  };

  const handleUpdateAlumniCompany = async (e) => {
    e.preventDefault();
    if (!editAlumniCompanyForm.name.trim()) {
      showNotification("Please enter company name", "error");
      return;
    }

    setUpdatingAlumniCompany(true);
    try {
      const res = await fetch(`${apiUrl}/alumni-companies/${editingAlumniCompanyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAlumniCompanyForm),
      });

      const data = await res.json();

      if (res.ok) {
        setAlumniCompanies(
          data.companies ||
            alumniCompanies.map((c) =>
              c.id === editingAlumniCompanyId ? data.company : c
            )
        );
        setIsEditAlumniCompanyOpen(false);
        showNotification("Company updated successfully!");
      } else {
        showNotification(data.error || "Failed to update company", "error");
      }
    } catch (err) {
      showNotification("Network error while updating company", "error");
    } finally {
      setUpdatingAlumniCompany(false);
    }
  };

  const handleDeleteAlumniCompany = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Alumni Hiring Companies?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/alumni-companies/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setAlumniCompanies(data.companies || alumniCompanies.filter((c) => c.id !== id));
        showNotification(`"${name}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete company", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting company", "error");
    }
  };

  // Handlers for Industry Partners
  const handleAddIndustryPartner = async (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) {
      showNotification("Please enter partner company name", "error");
      return;
    }

    setSubmittingPartner(true);
    try {
      const res = await fetch(`${apiUrl}/industry-partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerForm),
      });

      const data = await res.json();

      if (res.ok) {
        setIndustryPartners(data.partners || [...industryPartners, data.partner]);
        setIsAddPartnerOpen(false);
        setPartnerForm({
          name: "",
          category: "IT & Services",
          logo: "",
          website: "",
        });
        showNotification("Industry Partner added successfully!");
      } else {
        showNotification(data.error || "Failed to add partner", "error");
      }
    } catch (err) {
      showNotification("Network error while adding partner", "error");
    } finally {
      setSubmittingPartner(false);
    }
  };

  const openEditIndustryPartner = (partner) => {
    setEditingPartnerId(partner.id);
    setEditPartnerForm({
      name: partner.name || "",
      category: partner.category || "IT & Services",
      logo: partner.logo || "",
      website: partner.website || "",
    });
    setIsEditPartnerOpen(true);
  };

  const handleUpdateIndustryPartner = async (e) => {
    e.preventDefault();
    if (!editPartnerForm.name.trim()) {
      showNotification("Please enter partner company name", "error");
      return;
    }

    setUpdatingPartner(true);
    try {
      const res = await fetch(`${apiUrl}/industry-partners/${editingPartnerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPartnerForm),
      });

      const data = await res.json();

      if (res.ok) {
        setIndustryPartners(
          data.partners ||
            industryPartners.map((p) =>
              p.id === editingPartnerId ? data.partner : p
            )
        );
        setIsEditPartnerOpen(false);
        showNotification("Industry partner updated successfully!");
      } else {
        showNotification(data.error || "Failed to update partner", "error");
      }
    } catch (err) {
      showNotification("Network error while updating partner", "error");
    } finally {
      setUpdatingPartner(false);
    }
  };

  const handleDeleteIndustryPartner = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Industry Partners?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/industry-partners/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setIndustryPartners(
          data.partners || industryPartners.filter((p) => p.id !== id)
        );
        showNotification(`"${name}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete partner", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting partner", "error");
    }
  };



  return (
    <div className="p-5 md:p-6 max-w-full mx-auto space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl font-medium text-xs flex items-center gap-2 transition-all ${
            notification.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. SUB-TOPIC: MENTORS MANAGEMENT                          */}
      {/* ======================================================== */}
      {activeSubTopic === "mentors" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Industry Mentors & Trainers</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {mentors.length} Active Mentors
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage industry professionals and experts guiding BITC students on the website.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchMentors}
                disabled={mentorsLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${mentorsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsAddMentorOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Mentor
              </button>
            </div>
          </div>

          {/* Mentors Grid */}
          {mentorsLoading ? (
            <div className="py-16 text-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-xs">Loading mentors...</p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No Mentors Found</p>
              <p className="text-xs text-gray-500 mt-0.5">Click "Add New Mentor" above to register your first trainer.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "mentors", setMentors, "mentors")}
            >
              <SortableContext
                items={mentors.map((m) => m.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {mentors.map((mentor) => (
                    <SortableItem
                      key={mentor.id}
                      id={mentor.id}
                      className="group relative bg-slate-50/70 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                  {/* Action Buttons: Edit & Delete */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <button
                      onClick={() => openEditMentor(mentor)}
                      title="Edit Mentor"
                      className="w-7 h-7 rounded-full bg-white/95 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all cursor-pointer shadow-md"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMentor(mentor.id, mentor.name)}
                      title="Remove Mentor"
                      className="w-7 h-7 rounded-full bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    {/* Photo & Company Badge */}
                    <div className="relative h-44 rounded-xl overflow-hidden mb-3.5 bg-slate-100 border border-gray-100">
                      <img
                        src={mentor.img}
                        alt={mentor.name}
                        onError={() => setImgError((prev) => ({ ...prev, [mentor.id]: true }))}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Company Pill */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 shadow-sm uppercase tracking-wider">
                          {mentor.company}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3 className="font-bold text-slate-900 text-sm tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
                          {mentor.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                          <Briefcase className="w-3 h-3" /> {mentor.exp}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold">{mentor.role}</p>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {mentor.skills?.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/80"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Area */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {mentor.area}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Active
                    </span>
                  </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SUB-TOPIC: CAREERS & CURRENT OPENINGS                 */}
      {/* ======================================================== */}
      {activeSubTopic === "careers" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Current Job Openings Management</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      {openings.length} Active Positions
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure faculty, trainer, and administrative vacancies displayed on the Careers page.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchCareers}
                disabled={openingsLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${openingsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsAddJobOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Post New Opening
              </button>
            </div>
          </div>

          {/* Job Openings List */}
          {openingsLoading ? (
            <div className="py-16 text-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-amber-600" />
              <p className="text-xs">Loading job openings...</p>
            </div>
          ) : openings.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No Job Openings</p>
              <p className="text-xs text-gray-500 mt-0.5">Click "Post New Opening" to add career opportunities.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "openings", setOpenings, "careers")}
            >
              <SortableContext
                items={openings.map((j) => j.id)}
                strategy={rectSortingStrategy}
              >
                <div className="space-y-3.5">
                  {openings.map((job) => (
                    <SortableItem
                      key={job.id}
                      id={job.id}
                      className="group relative bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {job.title}
                      </h3>
                      {job.department && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                          {job.department}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {job.status || "Active"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-amber-500" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" /> {job.experience}
                      </span>
                    </div>

                    {job.description && (
                      <p className="text-xs text-gray-500 pt-1 line-clamp-1">
                        {job.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg border border-amber-100">
                      Live on Website
                    </span>

                    <button
                      onClick={() => openEditJob(job)}
                      title="Edit Opening"
                      className="w-8 h-8 rounded-xl bg-white hover:bg-blue-50 text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      title="Remove Opening"
                      className="w-8 h-8 rounded-xl bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* ======================================================== */}
          {/* EMPLOYEE SUCCESS STORIES (TESTIMONIALS)                  */}

        </div>
      )}



      {/* ======================================================== */}
      {/* 3. SUB-TOPIC: OUR ALUMNI PROFILES                        */}
      {/* ======================================================== */}
      {activeSubTopic === "alumni" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Our Alumni Profiles Management</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {alumni.length} Graduates
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showcase BITC graduates placed at leading global companies on the Alumni page.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchAlumni}
                disabled={alumniLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${alumniLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsAddAlumniOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Alumni
              </button>
            </div>
          </div>

          {/* Alumni Grid */}
          {alumniLoading ? (
            <div className="py-16 text-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-xs">Loading alumni profiles...</p>
            </div>
          ) : alumni.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No Alumni Profiles</p>
              <p className="text-xs text-gray-500 mt-0.5">Click "Add New Alumni" to add your successful graduates.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "alumni", setAlumni, "alumni")}
            >
              <SortableContext
                items={alumni.map((a) => a.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {alumni.map((a) => (
                    <SortableItem
                      key={a.id}
                      id={a.id}
                      className="group relative flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-slate-50/70 hover:bg-white p-4 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                    >
                  {/* Action Buttons: Edit & Delete */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <button
                      onClick={() => openEditAlumni(a)}
                      title="Edit Alumni"
                      className="w-6 h-6 rounded-full bg-white/95 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteAlumni(a.id, a.name)}
                      title="Remove Alumni"
                      className="w-6 h-6 rounded-full bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Photo */}
                  <div className="relative h-18 w-18 overflow-hidden rounded-full shadow-md border-2 border-white mb-1">
                    <img
                      src={a.photo}
                      alt={a.name}
                      onError={() => setAlumniImgError((prev) => ({ ...prev, [a.id]: true }))}
                      className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="w-full">
                    <p className="text-xs font-bold leading-snug text-slate-900 line-clamp-1">{a.name}</p>
                    {a.certification && (
                      <p className="text-[10px] text-orange-500 font-semibold line-clamp-1 mt-0.5">{a.certification}</p>
                    )}
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">{a.role}</p>
                    
                    <div className="mt-1.5">
                      <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#2f55d4]">
                        {a.company}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-slate-100 w-full text-[10px]">
                      {a.batch && (
                        <span className="text-slate-500">Batch: {a.batch}</span>
                      )}
                      {a.linkedin && (
                        <a 
                          href={a.linkedin} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-500 hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* ======================================================== */}
          {/* WHERE OUR ALUMNI WORKS (HIRING COMPANIES)                */}
          {/* ======================================================== */}
          <div className="pt-8 border-t border-gray-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Where Our Alumni <span className="text-amber-500">Works</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {alumniCompanies.length} Hiring Companies
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage company logos (Google, Microsoft, Amazon, Apple, Netflix, Meta, etc.) shown on the Alumni page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAlumniCompanies}
                  disabled={alumniCompaniesLoading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${alumniCompaniesLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                <button
                  onClick={() => setIsAddAlumniCompanyOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-sm shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Company Logo
                </button>
              </div>
            </div>

            {/* Companies Grid */}
            {alumniCompaniesLoading ? (
              <div className="py-12 text-center text-gray-400">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-amber-500" />
                <p className="text-xs">Loading hiring companies...</p>
              </div>
            ) : alumniCompanies.length === 0 ? (
              <div className="py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                <p className="text-sm font-semibold text-gray-700">No Alumni Hiring Companies Added</p>
                <p className="text-xs text-gray-500 mt-0.5">Click "Add Company Logo" to showcase where your graduates are placed.</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, "alumniCompanies", setAlumniCompanies, "alumni-companies")}
              >
                <SortableContext
                  items={alumniCompanies.map((c) => c.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    {alumniCompanies.map((comp) => (
                      <SortableItem
                        key={comp.id}
                        id={comp.id}
                        className="group relative flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white hover:border-amber-300 p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md min-h-[90px]"
                      >
                    {/* Action Buttons: Edit & Delete */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                      <button
                        onClick={() => openEditAlumniCompany(comp)}
                        title="Edit Company"
                        className="w-6 h-6 rounded-full bg-white/95 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlumniCompany(comp.id, comp.name)}
                        title="Remove Company"
                        className="w-6 h-6 rounded-full bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="h-8 w-full flex items-center justify-center mb-1.5 px-2">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="max-h-7 max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 tracking-tight">
                      {comp.name}
                    </span>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SUB-TOPIC: INDUSTRY PARTNERS                          */}
      {/* ======================================================== */}
      {activeSubTopic === "industry-partners" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Handshake className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Industry Partners</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {industryPartners.length} Partners
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Manage leading hiring and corporate industry partners featured on the website.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchIndustryPartners}
                disabled={industryPartnersLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${industryPartnersLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsAddPartnerOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Partner
              </button>
            </div>
          </div>

          {/* Industry Partners Grid */}
          {industryPartnersLoading ? (
            <div className="py-16 text-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-xs">Loading industry partners...</p>
            </div>
          ) : industryPartners.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Handshake className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No Industry Partners Added Yet</p>
              <p className="text-xs text-gray-500 mt-0.5">Click "Add New Partner" to register corporate collaborations.</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, "industryPartners", setIndustryPartners, "industry-partners")}
            >
              <SortableContext
                items={industryPartners.map((p) => p.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {industryPartners.map((partner) => (
                    <SortableItem
                      key={partner.id}
                      id={partner.id}
                      className="group relative flex flex-col items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-white p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md min-h-[130px]"
                    >
                  {/* Action Buttons: Edit & Delete */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <button
                      onClick={() => openEditIndustryPartner(partner)}
                      title="Edit Partner"
                      className="w-6 h-6 rounded-full bg-white/95 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteIndustryPartner(partner.id, partner.name)}
                      title="Remove Partner"
                      className="w-6 h-6 rounded-full bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="my-auto w-full">
                    <p className="text-base sm:text-lg font-black text-slate-800 tracking-tight line-clamp-1 mb-1">
                      {partner.name}
                    </p>
                    {partner.category && (
                      <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                        {partner.category}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-2">
                    Verified Partner
                  </span>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Add New Mentor                                    */}
      {/* ======================================================== */}
      {isAddMentorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddMentorOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Mentor</h3>
                <p className="text-xs text-gray-500">Register an industry expert & trainer</p>
              </div>
            </div>

            <form onSubmit={handleAddMentor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mentor Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Role / Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Architect"
                    value={mentorForm.role}
                    onChange={(e) => setMentorForm({ ...mentorForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft, Infosys"
                    value={mentorForm.company}
                    onChange={(e) => setMentorForm({ ...mentorForm, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10+ Years"
                    value={mentorForm.exp}
                    onChange={(e) => setMentorForm({ ...mentorForm, exp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Domain / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Development"
                    value={mentorForm.area}
                    onChange={(e) => setMentorForm({ ...mentorForm, area: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, AWS, Python"
                  value={mentorForm.skills}
                  onChange={(e) => setMentorForm({ ...mentorForm, skills: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Photo URL / Image Path
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or /profile.png"
                  value={mentorForm.img}
                  onChange={(e) => setMentorForm({ ...mentorForm, img: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Thoughts / Quote
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. The best code is the code you don't have to write..."
                  value={mentorForm.thought || ""}
                  onChange={(e) => setMentorForm({ ...mentorForm, thought: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddMentorOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMentor}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  {submittingMentor ? "Saving..." : "Add Mentor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Mentor                                       */}
      {/* ======================================================== */}
      {isEditMentorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditMentorOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Mentor</h3>
                <p className="text-xs text-gray-500">Update mentor information & profile image</p>
              </div>
            </div>

            <form onSubmit={handleUpdateMentor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mentor Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={editMentorForm.name}
                  onChange={(e) => setEditMentorForm({ ...editMentorForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Role / Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={editMentorForm.role}
                    onChange={(e) => setEditMentorForm({ ...editMentorForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft"
                    value={editMentorForm.company}
                    onChange={(e) => setEditMentorForm({ ...editMentorForm, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10+ Years"
                    value={editMentorForm.exp}
                    onChange={(e) => setEditMentorForm({ ...editMentorForm, exp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Domain / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Development"
                    value={editMentorForm.area}
                    onChange={(e) => setEditMentorForm({ ...editMentorForm, area: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, AWS, Python"
                  value={editMentorForm.skills}
                  onChange={(e) => setEditMentorForm({ ...editMentorForm, skills: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Photo URL / Image Path
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or /profile.png"
                  value={editMentorForm.img}
                  onChange={(e) => setEditMentorForm({ ...editMentorForm, img: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Thoughts / Quote
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. The best code is the code you don't have to write..."
                  value={editMentorForm.thought || ""}
                  onChange={(e) => setEditMentorForm({ ...editMentorForm, thought: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditMentorOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingMentor}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingMentor ? "Saving..." : "Update Mentor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Post New Job Opening                              */}
      {/* ======================================================== */}
      {isAddJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddJobOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Post New Job Opening</h3>
                <p className="text-xs text-gray-500">Create a career vacancy for the public portal</p>
              </div>
            </div>

            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Job Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faculty – Full Stack Development"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Work Location
                  </label>
                  <select
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium bg-white"
                  >
                    <option value="On-Site">On-Site (Amravati)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Required Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2+ Years or Freshers"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Academic & Training"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Brief Job Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe key responsibilities or tech stack requirements..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddJobOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {submittingJob ? "Posting..." : "Post Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Job Opening                                  */}
      {/* ======================================================== */}
      {isEditJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditJobOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Job Opening</h3>
                <p className="text-xs text-gray-500">Update position details & requirements</p>
              </div>
            </div>

            <form onSubmit={handleUpdateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Job Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Faculty – Full Stack Development"
                  value={editJobForm.title}
                  onChange={(e) => setEditJobForm({ ...editJobForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={editJobForm.type}
                    onChange={(e) => setEditJobForm({ ...editJobForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract / Visiting">Contract / Visiting</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Workplace Location
                  </label>
                  <select
                    value={editJobForm.location}
                    onChange={(e) => setEditJobForm({ ...editJobForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
                  >
                    <option value="On-Site">On-Site (Amravati)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Required Experience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2+ Years"
                    value={editJobForm.experience}
                    onChange={(e) => setEditJobForm({ ...editJobForm, experience: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Academic & Training"
                    value={editJobForm.department}
                    onChange={(e) => setEditJobForm({ ...editJobForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Brief Job Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe key responsibilities or tech stack requirements..."
                  value={editJobForm.description}
                  onChange={(e) => setEditJobForm({ ...editJobForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditJobOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingJob}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingJob ? "Saving..." : "Update Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Add New Alumni Profile                            */}
      {/* ======================================================== */}
      {isAddAlumniOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddAlumniOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add New Alumni Profile</h3>
                <p className="text-xs text-gray-500">Showcase placed BITC graduates</p>
              </div>
            </div>

            <form onSubmit={handleAddAlumni} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Alumni Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={alumniForm.name}
                  onChange={(e) => setAlumniForm({ ...alumniForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Job Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={alumniForm.role}
                    onChange={(e) => setAlumniForm({ ...alumniForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Placed Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft, Amazon"
                    value={alumniForm.company}
                    onChange={(e) => setAlumniForm({ ...alumniForm, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Batch Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={alumniForm.batch}
                    onChange={(e) => setAlumniForm({ ...alumniForm, batch: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Photo URL / Image Path
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or /profile.png"
                    value={alumniForm.photo}
                    onChange={(e) => setAlumniForm({ ...alumniForm, photo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Course / Certification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Science & AI"
                    value={alumniForm.certification}
                    onChange={(e) => setAlumniForm({ ...alumniForm, certification: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={alumniForm.linkedin}
                    onChange={(e) => setAlumniForm({ ...alumniForm, linkedin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddAlumniOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAlumni}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {submittingAlumni ? "Saving..." : "Add Alumni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Alumni Profile                               */}
      {/* ======================================================== */}
      {isEditAlumniOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditAlumniOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Alumni Profile</h3>
                <p className="text-xs text-gray-500">Update graduate profile details & photo</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAlumni} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Alumni Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={editAlumniForm.name}
                  onChange={(e) => setEditAlumniForm({ ...editAlumniForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Job Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={editAlumniForm.role}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Placed Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Microsoft, Amazon"
                    value={editAlumniForm.company}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Batch Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={editAlumniForm.batch}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, batch: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Photo URL / Image Path
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or /profile.png"
                    value={editAlumniForm.photo}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, photo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Course / Certification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Science & AI"
                    value={editAlumniForm.certification}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, certification: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={editAlumniForm.linkedin}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, linkedin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditAlumniOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAlumni}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingAlumni ? "Saving..." : "Update Alumni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Add Alumni Hiring Company                         */}
      {/* ======================================================== */}
      {isAddAlumniCompanyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddAlumniCompanyOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Alumni Company Logo</h3>
                <p className="text-xs text-gray-500">Showcase top hiring companies</p>
              </div>
            </div>

            <form onSubmit={handleAddAlumniCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Amazon"
                  value={alumniCompanyForm.name}
                  onChange={(e) => setAlumniCompanyForm({ ...alumniCompanyForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Logo URL / SVG Path <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://upload.wikimedia.org/... or /logos/company.svg"
                  value={alumniCompanyForm.logo}
                  onChange={(e) => setAlumniCompanyForm({ ...alumniCompanyForm, logo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://google.com"
                  value={alumniCompanyForm.website}
                  onChange={(e) => setAlumniCompanyForm({ ...alumniCompanyForm, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddAlumniCompanyOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAlumniCompany}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {submittingAlumniCompany ? "Saving..." : "Add Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Alumni Hiring Company                        */}
      {/* ======================================================== */}
      {isEditAlumniCompanyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditAlumniCompanyOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Company Logo</h3>
                <p className="text-xs text-gray-500">Update hiring company details & logo</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAlumniCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, Amazon"
                  value={editAlumniCompanyForm.name}
                  onChange={(e) => setEditAlumniCompanyForm({ ...editAlumniCompanyForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Logo URL / SVG Path <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://upload.wikimedia.org/... or /logos/company.svg"
                  value={editAlumniCompanyForm.logo}
                  onChange={(e) => setEditAlumniCompanyForm({ ...editAlumniCompanyForm, logo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://google.com"
                  value={editAlumniCompanyForm.website}
                  onChange={(e) => setEditAlumniCompanyForm({ ...editAlumniCompanyForm, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditAlumniCompanyOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAlumniCompany}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingAlumniCompany ? "Saving..." : "Update Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Add New Industry Partner                          */}
      {/* ======================================================== */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddPartnerOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Industry Partner</h3>
                <p className="text-xs text-gray-500">Register a company for hiring and collaboration</p>
              </div>
            </div>

            <form onSubmit={handleAddIndustryPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS, Infosys, Microsoft, Google"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Industry / Domain Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. IT & Services, Cloud & AI, Product"
                  value={partnerForm.category}
                  onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.tcs.com"
                  value={partnerForm.website}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPartner}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {submittingPartner ? "Saving..." : "Add Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Industry Partner                             */}
      {/* ======================================================== */}
      {isEditPartnerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditPartnerOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Industry Partner</h3>
                <p className="text-xs text-gray-500">Update company title, category or link</p>
              </div>
            </div>

            <form onSubmit={handleUpdateIndustryPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS, Infosys, Microsoft, Google"
                  value={editPartnerForm.name}
                  onChange={(e) => setEditPartnerForm({ ...editPartnerForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Industry / Domain Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. IT & Services, Cloud & AI, Product"
                  value={editPartnerForm.category}
                  onChange={(e) => setEditPartnerForm({ ...editPartnerForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.tcs.com"
                  value={editPartnerForm.website}
                  onChange={(e) => setEditPartnerForm({ ...editPartnerForm, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditPartnerOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPartner}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingPartner ? "Saving..." : "Update Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 5. SUB-TOPIC: EMPLOYEE TESTIMONIALS                     */}
      {/* ======================================================== */}
      {activeSubTopic === "employee-testimonials" && (
        <EmployeeTestimonials />
      )}

    </div>
  );
};

export default About;

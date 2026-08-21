import React, { useState, useEffect } from "react";
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
import {
  RefreshCw,
  CheckCircle,
  Plus,
  Trash2,
  Pencil,
  GraduationCap,
  Building2,
  Award,
  X,
  Clock,
  IndianRupee,
  Sparkles,
  BookOpen,
  Code,
  Tag,
  Star,
  Quote,
  MessageSquare,
  Layers,
  ListPlus,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Home = ({ activeSubTopic = "academic-partners", setActiveSubTopic }) => {
  // Academic Partners State
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState({
    name: "",
    city: "Amravati",
    logo: "",
  });
  const [submittingPartner, setSubmittingPartner] = useState(false);
  const [imgError, setImgError] = useState({});

  // Edit Academic Partner State
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editPartnerFormData, setEditPartnerFormData] = useState({
    name: "",
    city: "",
    logo: "",
    website: "",
  });
  const [updatingPartner, setUpdatingPartner] = useState(false);

  // Featured Certifications State
  const [certifications, setCertifications] = useState([]);
  const [certsLoading, setCertsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [certFormData, setCertFormData] = useState({
    title: "",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    badge: "Integrated with AI",
    image: "",
  });
  const [submittingCert, setSubmittingCert] = useState(false);

  // Edit Certification State
  const [isEditCertOpen, setIsEditCertOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [editCertData, setEditCertData] = useState({
    title: "",
    category: "Information Technology",
    duration: "6 Months",
    fees: "₹36,000",
    badge: "Integrated with AI",
    image: "",
  });
  const [updatingCert, setUpdatingCert] = useState(false);

  // Course Curriculum Management State
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState(null);
  const [curriculumModules, setCurriculumModules] = useState([]);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [savingCurriculum, setSavingCurriculum] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleTopics, setNewModuleTopics] = useState("");
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");
  const [editModuleTopics, setEditModuleTopics] = useState("");

  // Student Success Stories / Testimonials State
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [isAddTestiOpen, setIsAddTestiOpen] = useState(false);
  const [isEditTestiOpen, setIsEditTestiOpen] = useState(false);
  const [editingTestiId, setEditingTestiId] = useState(null);
  const [testiFormData, setTestiFormData] = useState({
    name: "",
    role: "Software Engineer",
    company: "TCS",
    course: "Full Stack Development",
    packageAmt: "6 LPA",
    quote: "",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  });
  const [editTestiData, setEditTestiData] = useState({
    name: "",
    role: "",
    company: "",
    course: "",
    packageAmt: "",
    quote: "",
    image: "",
    rating: 5,
  });
  const [submittingTesti, setSubmittingTesti] = useState(false);
  const [updatingTesti, setUpdatingTesti] = useState(false);

  const [notification, setNotification] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndPartners = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPartners((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        fetch(`${apiUrl}/partners/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) })
        }).catch(err => console.error("Failed to save reorder", err));
        
        return newItems;
      });
    }
  };

  const handleDragEndCerts = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCertifications((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        fetch(`${apiUrl}/certifications/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) })
        }).catch(err => console.error("Failed to save reorder", err));
        
        return newItems;
      });
    }
  };

  const handleDragEndTestimonials = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTestimonials((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        fetch(`${apiUrl}/testimonials/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) })
        }).catch(err => console.error("Failed to save reorder", err));
        
        return newItems;
      });
    }
  };

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Academic Partners
  const fetchPartners = async () => {
    setPartnersLoading(true);
    try {
      const res = await fetch(`${apiUrl}/partners`);
      if (res.ok) {
        const data = await res.json();
        if (data.partners) setPartners(data.partners);
      }
    } catch (err) {
      console.warn("Error fetching partners:", err);
    } finally {
      setPartnersLoading(false);
    }
  };

  // Fetch Featured Certifications
  const fetchCertifications = async () => {
    setCertsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/certifications`);
      if (res.ok) {
        const data = await res.json();
        if (data.certifications) setCertifications(data.certifications);
      }
    } catch (err) {
      console.warn("Error fetching certifications:", err);
    } finally {
      setCertsLoading(false);
    }
  };

  // Fetch Student Testimonials
  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/testimonials`);
      if (res.ok) {
        const data = await res.json();
        if (data.testimonials) setTestimonials(data.testimonials);
      }
    } catch (err) {
      console.warn("Error fetching testimonials:", err);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchCertifications();
    fetchTestimonials();
  }, []);

  // Handlers for Academic Partners
  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!partnerFormData.name.trim()) {
      showNotification("Please enter partner institution name", "error");
      return;
    }

    setSubmittingPartner(true);
    try {
      const res = await fetch(`${apiUrl}/partners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerFormData),
      });

      const data = await res.json();

      if (res.ok) {
        setPartners(data.partners || [data.partner, ...partners]);
        setIsAddPartnerOpen(false);
        setPartnerFormData({
          name: "",
          logo: "/univercity.png",
          city: "Amravati",
          website: "",
        });
        showNotification("Academic partner added successfully!");
      } else {
        showNotification(data.error || "Failed to add partner", "error");
      }
    } catch (err) {
      showNotification("Network error while adding partner", "error");
    } finally {
      setSubmittingPartner(false);
    }
  };

  const handleDeletePartner = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from Academic Partners?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/partners/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setPartners(data.partners || partners.filter((p) => p.id !== id));
        showNotification(`"${name}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete partner", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting partner", "error");
    }
  };

  const openEditPartner = (partner) => {
    setEditingPartnerId(partner.id);
    setEditPartnerFormData({
      name: partner.name || "",
      city: partner.city || "Amravati",
      logo: partner.logo || "",
      website: partner.website || "",
    });
    setIsEditPartnerOpen(true);
  };

  const handleUpdatePartner = async (e) => {
    e.preventDefault();
    if (!editPartnerFormData.name.trim()) {
      showNotification("Please enter partner name", "error");
      return;
    }

    setUpdatingPartner(true);
    try {
      const res = await fetch(`${apiUrl}/partners/${editingPartnerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPartnerFormData),
      });

      const data = await res.json();

      if (res.ok) {
        setPartners(
          data.partners ||
            partners.map((p) =>
              p.id === editingPartnerId ? data.partner : p
            )
        );
        setIsEditPartnerOpen(false);
        showNotification("Academic partner updated successfully!");
      } else {
        showNotification(data.error || "Failed to update partner", "error");
      }
    } catch (err) {
      showNotification("Network error while updating partner", "error");
    } finally {
      setUpdatingPartner(false);
    }
  };

  // Handlers for Featured Certifications
  const handleAddCertification = async (e) => {
    e.preventDefault();
    if (!certFormData.title.trim()) {
      showNotification("Please enter certification title", "error");
      return;
    }

    setSubmittingCert(true);
    try {
      const res = await fetch(`${apiUrl}/certifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certFormData),
      });

      const data = await res.json();

      if (res.ok) {
        setCertifications(data.certifications || [data.certification, ...certifications]);
        setIsAddCertOpen(false);
        setCertFormData({
          title: "",
          category: "Information Technology",
          duration: "6 Months",
          fees: "₹36,000",
          badge: "Integrated with AI",
          image: "",
        });
        showNotification("Featured certification added successfully!");
      } else {
        showNotification(data.error || "Failed to add certification", "error");
      }
    } catch (err) {
      showNotification("Network error while adding certification", "error");
    } finally {
      setSubmittingCert(false);
    }
  };

  const handleDeleteCertification = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from Featured Certifications?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/certifications/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setCertifications(data.certifications || certifications.filter((c) => c.id !== id));
        showNotification(`"${title}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete certification", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting certification", "error");
    }
  };

  const openEditCert = (cert) => {
    setEditingCertId(cert.id);
    setEditCertData({
      title: cert.title || "",
      category: cert.category || "Information Technology",
      duration: cert.duration || "6 Months",
      fees: cert.fees || "₹36,000",
      badge: cert.badge || "",
      image: cert.image || "",
    });
    setIsEditCertOpen(true);
  };

  const handleUpdateCertification = async (e) => {
    e.preventDefault();
    if (!editCertData.title.trim()) {
      showNotification("Please enter course title", "error");
      return;
    }

    setUpdatingCert(true);
    try {
      const res = await fetch(`${apiUrl}/certifications/${editingCertId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCertData),
      });

      const data = await res.json();

      if (res.ok) {
        setCertifications(
          data.certifications ||
            certifications.map((c) =>
              c.id === editingCertId ? data.certification : c
            )
        );
        setIsEditCertOpen(false);
        showNotification("Course updated successfully!");
      } else {
        showNotification(data.error || "Failed to update course", "error");
      }
    } catch (err) {
      showNotification("Network error while updating course", "error");
    } finally {
      setUpdatingCert(false);
    }
  };

  // Handlers for Course Curriculum Management
  const openCurriculumManager = async (cert) => {
    const slug = cert.slug || cert.title.toLowerCase().replace(/[\s_]+/g, "-");
    setSelectedCourseForCurriculum({ ...cert, slug });
    setIsCurriculumOpen(true);
    setCurriculumLoading(true);
    setEditingModuleIndex(null);
    setNewModuleTitle("");
    setNewModuleTopics("");

    try {
      const res = await fetch(`${apiUrl}/courses/${slug}/curriculum`);
      if (res.ok) {
        const data = await res.json();
        setCurriculumModules(data.curriculum || []);
      } else {
        setCurriculumModules(cert.curriculum || []);
      }
    } catch (err) {
      setCurriculumModules(cert.curriculum || []);
    } finally {
      setCurriculumLoading(false);
    }
  };

  const handleAddNewModule = (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) {
      showNotification("Please enter a module title", "error");
      return;
    }

    const topicsArray = newModuleTopics
      .split(/[\n,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const newMod = {
      title: newModuleTitle.trim(),
      topics: topicsArray,
    };

    setCurriculumModules([...curriculumModules, newMod]);
    setNewModuleTitle("");
    setNewModuleTopics("");
    showNotification("Module added to syllabus! Click 'Save Curriculum' to apply changes.");
  };

  const handleStartEditModule = (index) => {
    const mod = curriculumModules[index];
    setEditingModuleIndex(index);
    setEditModuleTitle(mod.title || "");
    setEditModuleTopics(Array.isArray(mod.topics) ? mod.topics.join("\n") : "");
  };

  const handleSaveEditedModule = () => {
    if (!editModuleTitle.trim()) {
      showNotification("Module title cannot be empty", "error");
      return;
    }

    const updatedTopics = editModuleTopics
      .split(/[\n,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = [...curriculumModules];
    updated[editingModuleIndex] = {
      title: editModuleTitle.trim(),
      topics: updatedTopics,
    };

    setCurriculumModules(updated);
    setEditingModuleIndex(null);
    setEditModuleTitle("");
    setEditModuleTopics("");
    showNotification("Module updated in list! Click 'Save Curriculum' to persist.");
  };

  const handleDeleteModule = (index) => {
    const mod = curriculumModules[index];
    if (window.confirm(`Delete module "${mod.title}" from this course?`)) {
      setCurriculumModules(curriculumModules.filter((_, i) => i !== index));
      if (editingModuleIndex === index) {
        setEditingModuleIndex(null);
      }
      showNotification("Module removed from curriculum list.");
    }
  };

  const handleSaveAllCurriculum = async () => {
    if (!selectedCourseForCurriculum) return;
    setSavingCurriculum(true);
    try {
      const res = await fetch(`${apiUrl}/courses/${selectedCourseForCurriculum.slug}/curriculum`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curriculum: curriculumModules }),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(`Curriculum for "${selectedCourseForCurriculum.title}" saved successfully!`);
        setIsCurriculumOpen(false);
      } else {
        showNotification(data.error || "Failed to save curriculum", "error");
      }
    } catch (err) {
      showNotification("Network error while saving curriculum", "error");
    } finally {
      setSavingCurriculum(false);
    }
  };

  // Handlers for Student Success Stories / Testimonials
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!testiFormData.name.trim()) {
      showNotification("Please enter student name", "error");
      return;
    }
    if (!testiFormData.quote.trim()) {
      showNotification("Please enter review / quote", "error");
      return;
    }

    setSubmittingTesti(true);
    try {
      const res = await fetch(`${apiUrl}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testiFormData),
      });

      const data = await res.json();

      if (res.ok) {
        setTestimonials(data.testimonials || [data.testimonial, ...testimonials]);
        setIsAddTestiOpen(false);
        setTestiFormData({
          name: "",
          role: "Software Engineer at TCS",
          quote: "",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
          rating: 5,
        });
        showNotification("Success story added successfully!");
      } else {
        showNotification(data.error || "Failed to add story", "error");
      }
    } catch (err) {
      showNotification("Network error while adding story", "error");
    } finally {
      setSubmittingTesti(false);
    }
  };

  const openEditTestimonial = (testi) => {
    setEditingTestiId(testi.id);
    setEditTestiData({
      name: testi.name || "",
      role: testi.role || "",
      company: testi.company || "",
      course: testi.course || "",
      packageAmt: testi.packageAmt || "",
      quote: testi.quote || "",
      image: testi.image || "",
      rating: testi.rating || 5,
    });
    setIsEditTestiOpen(true);
  };

  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    if (!editTestiData.name.trim()) {
      showNotification("Please enter student name", "error");
      return;
    }
    if (!editTestiData.quote.trim()) {
      showNotification("Please enter review / quote", "error");
      return;
    }

    setUpdatingTesti(true);
    try {
      const res = await fetch(`${apiUrl}/testimonials/${editingTestiId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTestiData),
      });

      const data = await res.json();

      if (res.ok) {
        setTestimonials(
          data.testimonials ||
            testimonials.map((t) =>
              t.id === editingTestiId ? data.testimonial : t
            )
        );
        setIsEditTestiOpen(false);
        showNotification("Success story updated successfully!");
      } else {
        showNotification(data.error || "Failed to update story", "error");
      }
    } catch (err) {
      showNotification("Network error while updating story", "error");
    } finally {
      setUpdatingTesti(false);
    }
  };

  const handleDeleteTestimonial = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove the success story of "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/testimonials/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setTestimonials(data.testimonials || testimonials.filter((t) => t.id !== id));
        showNotification(`Success story of "${name}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete story", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting story", "error");
    }
  };

  // Filtered Certifications
  const filteredCertifications =
    selectedCategory === "All"
      ? certifications
      : certifications.filter(
          (c) => c.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const categories = ["All", "Information Technology", "Management", "Design"];

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
      {/* 1. SUB-TOPIC: ACADEMIC PARTNERS WINDOW                   */}
      {/* ======================================================== */}
      {activeSubTopic === "academic-partners" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Academic Partners (MoU Collaborations)</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {partners.length} Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage college and university partnerships displayed on the website carousel in real time.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddPartnerOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Partner
            </button>
          </div>

          {/* Partners Grid */}
          {partnersLoading ? (
            <div className="py-14 text-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-xs">Loading academic partners...</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="py-14 text-center text-gray-400">
              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No Academic Partners Configured</p>
              <p className="text-xs text-gray-500 mt-0.5">Click "Add New Partner" above to register your first collaboration.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndPartners}>
              <SortableContext items={partners.map(p => p.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {partners.map((partner) => (
                    <SortableItem key={partner.id} id={partner.id}>
                      <div className="group h-full relative bg-slate-50/80 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                        {/* Action Buttons: Edit & Delete */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-30">
                          <button
                            onClick={() => openEditPartner(partner)}
                            title="Edit Partner"
                            className="w-7 h-7 rounded-full bg-white/95 hover:bg-blue-50 text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-200 flex items-center justify-center transition-all cursor-pointer shadow-sm pointer-events-auto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePartner(partner.id, partner.name)}
                            title="Remove Partner"
                            className="w-7 h-7 rounded-full bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-sm pointer-events-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Logo Preview */}
                        <div className="w-full h-32 flex items-center justify-center mb-3 pointer-events-none">
                          {partner.logo && !imgError[partner.id] ? (
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-200"
                              onError={() => setImgError((prev) => ({ ...prev, [partner.id]: true }))}
                            />
                          ) : (
                            <Building2 className="w-10 h-10 text-blue-600/70" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="pointer-events-none">
                          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-1" title={partner.name}>
                            {partner.name}
                          </h3>
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <span>📍 {partner.city || "Amravati"}</span>
                          </p>
                        </div>
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
      {/* 2. SUB-TOPIC: FEATURED CERTIFICATIONS WINDOW             */}
      {/* ======================================================== */}
      {activeSubTopic === "featured-certifications" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Featured Certifications Management</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                      {certifications.length} Programs
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure high-demand career programs, badges, and fees displayed in the Home page certification grid.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchCertifications}
                disabled={certsLoading}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${certsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsAddCertOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-purple-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Certification
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? certifications.length
                  : certifications.filter(
                      (c) => c.category.toLowerCase() === cat.toLowerCase()
                    ).length;

              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Certifications Grid */}
          {certsLoading ? (
            <div className="py-14 text-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-xs">Loading certifications...</p>
            </div>
          ) : filteredCertifications.length === 0 ? (
            <div className="py-14 text-center text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No Certifications in "{selectedCategory}"</p>
              <p className="text-xs text-gray-500 mt-0.5">Click "Add New Certification" to add your first program in this track.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndCerts}>
              <SortableContext items={filteredCertifications.map(c => c.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCertifications.map((cert) => (
                    <SortableItem key={cert.id} id={cert.id} className="h-full">
                      <div className="group h-full relative bg-slate-50/70 hover:bg-white rounded-2xl p-3.5 border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
                        {/* Action Buttons: Edit, Curriculum & Delete */}
                        <div className="absolute top-5 right-5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-30">
                          <button
                            onClick={() => openCurriculumManager(cert)}
                            title="Manage Course Curriculum & Syllabus"
                            className="w-7 h-7 rounded-full bg-white/95 hover:bg-amber-50 text-gray-500 hover:text-amber-600 border border-gray-200 hover:border-amber-300 flex items-center justify-center transition-all cursor-pointer shadow-md pointer-events-auto"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openEditCert(cert)}
                            title="Edit Course Details"
                            className="w-7 h-7 rounded-full bg-white/95 hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 flex items-center justify-center transition-all cursor-pointer shadow-md pointer-events-auto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteCertification(cert.id, cert.title)}
                            title="Remove Certification"
                            className="w-7 h-7 rounded-full bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-md pointer-events-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="pointer-events-none">
                          {/* Course Thumbnail Image */}
                          <div className="w-full h-36 rounded-xl overflow-hidden mb-3 relative bg-slate-900 flex items-center justify-center border border-gray-100">
                            {cert.image && !imgError[cert.id] ? (
                              <img
                                src={cert.image}
                                alt={cert.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-auto"
                                onError={() => setImgError((prev) => ({ ...prev, [cert.id]: true }))}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center">
                                <Award className="w-12 h-12 text-purple-300/60 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                            )}

                            {/* Badge Over Image */}
                            {cert.badge && (
                              <span className="absolute bottom-2 left-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">
                                {cert.badge}
                              </span>
                            )}
                          </div>

                          {/* Category */}
                          <div className="mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                              {cert.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-1" title={cert.title}>
                            {cert.title}
                          </h3>

                          {/* Meta info */}
                          <div className="space-y-1 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                              <span>Duration: <strong className="text-slate-800">{cert.duration}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>Industry Certification</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
                          <div className="text-xs pointer-events-none">
                            <span className="text-slate-400 block text-[10px]">Certification Fees</span>
                            <strong className="text-slate-900 font-extrabold text-sm">{cert.fees || "₹36,000"}</strong>
                          </div>
                          <button
                            onClick={() => openCurriculumManager(cert)}
                            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 z-20 pointer-events-auto"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                            <span>Curriculum</span>
                          </button>
                        </div>
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
      {/* 3. SUB-TOPIC: STUDENT SUCCESS STORIES / TESTIMONIALS     */}
      {/* ======================================================== */}
      {activeSubTopic === "testimonials" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Quote className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Student Success Stories</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {testimonials.length} Stories
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Manage student testimonials, reviews, ratings, and placements shown on the Home page.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchTestimonials}
                disabled={testimonialsLoading}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200 hover:border-gray-300"
                title="Refresh Stories"
              >
                <RefreshCw className={`w-4 h-4 ${testimonialsLoading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={() => setIsAddTestiOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Success Story</span>
              </button>
            </div>
          </div>

          {/* Stories Grid */}
          {testimonialsLoading ? (
            <div className="py-14 text-center text-gray-400">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-amber-500" />
              <p className="text-xs">Loading success stories...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="py-14 text-center text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-gray-700">No Student Success Stories Added Yet</p>
              <p className="text-xs text-gray-500 mt-0.5">Click "Add Success Story" to feature your first student review.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndTestimonials}>
              <SortableContext items={testimonials.map(t => t.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((story) => (
                    <SortableItem key={story.id} id={story.id} className="h-full">
                      <div className="group h-full relative bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
                        {/* Action Buttons: Edit & Delete */}
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-30">
                          <button
                            onClick={() => openEditTestimonial(story)}
                            title="Edit Story"
                            className="w-7 h-7 rounded-full bg-white/95 hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 flex items-center justify-center transition-all cursor-pointer shadow-md pointer-events-auto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteTestimonial(story.id, story.name)}
                            title="Remove Story"
                            className="w-7 h-7 rounded-full bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 flex items-center justify-center transition-all cursor-pointer shadow-md pointer-events-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="pointer-events-none">
                          {/* Student Info */}
                          <div className="flex items-center gap-3.5 mb-4">
                            <img
                              src={story.image}
                              alt={story.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md bg-slate-200 pointer-events-auto"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80";
                              }}
                            />
                            <div className="pr-12">
                              <h3 className="font-bold text-gray-900 text-sm leading-snug">{story.name}</h3>
                              <p className="text-xs text-gray-500 font-semibold">{story.role}</p>
                            </div>
                          </div>

                          {/* Review Quote */}
                          <p className="text-slate-700 text-xs italic leading-relaxed mb-4 font-medium">
                            "{story.quote}"
                          </p>
                        </div>

                        {/* Rating Stars & Google Brand */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto pointer-events-none">
                          <div className="flex items-center text-amber-400">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            {Array.from({ length: story.rating || 5 }).map((_, s) => (
                              <Star key={s} className="w-3.5 h-3.5 fill-current mr-0.5" />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Verified Alumni
                          </span>
                        </div>
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
      {/* Modal: Add New Academic Partner                          */}
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
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Academic Partner</h3>
                <p className="text-xs text-gray-500">Register an MoU college or university partner</p>
              </div>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Government College of Engineering"
                  value={partnerFormData.name}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Logo URL / Image Path
                </label>
                <input
                  type="text"
                  placeholder="e.g. /univercity.png or https://example.com/logo.png"
                  value={partnerFormData.logo}
                  onChange={(e) => setPartnerFormData({ ...partnerFormData, logo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amravati"
                    value={partnerFormData.city}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Website / Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://college.edu"
                    value={partnerFormData.website}
                    onChange={(e) => setPartnerFormData({ ...partnerFormData, website: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
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
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {submittingPartner ? "Saving..." : "Add Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Academic Partner                             */}
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
                <h3 className="text-lg font-bold text-gray-900">Edit Academic Partner</h3>
                <p className="text-xs text-gray-500">Update institution details, logo or location</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sant Gadge Baba Amravati University"
                  value={editPartnerFormData.name}
                  onChange={(e) => setEditPartnerFormData({ ...editPartnerFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Logo URL / Image Path
                </label>
                <input
                  type="text"
                  placeholder="e.g. /univercity.png or https://example.com/logo.png"
                  value={editPartnerFormData.logo}
                  onChange={(e) => setEditPartnerFormData({ ...editPartnerFormData, logo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amravati"
                    value={editPartnerFormData.city}
                    onChange={(e) => setEditPartnerFormData({ ...editPartnerFormData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Website / Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://college.edu"
                    value={editPartnerFormData.website}
                    onChange={(e) => setEditPartnerFormData({ ...editPartnerFormData, website: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
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
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingPartner ? "Saving..." : "Update Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Add New Featured Certification                    */}
      {/* ======================================================== */}
      {isAddCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddCertOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Featured Certification</h3>
                <p className="text-xs text-gray-500">Create a career program highlight on the Home page</p>
              </div>
            </div>

            <form onSubmit={handleAddCertification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Course / Certification Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MERN Stack, AI & Data Science"
                  value={certFormData.title}
                  onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={certFormData.category}
                    onChange={(e) => setCertFormData({ ...certFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white font-medium cursor-pointer"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Management">Management</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Months"
                    value={certFormData.duration}
                    onChange={(e) => setCertFormData({ ...certFormData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Certification Fees
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹36,000"
                    value={certFormData.fees}
                    onChange={(e) => setCertFormData({ ...certFormData, fees: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Highlight Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Integrated with AI, Top Rated"
                    value={certFormData.badge}
                    onChange={(e) => setCertFormData({ ...certFormData, badge: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Course Image URL / Path (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. /MERN.jpg or https://example.com/course.jpg"
                  value={certFormData.image}
                  onChange={(e) => setCertFormData({ ...certFormData, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddCertOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCert}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                  {submittingCert ? "Saving..." : "Add Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Featured Certification                       */}
      {/* ======================================================== */}
      {isEditCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditCertOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Course Certification</h3>
                <p className="text-xs text-gray-500">Update program title, fees, duration, badge, or image</p>
              </div>
            </div>

            <form onSubmit={handleUpdateCertification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Course / Certification Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MERN Stack, AI & Data Science"
                  value={editCertData.title}
                  onChange={(e) => setEditCertData({ ...editCertData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editCertData.category}
                    onChange={(e) => setEditCertData({ ...editCertData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium cursor-pointer"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Management">Management</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Months"
                    value={editCertData.duration}
                    onChange={(e) => setEditCertData({ ...editCertData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Certification Fees
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹36,000"
                    value={editCertData.fees}
                    onChange={(e) => setEditCertData({ ...editCertData, fees: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Highlight Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Integrated with AI, Top Rated"
                    value={editCertData.badge}
                    onChange={(e) => setEditCertData({ ...editCertData, badge: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Course Image URL / Path
                </label>
                <input
                  type="text"
                  placeholder="e.g. /MERN.jpg or https://example.com/course.jpg"
                  value={editCertData.image}
                  onChange={(e) => setEditCertData({ ...editCertData, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditCertOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingCert}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingCert ? "Saving..." : "Update Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Add New Student Success Story                     */}
      {/* ======================================================== */}
      {isAddTestiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddTestiOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add Student Success Story</h3>
                <p className="text-xs text-gray-500">Feature an alumni placement review and testimonial</p>
              </div>
            </div>

            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={testiFormData.name}
                  onChange={(e) => setTestiFormData({ ...testiFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={testiFormData.role}
                    onChange={(e) => setTestiFormData({ ...testiFormData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCS"
                    value={testiFormData.company}
                    onChange={(e) => setTestiFormData({ ...testiFormData, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Development"
                    value={testiFormData.course}
                    onChange={(e) => setTestiFormData({ ...testiFormData, course: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Package <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 LPA"
                    value={testiFormData.packageAmt}
                    onChange={(e) => setTestiFormData({ ...testiFormData, packageAmt: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Rating (Stars)
                </label>
                <select
                  value={testiFormData.rating}
                  onChange={(e) => setTestiFormData({ ...testiFormData, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white font-medium cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Review / Testimonial Quote <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. The MERN stack certification at BITC gave me the practical skills I needed to clear my interviews with ease."
                  value={testiFormData.quote}
                  onChange={(e) => setTestiFormData({ ...testiFormData, quote: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student Photo URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={testiFormData.image}
                  onChange={(e) => setTestiFormData({ ...testiFormData, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddTestiOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTesti}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {submittingTesti ? "Saving..." : "Add Success Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Student Success Story                        */}
      {/* ======================================================== */}
      {isEditTestiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditTestiOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Student Success Story</h3>
                <p className="text-xs text-gray-500">Update review, name, role or photo</p>
              </div>
            </div>

            <form onSubmit={handleUpdateTestimonial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={editTestiData.name}
                  onChange={(e) => setEditTestiData({ ...editTestiData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={editTestiData.role}
                    onChange={(e) => setEditTestiData({ ...editTestiData, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TCS"
                    value={editTestiData.company}
                    onChange={(e) => setEditTestiData({ ...editTestiData, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Development"
                    value={editTestiData.course}
                    onChange={(e) => setEditTestiData({ ...editTestiData, course: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Package <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 LPA"
                    value={editTestiData.packageAmt}
                    onChange={(e) => setEditTestiData({ ...editTestiData, packageAmt: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Rating (Stars)
                </label>
                <select
                  value={editTestiData.rating}
                  onChange={(e) => setEditTestiData({ ...editTestiData, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Review / Testimonial Quote <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. The MERN stack certification at BITC..."
                  value={editTestiData.quote}
                  onChange={(e) => setEditTestiData({ ...editTestiData, quote: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student Photo URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={editTestiData.image}
                  onChange={(e) => setEditTestiData({ ...editTestiData, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditTestiOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingTesti}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  {updatingTesti ? "Saving..." : "Update Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DYNAMIC COURSE CURRICULUM MANAGEMENT MODAL            */}
      {/* ======================================================== */}
      {isCurriculumOpen && selectedCourseForCurriculum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {selectedCourseForCurriculum.title} — Course Curriculum
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                      {selectedCourseForCurriculum.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add, edit, or reorder curriculum phases, modules, and key learning topics for this course.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-xs">
                  {curriculumModules.length} Modules &bull; {curriculumModules.reduce((acc, m) => acc + (m.topics?.length || 0), 0)} Topics
                </span>
                <button
                  onClick={() => setIsCurriculumOpen(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content - Two Column Layout */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/40">
              {/* Left Column: Existing Modules List (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    Syllabus Modules ({curriculumModules.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Live syncing to Course Detail page
                  </span>
                </div>

                {curriculumLoading ? (
                  <div className="py-20 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
                    <p className="text-xs">Loading course modules...</p>
                  </div>
                ) : curriculumModules.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">No Modules in Curriculum</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Use the form on the right to add your first module and topics for {selectedCourseForCurriculum.title}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {curriculumModules.map((module, idx) => {
                      const isEditing = editingModuleIndex === idx;

                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border transition-all ${
                            isEditing
                              ? "bg-purple-50/50 border-purple-300 ring-2 ring-purple-500/20 p-4"
                              : "bg-white border-slate-200/80 hover:border-purple-200 hover:shadow-sm p-4"
                          }`}
                        >
                          {isEditing ? (
                            /* Inline Edit Mode */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-purple-700">
                                  Editing Module #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEditingModuleIndex(null)}
                                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Module / Phase Title
                                </label>
                                <input
                                  type="text"
                                  value={editModuleTitle}
                                  onChange={(e) => setEditModuleTitle(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                  placeholder="e.g. Phase 1 — Web Fundamentals"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Topics (One per line or comma-separated)
                                </label>
                                <textarea
                                  rows={4}
                                  value={editModuleTopics}
                                  onChange={(e) => setEditModuleTopics(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-y"
                                  placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                                />
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingModuleIndex(null)}
                                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                                >
                                  Discard
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveEditedModule}
                                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-sm"
                                >
                                  Update Module
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Normal View Mode */
                            <div>
                              <div className="flex items-start justify-between gap-3 mb-2.5">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-[11px] font-extrabold flex items-center justify-center shrink-0">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <h5 className="font-bold text-slate-900 text-sm leading-tight">
                                    {module.title}
                                  </h5>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleStartEditModule(idx)}
                                    title="Edit Module"
                                    className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-purple-600 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteModule(idx)}
                                    title="Delete Module"
                                    className="w-7 h-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Topics List / Badges */}
                              {module.topics && module.topics.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-100">
                                  {module.topics.map((topic, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100/90 text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200/60"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic mt-1">
                                  No topics listed under this module.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Add New Module Form (5 cols) */}
              <div className="lg:col-span-5">
                <div className="sticky top-0 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <ListPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        Add New Module / Phase
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Append a learning milestone to syllabus
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddNewModule} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Module Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Phase 14 — AI & Next.js Full Stack"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Key Topics List
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Enter topics separated by new lines or commas:&#10;• Next.js App Router&#10;• Server Actions & API Handlers&#10;• AI Prompt Engine Integration&#10;• Vector DBs & Embeddings"
                        value={newModuleTopics}
                        onChange={(e) => setNewModuleTopics(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-y"
                      />
                      <span className="block text-[10px] text-slate-400 mt-1">
                        💡 Tip: Paste multiple topics directly from syllabus text.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Module to List
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Changes will take effect immediately on <code className="text-purple-600 font-bold">/courses/{selectedCourseForCurriculum.slug}#curriculum</code>
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCurriculumOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={savingCurriculum}
                  onClick={handleSaveAllCurriculum}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  {savingCurriculum ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Save Curriculum
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;


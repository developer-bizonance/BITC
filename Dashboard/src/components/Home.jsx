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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItem } from "./uic/SortableItem";
import ImageUpload from "./ImageUpload.jsx";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";
import { resolveImageUrl, getApiUrl, getSiteUrl } from "../utils.js";
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
  GripVertical,
  Video,
  Play,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";

const SortableCategoryItem = ({ cat, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(cat.name);
  const [saving, setSaving] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = async () => {
    if (!editName.trim() || editName.trim() === cat.name) {
      setIsEditing(false);
      setEditName(cat.name);
      return;
    }
    setSaving(true);
    await onUpdate(cat.id, editName.trim());
    setSaving(false);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all select-none ${isDragging
        ? "bg-amber-50 border-amber-400 shadow-lg ring-2 ring-amber-400/20"
        : isEditing
          ? "bg-white border-amber-400 ring-2 ring-amber-400/20 shadow-sm"
          : "bg-slate-50 border-slate-200/80 hover:border-slate-300 hover:bg-white"
        }`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1 mr-1">
          <input
            type="text"
            value={editName}
            autoFocus
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditName(cat.name);
              }
            }}
            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-normal  focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-gray-500"
          />
          <button
            type="button"
            disabled={saving || !editName.trim()}
            onClick={handleSave}
            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Save changes"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditName(cat.name);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Drag to reorder category"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm text-slate-800 truncate">{cat.name}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditName(cat.name);
                setIsEditing(true);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit Category Name"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(cat.id, cat.name)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Category"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const SortableHighlightItem = ({
  item,
  index,
  onEdit,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2.5 p-2.5 bg-white hover:bg-slate-50/80 rounded-xl border transition-all shadow-xs ${isDragging
        ? "border-purple-400 shadow-lg ring-2 ring-purple-400/20 bg-purple-50/50 relative"
        : "border-slate-200/80 hover:border-purple-200"
        }`}
    >
      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
        <Check className="w-3.5 h-3.5" />
      </div>

      <span className="text-[11px] font-bold text-slate-400 w-4 text-center shrink-0">
        {index + 1}
      </span>

      <input
        type="text"
        value={item.text}
        onChange={(e) => onEdit(item.id, e.target.value)}
        className="flex-1 bg-transparent border-0 px-1 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-md"
      />

      <div className="flex items-center gap-1 shrink-0">
        <div
          {...attributes}
          {...listeners}
          className="w-7 h-7 rounded-lg hover:bg-purple-100/70 text-slate-400 hover:text-purple-700 flex items-center justify-center transition-colors cursor-grab active:cursor-grabbing touch-none"
          title="Drag to reorder highlight"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          title="Remove Point"
          className="w-7 h-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const Home = ({ activeSubTopic = "academic-partners", setActiveSubTopic }) => {
  // Academic Partners State
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [partnerFormData, setPartnerFormData] = useState({
    name: "",
    city: "",
    logo: "",
    website: "",
    isActive: true,
  });
  const [submittingPartner, setSubmittingPartner] = useState(false);
  const [imgError, setImgError] = useState({});
  const [confirmPartnerDelete, setConfirmPartnerDelete] = useState(null); // { id, name }
  const [deletingPartner, setDeletingPartner] = useState(false);
  const [confirmCategoryDelete, setConfirmCategoryDelete] = useState(null); // { id, name }
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [confirmCertDelete, setConfirmCertDelete] = useState(null); // { id, title }
  const [deletingCert, setDeletingCert] = useState(false);
  const [confirmModuleDelete, setConfirmModuleDelete] = useState(null); // { index, title }
  const [confirmTestiDelete, setConfirmTestiDelete] = useState(null); // { id, name }
  const [deletingTesti, setDeletingTesti] = useState(false);

  // Edit Academic Partner State
  const [isEditPartnerOpen, setIsEditPartnerOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editPartnerFormData, setEditPartnerFormData] = useState({
    name: "",
    city: "",
    logo: "",
    website: "",
    isActive: true,
  });
  const [updatingPartner, setUpdatingPartner] = useState(false);

  // Featured Certifications State
  const [certifications, setCertifications] = useState([]);
  const [certsLoading, setCertsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Category Management State
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [certFormData, setCertFormData] = useState({
    title: "",
    category: "",
    duration: "",
    fees: "",
    badge: "",
    image: "",
    description: "",
    featuresText: "",
  });
  const [submittingCert, setSubmittingCert] = useState(false);

  // Edit Certification State
  const [isEditCertOpen, setIsEditCertOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [editCertData, setEditCertData] = useState({
    title: "",
    category: "Information Technology",
    duration: "",
    fees: "",
    badge: "",
    image: "",
    description: "",
    featuresText: "",
  });
  const [updatingCert, setUpdatingCert] = useState(false);

  // Certification Highlights Management State
  const [isHighlightsModalOpen, setIsHighlightsModalOpen] = useState(false);
  const [selectedCertForHighlights, setSelectedCertForHighlights] = useState(null);
  const [highlightsList, setHighlightsList] = useState([]);
  const [newHighlightInput, setNewHighlightInput] = useState("");
  const [savingHighlights, setSavingHighlights] = useState(false);

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
    role: "",
    company: "",
    course: "",
    packageAmt: "",
    quote: "",
    image: "",
    rating: 5,
    youtubeUrl: "",
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
    youtubeUrl: "",
  });
  const [submittingTesti, setSubmittingTesti] = useState(false);
  const [updatingTesti, setUpdatingTesti] = useState(false);

  const [notification, setNotification] = useState(null);

  const apiUrl = getApiUrl();

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

        fetch(`${getSiteUrl()}/api/partners`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) })
        }).catch(() => null);

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

  const handleDragEndCategories = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        fetch(`${apiUrl}/categories/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) })
        }).catch(err => console.error("Failed to save categories reorder", err));

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
      let loaded = null;
      // 1. Primary: fetch from central backend API
      try {
        const res = await fetch(`${apiUrl}/partners?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.partners) && data.partners.length > 0) {
            loaded = data.partners;
          }
        }
      } catch (err) {
        console.warn("Error fetching partners from apiUrl:", err);
      }

      // 2. Fallback: local Next.js API
      if (!loaded || loaded.length === 0) {
        try {
          const siteRes = await fetch(`${getSiteUrl()}/api/partners?t=${Date.now()}`);
          if (siteRes.ok) {
            const siteData = await siteRes.json();
            if (Array.isArray(siteData.partners) && siteData.partners.length > 0) {
              loaded = siteData.partners;
            }
          }
        } catch (siteErr) {
          console.warn("Error fetching partners from siteUrl:", siteErr);
        }
      }

      if (loaded) {
        // Clear legacy local storage overrides that caused colleges to be automatically hidden
        try {
          if (typeof window !== "undefined") {
            localStorage.removeItem("bitc_academic_partners_visibility_map");
          }
        } catch {}

        const normalized = loaded.map((p) => ({
          ...p,
          isActive: p.isActive !== false && p.isActive !== "false",
        }));
        setPartners(normalized);
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
        if (data.certifications) {
          const seen = new Set();
          const unique = (data.certifications || []).filter((c) => {
            const key = (c.title || c.slug || c.id || "").trim().toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          });

          // Fetch all courses to enrich certifications with dynamic highlights/features if missing
          let coursesList = [];
          try {
            const coursesRes = await fetch(`${apiUrl}/courses`);
            if (coursesRes.ok) {
              const cData = await coursesRes.json();
              coursesList = cData.courses || [];
            }
          } catch (cErr) {
            // Ignore courses fetch error
          }

          const enriched = unique.map((cert) => {
            const certTitle = (cert.title || "").trim().toLowerCase();
            const certSlug = cert.slug || certTitle.replace(/ & /g, "-").replace(/[/\\s_]+/g, "-");
            const cleanSlug = certSlug.replace(/[^a-z0-9]/g, "");

            const match = coursesList.find((c) => {
              const cSlug = (c.slug || "").toLowerCase();
              const cTitle = (c.title || "").trim().toLowerCase();
              const cClean = cSlug.replace(/[^a-z0-9]/g, "");
              return (
                cSlug === certSlug ||
                cTitle === certTitle ||
                (cleanSlug && cClean === cleanSlug) ||
                (c.title && cert.title && c.title.toLowerCase() === cert.title.toLowerCase())
              );
            });

            const mergedFeatures = (Array.isArray(cert.features) && cert.features.length > 0)
              ? cert.features
              : (match && Array.isArray(match.features) && match.features.length > 0 ? match.features : (cert.features || []));

            return {
              ...cert,
              slug: cert.slug || (match && match.slug ? match.slug : certSlug),
              features: mergedFeatures,
              description: cert.description || (match && match.description ? match.description : ""),
            };
          });

          setCertifications(enriched);
        }
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

  // Fetch Categories
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${apiUrl}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.categories) setCategories(data.categories);
      }
    } catch (err) {
      console.warn("Error fetching categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchCertifications();
    fetchTestimonials();
    fetchCategories();
  }, []);

  // Handlers for Academic Partners
  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!partnerFormData.name.trim() || !partnerFormData.city.trim()) {
      showNotification("Please enter partner institution name and city", "error");
      return;
    }
    if (!partnerFormData.logo?.trim()) {
      showNotification("Please upload the partner logo", "error");
      return;
    }

    setSubmittingPartner(true);
    try {
      // Dual sync
      try {
        fetch(`${getSiteUrl()}/api/partners`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(partnerFormData),
        }).catch(() => null);
      } catch { }

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
          logo: "",
          city: "",
          website: "",
          isActive: true,
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

  const handleDeletePartner = (id, name) => {
    setConfirmPartnerDelete({ id, name });
  };

  const confirmAndDeletePartner = async () => {
    if (!confirmPartnerDelete) return;
    const { id, name } = confirmPartnerDelete;
    setDeletingPartner(true);
    try {
      // Dual sync
      try {
        fetch(`${getSiteUrl()}/api/partners?id=${id}`, {
          method: "DELETE",
        }).catch(() => null);
      } catch { }

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
    } finally {
      setDeletingPartner(false);
      setConfirmPartnerDelete(null);
    }
  };

  const openEditPartner = (partner) => {
    setEditingPartnerId(partner.id);
    setEditPartnerFormData({
      name: partner.name || "",
      city: partner.city || "Amravati",
      logo: partner.logo || "",
      website: partner.website || "",
      isActive: partner.isActive !== false,
    });
    setIsEditPartnerOpen(true);
  };


  const handleTogglePartnerVisibility = async (partner) => {
    const newIsActive = partner.isActive === false ? true : false;

    // 1. Optimistic UI update in state
    setPartners((prev) =>
      prev.map((p) => (p.id === partner.id ? { ...p, isActive: newIsActive } : p))
    );

    try {
      // 2. Central Backend API (single PATCH toggle with explicit desired state)
      const res = await fetch(`${apiUrl}/partners/${partner.id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newIsActive }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.partners) && data.partners.length > 0) {
          const normalized = data.partners.map((p) => ({
            ...p,
            isActive: p.isActive !== false && p.isActive !== "false",
          }));
          setPartners(normalized);
        }
      }

      // 3. Dual-sync to Next.js API for guaranteed instant site reflection
      try {
        await fetch(`${getSiteUrl()}/api/partners`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: partner.id,
            isActive: newIsActive,
          }),
        });
      } catch (syncErr) {
        console.warn("Dual site sync notice:", syncErr);
      }

      showNotification(
        `"${partner.name}" is now ${newIsActive ? "visible on" : "hidden from"} website.`
      );
    } catch (err) {
      console.warn("Network notice while updating visibility:", err);
      // Revert on error
      fetchPartners();
    }
  };

  const handleUpdatePartner = async (e) => {
    e.preventDefault();
    if (!editPartnerFormData.name.trim() || !editPartnerFormData.city.trim()) {
      showNotification("Please enter partner name and city", "error");
      return;
    }
    if (!editPartnerFormData.logo?.trim()) {
      showNotification("Please upload the partner logo", "error");
      return;
    }

    setUpdatingPartner(true);

    try {
      // Dual sync
      try {
        fetch(`${getSiteUrl()}/api/partners`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPartnerId, ...editPartnerFormData }),
        }).catch(() => null);
      } catch { }

      const res = await fetch(`${apiUrl}/partners/${editingPartnerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editPartnerFormData),
      });

      const data = await res.json();

      if (res.ok) {
        setPartners(
          (data.partners ||
          partners.map((p) =>
            p.id === editingPartnerId ? data.partner : p
          )).map((p) => ({
            ...p,
            isActive: p.isActive !== false && p.isActive !== "false",
          }))
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

  // Handlers for Category Management
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showNotification("Please enter a category name", "error");
      return;
    }

    setAddingCategory(true);
    try {
      const res = await fetch(`${apiUrl}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || [...categories, data.category]);
        setNewCategoryName("");
        showNotification("Category added successfully!");
      } else {
        showNotification(data.error || "Failed to add category", "error");
      }
    } catch (err) {
      showNotification("Network error while adding category", "error");
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = (id, name) => {
    setConfirmCategoryDelete({ id, name });
  };

  const confirmAndDeleteCategory = async () => {
    if (!confirmCategoryDelete) return;
    const { id, name } = confirmCategoryDelete;
    setDeletingCategory(true);
    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || categories.filter((c) => c.id !== id));
        showNotification(`"${name}" removed successfully.`);
      } else {
        showNotification(data.error || "Failed to delete category", "error");
      }
    } catch (err) {
      showNotification("Network error while deleting category", "error");
    } finally {
      setDeletingCategory(false);
      setConfirmCategoryDelete(null);
    }
  };

  const handleUpdateCategory = async (id, updatedName) => {
    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName }),
      });

      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories || categories.map((c) => (c.id === id ? { ...c, name: updatedName } : c)));
        // Refresh certifications to show updated category labels
        fetchCertifications();
        showNotification("Category name updated successfully!");
      } else {
        showNotification(data.error || "Failed to update category name", "error");
      }
    } catch (err) {
      showNotification("Network error while updating category", "error");
    }
  };

  const [uploadingCertImage, setUploadingCertImage] = useState(false);

  const handleCertImageFile = async (file, isEdit = false) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size must be less than 5MB", "error");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    setUploadingCertImage(true);
    try {
      const res = await fetch(`${apiUrl}/upload?category=certifications`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isEdit) {
          setEditCertData((prev) => ({ ...prev, image: data.url }));
        } else {
          setCertFormData((prev) => ({ ...prev, image: data.url }));
        }
      } else {
        showNotification(data.error || "Failed to upload image", "error");
      }
    } catch (err) {
      showNotification("Upload failed", "error");
    } finally {
      setUploadingCertImage(false);
    }
  };

  // Handlers for Featured Certifications
  const handleAddCertification = async (e) => {
    e.preventDefault();
    if (!certFormData.title.trim()) {
      showNotification("Please enter certification title", "error");
      return;
    }
    if (!certFormData.category) {
      showNotification("Please select a category / domain", "error");
      return;
    }
    if (!certFormData.duration?.trim()) {
      showNotification("Please enter course duration", "error");
      return;
    }
    if (!certFormData.image?.trim()) {
      showNotification("Please upload a course image", "error");
      return;
    }
    if (!certFormData.description?.trim()) {
      showNotification("Please enter about certification description", "error");
      return;
    }

    setSubmittingCert(true);
    try {
      const featuresArray = certFormData.featuresText
        ? certFormData.featuresText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
        : [];
      const payload = {
        title: certFormData.title,
        category: certFormData.category,
        duration: certFormData.duration,
        fees: certFormData.fees,
        badge: certFormData.badge,
        image: certFormData.image,
        description: certFormData.description,
        features: featuresArray,
      };

      const res = await fetch(`${apiUrl}/certifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Also sync highlights/features directly to Course endpoint
        const courseSlug = (certFormData.title || "").toLowerCase().replace(/ & /g, '-').replace(/[/\\s_]+/g, "-");
        try {
          await fetch(`${apiUrl}/courses/${courseSlug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: certFormData.title,
              category: certFormData.category,
              duration: certFormData.duration,
              fees: certFormData.fees,
              image: certFormData.image,
              description: certFormData.description,
              features: featuresArray,
            }),
          });
        } catch (cSyncErr) {
          // Ignore fallback error
        }

        setCertifications(data.certifications || [data.certification, ...certifications]);
        setIsAddCertOpen(false);
        setCertFormData({
          title: "",
          category: "",
          duration: "",
          fees: "",
          badge: "",
          image: "",
          description: "",
          featuresText: "",
        });
        showNotification("Certification added successfully!");
      } else {
        showNotification(data.error || "Failed to add certification", "error");
      }
    } catch (err) {
      showNotification("Network error while adding certification", "error");
    } finally {
      setSubmittingCert(false);
    }
  };

  const handleDeleteCertification = (id, title) => {
    setConfirmCertDelete({ id, title });
  };

  const confirmAndDeleteCertification = async () => {
    if (!confirmCertDelete) return;
    const { id, title } = confirmCertDelete;
    setDeletingCert(true);
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
    } finally {
      setDeletingCert(false);
      setConfirmCertDelete(null);
    }
  };

  const openEditCert = (cert) => {
    setEditingCertId(cert.id);
    setEditCertData({
      title: cert.title || "",
      category: cert.category || "Information Technology",
      duration: cert.duration || "6 Months",
      fees: cert.fees || "",
      badge: cert.badge || "",
      image: cert.image || "",
      description: cert.description || "",
      featuresText: Array.isArray(cert.features) ? cert.features.join("\n") : "",
    });
    setIsEditCertOpen(true);
  };

  const handleUpdateCertification = async (e) => {
    e.preventDefault();
    if (!editCertData.title.trim()) {
      showNotification("Please enter course title", "error");
      return;
    }
    if (!editCertData.category) {
      showNotification("Please select a category / domain", "error");
      return;
    }
    if (!editCertData.duration?.trim()) {
      showNotification("Please enter course duration", "error");
      return;
    }
    if (!editCertData.image?.trim()) {
      showNotification("Please upload a course image", "error");
      return;
    }
    if (!editCertData.description?.trim()) {
      showNotification("Please enter about certification description", "error");
      return;
    }

    setUpdatingCert(true);
    try {
      const featuresArray = editCertData.featuresText
        ? editCertData.featuresText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
        : [];
      const payload = {
        title: editCertData.title,
        category: editCertData.category,
        duration: editCertData.duration,
        fees: editCertData.fees,
        badge: editCertData.badge,
        image: editCertData.image,
        description: editCertData.description,
        features: featuresArray,
      };

      const res = await fetch(`${apiUrl}/certifications/${editingCertId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Also sync highlights/features directly to Course endpoint
        const courseSlug = (editCertData.title || "").toLowerCase().replace(/ & /g, '-').replace(/[/\\s_]+/g, "-");
        try {
          await fetch(`${apiUrl}/courses/${courseSlug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: editCertData.title,
              category: editCertData.category,
              duration: editCertData.duration,
              fees: editCertData.fees,
              image: editCertData.image,
              description: editCertData.description,
              features: featuresArray,
            }),
          });
        } catch (cSyncErr) {
          // Ignore fallback error
        }

        setCertifications(
          data.certifications ||
          certifications.map((c) =>
            c.id === editingCertId ? { ...c, ...payload, features: featuresArray } : c
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

  // Handlers for Certification Highlights Management
  const openHighlightsManager = async (cert) => {
    setSelectedCertForHighlights(cert);
    let existing = Array.isArray(cert.features)
      ? [...cert.features]
      : (typeof cert.features === "string" ? cert.features.split(/\r?\n/).filter(Boolean) : []);

    if (existing.length === 0) {
      try {
        const slug = cert.slug || (cert.title || "").toLowerCase().replace(/ & /g, '-').replace(/[/\\s_]+/g, "-");
        // Try /courses/:slug first
        const courseRes = await fetch(`${apiUrl}/courses/${slug}`);
        if (courseRes.ok) {
          const cData = await courseRes.json();
          const f = Array.isArray(cData.course?.features) ? cData.course.features : [];
          if (f.length > 0) existing = f;
        }
        if (existing.length === 0) {
          const res = await fetch(`${apiUrl}/courses/${slug}/highlights`);
          if (res.ok) {
            const data = await res.json();
            const fetchedPoints = Array.isArray(data.features) ? data.features : (Array.isArray(data.highlights) ? data.highlights : []);
            if (fetchedPoints.length > 0) existing = fetchedPoints;
          }
        }
        if (existing.length > 0) {
          setCertifications((prev) =>
            prev.map((c) => (c.id === cert.id ? { ...c, features: existing } : c))
          );
        }
      } catch (err) {
        console.warn("Could not fetch latest highlights for modal:", err);
      }
    }

    setHighlightsList(
      existing.map((text, idx) => ({
        id: `hl-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        text: String(text).trim(),
      }))
    );
    setNewHighlightInput("");
    setIsHighlightsModalOpen(true);
  };

  const handleAddHighlightPoint = () => {
    const trimmed = newHighlightInput.trim();
    if (!trimmed) return;
    if (highlightsList.some((item) => (item.text || item).toLowerCase() === trimmed.toLowerCase())) {
      showNotification("This highlight point is already in the list", "error");
      return;
    }
    setHighlightsList([
      ...highlightsList,
      {
        id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: trimmed,
      },
    ]);
    setNewHighlightInput("");
  };

  const handleRemoveHighlightPoint = (id) => {
    setHighlightsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDragEndHighlights = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setHighlightsList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const handleEditHighlightPoint = (id, val) => {
    setHighlightsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: val } : item))
    );
  };

  const handleInsertStandardHighlights = () => {
    const standardPoints = [
      "Resume Building & Portfolio Review",
      "Interview Preparation & Soft Skills",
      "1-on-1 Mentorship & Doubt Clearing",
      "Group Discussion & Communication Sessions",
      "Mock Interviews with Industry Experts",
      "Access to Exclusive BITC Placement Drive",
    ];
    setHighlightsList((prev) => {
      const existingTexts = new Set(
        prev.map((item) => (item.text || item).trim().toLowerCase())
      );
      const newItems = [...prev];
      for (const point of standardPoints) {
        if (!existingTexts.has(point.toLowerCase())) {
          newItems.push({
            id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            text: point,
          });
          existingTexts.add(point.toLowerCase());
        }
      }
      return newItems;
    });
    showNotification("Added BITC standard career highlights!", "success");
  };

  const handleSaveHighlights = async () => {
    if (!selectedCertForHighlights) return;
    setSavingHighlights(true);
    try {
      const cleanHighlights = highlightsList
        .map((h) => (typeof h === "string" ? h.trim() : (h.text || "").trim()))
        .filter(Boolean);

      const slug = selectedCertForHighlights.slug || (selectedCertForHighlights.title || "").toLowerCase().replace(/ & /g, '-').replace(/[/\\s_]+/g, "-");

      // 1. Direct Course PUT - updates Neon DB Course table instantly
      try {
        await fetch(`${apiUrl}/courses/${slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ features: cleanHighlights }),
        });
      } catch (cErr) {
        console.warn("Could not save to /courses/:slug:", cErr);
      }

      // 2. PUT /certifications/:id/highlights
      try {
        await fetch(`${apiUrl}/certifications/${selectedCertForHighlights.id}/highlights`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ highlights: cleanHighlights, features: cleanHighlights }),
        });
      } catch (hErr) { }

      // 3. PUT /certifications/:id
      try {
        await fetch(`${apiUrl}/certifications/${selectedCertForHighlights.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...selectedCertForHighlights,
            features: cleanHighlights,
          }),
        });
      } catch (certErr) { }

      // 4. PUT /courses/:slug/highlights
      try {
        await fetch(`${apiUrl}/courses/${slug}/highlights`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ highlights: cleanHighlights, features: cleanHighlights }),
        });
      } catch (chErr) { }

      // Update dashboard state
      setCertifications((prev) =>
        prev.map((c) =>
          c.id === selectedCertForHighlights.id || (c.title || "").toLowerCase() === (selectedCertForHighlights.title || "").toLowerCase()
            ? { ...c, features: cleanHighlights, slug }
            : c
        )
      );
      showNotification("Certification highlights saved successfully!");
      setIsHighlightsModalOpen(false);
    } catch (err) {
      showNotification("Network error while saving highlights", "error");
    } finally {
      setSavingHighlights(false);
    }
  };

  // Handlers for Course Curriculum Management
  const sanitizeCourseSlug = (val) => {
    if (!val) return "";
    return String(val)
      .trim()
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/[\/\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const openCurriculumManager = async (cert) => {
    const rawSlug = cert.slug ? sanitizeCourseSlug(cert.slug) : sanitizeCourseSlug(cert.title);
    const strippedSlug = rawSlug.replace(/-(certificate|certification|programs?|courses?|masterclass)$/, "");
    setSelectedCourseForCurriculum({ ...cert, slug: rawSlug, strippedSlug });
    setIsCurriculumOpen(true);
    setCurriculumLoading(true);
    setEditingModuleIndex(null);
    setNewModuleTitle("");
    setNewModuleTopics("");

    const normalizeModules = (rawList) => {
      if (!Array.isArray(rawList)) return [];
      return rawList.map((m) => ({
        title: m.title || m.module || m.name || "Module",
        topics: Array.isArray(m.topics) ? m.topics : [],
      }));
    };

    try {
      let list = [];
      // 1. Try fetching by strippedSlug (e.g. full-stack-java)
      const res = await fetch(`${apiUrl}/courses/${strippedSlug}/curriculum`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.curriculum) && data.curriculum.length > 0) {
          list = data.curriculum;
        }
      }
      // 2. If empty and rawSlug is different, try rawSlug
      if (list.length === 0 && rawSlug !== strippedSlug) {
        const res2 = await fetch(`${apiUrl}/courses/${rawSlug}/curriculum`);
        if (res2.ok) {
          const data2 = await res2.json();
          if (Array.isArray(data2.curriculum) && data2.curriculum.length > 0) {
            list = data2.curriculum;
          }
        }
      }
      // 3. Fallback to cert.curriculum
      if (list.length === 0 && Array.isArray(cert.curriculum) && cert.curriculum.length > 0) {
        list = cert.curriculum;
      }
      setCurriculumModules(normalizeModules(list));
    } catch (err) {
      setCurriculumModules(normalizeModules(cert.curriculum || []));
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
    setEditModuleTitle(mod.title || mod.module || mod.name || "");
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
    setConfirmModuleDelete({ index, title: mod ? mod.title : "this module" });
  };

  const confirmAndDeleteModule = () => {
    if (!confirmModuleDelete) return;
    const { index } = confirmModuleDelete;
    setCurriculumModules(curriculumModules.filter((_, i) => i !== index));
    if (editingModuleIndex === index) {
      setEditingModuleIndex(null);
    }
    showNotification("Module removed from curriculum list.");
    setConfirmModuleDelete(null);
  };

  const handleSaveAllCurriculum = async () => {
    if (!selectedCourseForCurriculum) return;
    setSavingCurriculum(true);
    try {
      const rawSlug = selectedCourseForCurriculum.slug || sanitizeCourseSlug(selectedCourseForCurriculum.title);
      const strippedSlug = rawSlug.replace(/-(certificate|certification|programs?|courses?|masterclass)$/, "");
      const payload = {
        curriculum: curriculumModules,
        id: selectedCourseForCurriculum.id,
        title: selectedCourseForCurriculum.title,
        slug: rawSlug,
        strippedSlug,
      };

      // Save to strippedSlug route (e.g. full-stack-java)
      let res = await fetch(`${apiUrl}/courses/${strippedSlug}/curriculum`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Also save to rawSlug route if different
      if (rawSlug !== strippedSlug) {
        fetch(`${apiUrl}/courses/${rawSlug}/curriculum`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((e) => console.warn("Raw slug curriculum save notice:", e));
      }

      // Also sync directly to certification if id exists
      if (selectedCourseForCurriculum.id) {
        fetch(`${apiUrl}/certifications/${selectedCourseForCurriculum.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ curriculum: curriculumModules, strippedSlug }),
        }).catch((e) => console.warn("Direct cert curriculum sync notice:", e));
      }

      const data = await res.json();
      if (res.ok) {
        // Update local certifications state so UI reflects it immediately
        setCertifications((prev) =>
          prev.map((c) =>
            c.id === selectedCourseForCurriculum.id ||
            sanitizeCourseSlug(c.title) === rawSlug ||
            sanitizeCourseSlug(c.title).replace(/-(certificate|certification|programs?|courses?|masterclass)$/, "") === strippedSlug
              ? { ...c, curriculum: curriculumModules }
              : c
          )
        );
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
          role: "",
          company: "",
          course: "",
          packageAmt: "",
          quote: "",
          image: "",
          rating: 5,
          youtubeUrl: "",
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
      youtubeUrl: testi.youtubeUrl || "",
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

  const handleDeleteTestimonial = (id, name) => {
    setConfirmTestiDelete({ id, name });
  };

  const confirmAndDeleteTestimonial = async () => {
    if (!confirmTestiDelete) return;
    const { id, name } = confirmTestiDelete;
    setDeletingTesti(true);
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
    } finally {
      setDeletingTesti(false);
      setConfirmTestiDelete(null);
    }
  };

  // Category match helper
  const isCategoryMatch = (certCat, selCat) => {
    if (!certCat || !selCat) return false;
    const c = certCat.trim().toLowerCase().replace(/ programs?$/, "");
    const s = selCat.trim().toLowerCase().replace(/ programs?$/, "");
    return c === s || certCat.trim().toLowerCase() === selCat.trim().toLowerCase();
  };

  // Filtered Certifications
  const filteredCertifications =
    selectedCategory === "All"
      ? certifications
      : certifications.filter((c) => isCategoryMatch(c.category, selectedCategory));


  return (
    <div className="p-5 md:p-6 max-w-full mx-auto space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl font-medium text-xs flex items-center gap-2 transition-all ${notification.type === "error"
            ? "bg-red-600 text-white"
            : "bg-emerald-600 text-white"
            }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Delete Confirmation Modals */}
      <DeleteConfirmModal
        isOpen={!!confirmPartnerDelete}
        title="Remove Academic Partner"
        itemName={confirmPartnerDelete?.name}
        from="Academic Partners"
        loading={deletingPartner}
        onConfirm={confirmAndDeletePartner}
        onCancel={() => setConfirmPartnerDelete(null)}
      />
      <DeleteConfirmModal
        isOpen={!!confirmCategoryDelete}
        title="Remove Category"
        itemName={confirmCategoryDelete?.name}
        from="Categories"
        loading={deletingCategory}
        onConfirm={confirmAndDeleteCategory}
        onCancel={() => setConfirmCategoryDelete(null)}
      />
      <DeleteConfirmModal
        isOpen={!!confirmCertDelete}
        title="Remove Certification"
        itemName={confirmCertDelete?.title}
        from="Certifications"
        loading={deletingCert}
        onConfirm={confirmAndDeleteCertification}
        onCancel={() => setConfirmCertDelete(null)}
      />
      <DeleteConfirmModal
        isOpen={!!confirmModuleDelete}
        title="Remove Curriculum Module"
        message={`Are you sure you want to delete module "${confirmModuleDelete?.title}" from this course?`}
        onConfirm={confirmAndDeleteModule}
        onCancel={() => setConfirmModuleDelete(null)}
      />
      <DeleteConfirmModal
        isOpen={!!confirmTestiDelete}
        title="Remove Success Story"
        message={`Are you sure you want to remove the success story of "${confirmTestiDelete?.name}"?`}
        loading={deletingTesti}
        onConfirm={confirmAndDeleteTestimonial}
        onCancel={() => setConfirmTestiDelete(null)}
      />

      {/* ======================================================== */}
      {/* 1. SUB-TOPIC: ACADEMIC PARTNERS WINDOW                   */}
      {/* ======================================================== */}
      {activeSubTopic === "academic-partners" && (
        <div className="bg-transparent p-5 md:p-6 pt-6 md:pt-7 space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Academic Partners</h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage college and university partnerships displayed on the website carousel in real time.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddPartnerOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-blue-700" />
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
                      {(() => {
                        const isVisible = partner.isActive !== false;
                        return (
                          <div className={`group h-full relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${!isVisible
                            ? "bg-slate-100/70 border-dashed border-amber-300 shadow-none opacity-85"
                            : "bg-slate-50/80 hover:bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-md"
                            }`}>
                            {/* Action Buttons: Toggle Visibility, Edit & Delete */}
                            <div className="absolute top-2.5 right-2.5 flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 pointer-events-auto">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTogglePartnerVisibility(partner);
                                }}
                                title={isVisible ? "Currently Visible on website (Click to Hide)" : "Currently Hidden from website (Click to Show)"}
                                className={`w-7 h-7 rounded-lg border shadow-xs flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 pointer-events-auto hover:scale-110 ${isVisible
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-md"
                                  : "bg-amber-50 text-amber-600 border-amber-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-md"
                                  }`}
                              >
                                {isVisible ? (
                                  <Eye className="w-3.5 h-3.5 transition-transform duration-300" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5 transition-transform duration-300" />
                                )}
                              </button>
                              <button
                                onClick={() => openEditPartner(partner)}
                                title="Edit Partner"
                                className="w-7 h-7 rounded-lg bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 pointer-events-auto"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePartner(partner.id, partner.name)}
                                title="Remove Partner"
                                className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95 pointer-events-auto"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Logo Preview */}
                            <div className="w-full h-32 flex items-center justify-center mb-3 pointer-events-none mt-1">
                              {partner.logo && !imgError[partner.id] ? (
                                <img
                                  src={resolveImageUrl(partner.logo)}
                                  alt={partner.name}
                                  referrerPolicy="no-referrer"
                                  className={`max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-200 ${!isVisible ? "grayscale opacity-55" : ""
                                    }`}
                                  onError={() => setImgError((prev) => ({ ...prev, [partner.id]: true }))}
                                />
                              ) : (
                                <Building2 className="w-10 h-10 text-blue-600/70" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="pointer-events-none">
                              <h3 className="font-normal text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 mb-1" title={partner.name}>
                                {partner.name}
                              </h3>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span>📍 {partner.city || "Amravati"}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })()}
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
        <div className="bg-transparent p-5 md:p-6 pt-6 md:pt-7 space-y-6 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-normal">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Certifications Management</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-purple-50 text-purple-700 border border-purple-100">
                      {certifications.length} Active
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
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${certsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsManageCategoriesOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                Manage Categories
              </button>

              <button
                onClick={() => setIsAddCertOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-blue-700" />
                Add New Certification
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[{ id: 'all', name: 'All' }, ...categories].map((catObj) => {
              const catName = catObj.name;
              const count =
                catName === "All"
                  ? certifications.length
                  : certifications.filter(
                    (c) => isCategoryMatch(c.category, catName)
                  ).length;

              const isSelected = selectedCategory === catName;

              return (
                <button
                  key={catObj.id}
                  onClick={() => setSelectedCategory(catName)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${isSelected
                    ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-xs font-semibold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70"
                    }`}
                >
                  <span>{catName}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isSelected
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
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
                      <div className="group h-full relative bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
                        {/* Action Buttons: Edit, Highlights & Delete (Vertical in top-right) */}
                        <div className="absolute top-2.5 right-2.5 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                          <button
                            onClick={() => openEditCert(cert)}
                            title="Edit Course Details"
                            className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 pointer-events-auto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openHighlightsManager(cert)}
                            title="Manage Certification Highlights"
                            className="w-8 h-8 rounded-full bg-white text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 border border-slate-200 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 pointer-events-auto"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteCertification(cert.id, cert.title)}
                            title="Remove Certification"
                            className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95 pointer-events-auto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Course Thumbnail Image (Full-bleed flush to top/left/right) */}
                        <div className="w-full h-48 sm:h-52 overflow-hidden relative bg-slate-100 flex items-center justify-center">
                          {cert.image && !imgError[cert.id] ? (
                            <img
                              src={resolveImageUrl(cert.image)}
                              alt={cert.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 pointer-events-auto"
                              onError={() => setImgError((prev) => ({ ...prev, [cert.id]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center">
                              <Award className="w-12 h-12 text-purple-300/60 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                          )}
                        </div>

                        {/* Card Content with padding */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div className="pointer-events-none">
                            {/* Category & Highlights Badge */}
                            <div className="mb-1.5 flex items-center justify-between gap-1">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                                {cert.category}
                              </span>
                              <button
                                type="button"
                                onClick={() => openHighlightsManager(cert)}
                                title="Click to view/edit highlights"
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-pointer pointer-events-auto hover:opacity-85 transition-all ${Array.isArray(cert.features) && cert.features.length > 0
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70"
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200/60"
                                  }`}
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                {Array.isArray(cert.features) && cert.features.length > 0
                                  ? `${cert.features.length} Highlights`
                                  : "0 Points"}
                              </button>
                            </div>

                            {/* Title */}
                            <h3 className="font-normal text-gray-800 text-sm leading-snug mb-2 line-clamp-1" title={cert.title}>
                              {cert.title}
                            </h3>

                            {/* Meta info */}
                            <div className="space-y-1 text-xs text-gray-600 mb-3">
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                <span>Duration: <span className="text-slate-700 font-normal">{cert.duration}</span></span>
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
                              <span className="text-slate-800 font-normal text-sm">{cert.fees && cert.fees.trim() ? cert.fees : <span className="text-slate-400 italic text-xs">Optional (Hidden on website)</span>}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => openCurriculumManager(cert)}
                                className="text-[11px] font-normal text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 z-20 pointer-events-auto"
                                title="Manage Course Curriculum"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                                <span>Curriculum</span>
                              </button>
                            </div>
                          </div>
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
        <div className="bg-transparent p-5 md:p-6 pt-6 md:pt-7 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-normal">
                  <Quote className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Student Success Stories</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-amber-50 text-amber-700 border border-amber-100">
                      {testimonials.length} Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage student testimonials, reviews, ratings, and placements shown on the Home page.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchTestimonials}
                disabled={testimonialsLoading}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95" title="Refresh Stories">
                <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${testimonialsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsAddTestiOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-blue-700" />
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
                        {/* Action Buttons: Edit & Delete (Vertical in top-right as Mentor) */}
                        <div className="absolute top-2.5 right-2.5 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                          <button
                            onClick={() => openEditTestimonial(story)}
                            title="Edit Story"
                            className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 pointer-events-auto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteTestimonial(story.id, story.name)}
                            title="Remove Story"
                            className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95 pointer-events-auto"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="pointer-events-none">
                          {/* Student Info */}
                          <div className="flex items-center gap-3.5 mb-4">
                            <img
                              src={resolveImageUrl(story.image)}
                              alt={story.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md bg-slate-200 pointer-events-auto"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <div className="pr-12">
                              <h3 className="font-normal text-gray-800 text-sm leading-snug">{story.name}</h3>
                              <p className="text-xs text-gray-500 font-normal">{story.role} {story.company && `• ${story.company}`}</p>
                            </div>
                          </div>

                          {/* Review Quote */}
                          <p className="text-slate-700 text-xs italic leading-relaxed mb-4 font-normal">
                            "{story.quote}"
                          </p>
                        </div>

                        {/* Rating Stars & Badges */}
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

                          <div className="flex items-center gap-1.5">
                            {story.youtubeUrl && (
                              <span className="flex items-center gap-1 text-[10px] font-normal text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                <Video className="w-3 h-3 text-red-500" />
                                Video
                              </span>
                            )}
                            <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              Verified
                            </span>
                          </div>
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddPartnerOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Add Academic Partner</h3>
                <p className="text-xs text-gray-400">Enter partner institution details, logo, and location</p>
              </div>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Left Column: Logo */}
                <div className="sm:col-span-5 flex flex-col">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Logo <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    value={partnerFormData.logo}
                    onChange={(url) => setPartnerFormData({ ...partnerFormData, logo: url })}
                    heightClassName="h-[210px]"
                  />
                </div>

                {/* Right Column: Name, City, Website */}
                <div className="sm:col-span-7 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerFormData.name}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerFormData.city}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Website (Optional)
                    </label>
                    <input
                      type="text"
                      value={partnerFormData.website}
                      onChange={(e) => setPartnerFormData({ ...partnerFormData, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons on Bottom Right */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPartner}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer disabled:opacity-50"
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
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditPartnerOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Edit Academic Partner</h3>
                <p className="text-xs text-gray-400">Update partner institution details, logo, and location</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePartner} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Left Column: Logo */}
                <div className="sm:col-span-5 flex flex-col">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Logo <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    value={editPartnerFormData.logo}
                    onChange={(url) => setEditPartnerFormData({ ...editPartnerFormData, logo: url })}
                    heightClassName="h-[210px]"
                  />
                </div>

                {/* Right Column: Name, City, Website */}
                <div className="sm:col-span-7 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editPartnerFormData.name}
                      onChange={(e) => setEditPartnerFormData({ ...editPartnerFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editPartnerFormData.city}
                      onChange={(e) => setEditPartnerFormData({ ...editPartnerFormData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Website (Optional)
                    </label>
                    <input
                      type="text"
                      value={editPartnerFormData.website}
                      onChange={(e) => setEditPartnerFormData({ ...editPartnerFormData, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons on Bottom Right */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditPartnerOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPartner}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Add New Certification</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Create a career program highlight on the Home page</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCertOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              <form id="add-cert-form" onSubmit={handleAddCertification} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Certification Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={certFormData.title}
                    onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={certFormData.category}
                        onChange={(e) => setCertFormData({ ...certFormData, category: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer text-sm font-normal"
                      >
                        <option value="" disabled>Select Domain</option>
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.name} className="bg-white text-black py-1.5">
                              {cat.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Information Technology" className="bg-white text-black py-1.5">Information Technology</option>
                            <option value="Digital Media Technology" className="bg-white text-black py-1.5">Digital Media Technology</option>
                            <option value="Management Programs" className="bg-white text-black py-1.5">Management Programs</option>
                            <option value="Design Programs" className="bg-white text-black py-1.5">Design Programs</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={certFormData.duration}
                      onChange={(e) => setCertFormData({ ...certFormData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Certification Fees
                  </label>
                  <input
                    type="text"
                    value={certFormData.fees}
                    onChange={(e) => setCertFormData({ ...certFormData, fees: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    About Certification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={certFormData.description}
                    onChange={(e) => setCertFormData({ ...certFormData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y min-h-[140px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Course Image <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    category="certifications"
                    value={certFormData.image}
                    onChange={(url) => setCertFormData({ ...certFormData, image: url })}
                    heightClassName="h-[180px]"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button
                type="button"
                onClick={() => setIsAddCertOpen(false)}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-cert-form"
                disabled={submittingCert}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {submittingCert ? "Adding..." : "Add Certification"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Edit Featured Certification                       */}
      {/* ======================================================== */}
      {isEditCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-slate-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Certification</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Update career program highlight details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditCertOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              <form id="edit-cert-form" onSubmit={handleUpdateCertification} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Certification Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editCertData.title}
                    onChange={(e) => setEditCertData({ ...editCertData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={editCertData.category}
                        onChange={(e) => setEditCertData({ ...editCertData, category: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer text-sm font-normal"
                      >
                        <option value="" disabled>Select Domain</option>
                        {categories.length > 0 ? (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.name} className="bg-white text-black py-1.5">
                              {cat.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Information Technology" className="bg-white text-black py-1.5">Information Technology</option>
                            <option value="Digital Media Technology" className="bg-white text-black py-1.5">Digital Media Technology</option>
                            <option value="Management Programs" className="bg-white text-black py-1.5">Management Programs</option>
                            <option value="Design Programs" className="bg-white text-black py-1.5">Design Programs</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editCertData.duration}
                      onChange={(e) => setEditCertData({ ...editCertData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Certification Fees
                  </label>
                  <input
                    type="text"
                    value={editCertData.fees}
                    onChange={(e) => setEditCertData({ ...editCertData, fees: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    About Certification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={editCertData.description}
                    onChange={(e) => setEditCertData({ ...editCertData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-black focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-y min-h-[140px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Course Image <span className="text-red-500">*</span>
                  </label>
                  <ImageUpload
                    category="certifications"
                    value={editCertData.image}
                    onChange={(url) => setEditCertData({ ...editCertData, image: url })}
                    heightClassName="h-[180px]"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <button
                type="button"
                onClick={() => setIsEditCertOpen(false)}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-cert-form"
                disabled={updatingCert}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {updatingCert ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Modal: Add New Student Success Story                     */}
      {/* ======================================================== */}
      {isAddTestiOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsAddTestiOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Add Success Story</h3>
                <p className="text-xs text-gray-400">Feature an alumni placement review and testimonial</p>
              </div>
            </div>

            <form onSubmit={handleAddTestimonial} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Left Column: Photo & Video */}
                <div className="sm:col-span-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Student Photo
                    </label>
                    <ImageUpload
                      value={testiFormData.image}
                      onChange={(url) => setTestiFormData({ ...testiFormData, image: url })}
                      category="testimonials"
                      heightClassName="h-[270px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-red-500" />
                      <span>Testimonial Video (YouTube URL)</span>
                    </label>
                    <input
                      type="text"
                      value={testiFormData.youtubeUrl}
                      onChange={(e) => setTestiFormData({ ...testiFormData, youtubeUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>
                </div>

                {/* Right Column: Name, Role, Company, Package, Rating, Feedback */}
                <div className="sm:col-span-7 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={testiFormData.name}
                      onChange={(e) => setTestiFormData({ ...testiFormData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={testiFormData.role}
                        onChange={(e) => setTestiFormData({ ...testiFormData, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={testiFormData.company}
                        onChange={(e) => setTestiFormData({ ...testiFormData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Package <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={testiFormData.packageAmt}
                        onChange={(e) => setTestiFormData({ ...testiFormData, packageAmt: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Rating
                      </label>
                      <div className="relative">
                        <select
                          value={testiFormData.rating}
                          onChange={(e) => setTestiFormData({ ...testiFormData, rating: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer font-normal text-gray-700"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                          <option value={3}>⭐⭐⭐ (3 Stars)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Write your feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={testiFormData.quote}
                      onChange={(e) => setTestiFormData({ ...testiFormData, quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons on Bottom Right */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddTestiOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTesti}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer disabled:opacity-50"
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
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsEditTestiOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-normal">
                <Quote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Edit Student Success Story</h3>
                <p className="text-xs text-gray-400">Update review, name, role, video or photo</p>
              </div>
            </div>

            <form onSubmit={handleUpdateTestimonial} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Left Column: Photo & Video */}
                <div className="sm:col-span-5 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Student Photo
                    </label>
                    <ImageUpload
                      value={editTestiData.image}
                      onChange={(url) => setEditTestiData({ ...editTestiData, image: url })}
                      category="testimonials"
                      heightClassName="h-[270px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-red-500" />
                      <span>Testimonial Video (YouTube URL)</span>
                    </label>
                    <input
                      type="text"
                      value={editTestiData.youtubeUrl}
                      onChange={(e) => setEditTestiData({ ...editTestiData, youtubeUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>
                </div>

                {/* Right Column: Name, Role, Company, Package, Rating, Feedback */}
                <div className="sm:col-span-7 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editTestiData.name}
                      onChange={(e) => setEditTestiData({ ...editTestiData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editTestiData.role}
                        onChange={(e) => setEditTestiData({ ...editTestiData, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editTestiData.company}
                        onChange={(e) => setEditTestiData({ ...editTestiData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Package <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editTestiData.packageAmt}
                        onChange={(e) => setEditTestiData({ ...editTestiData, packageAmt: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Rating
                      </label>
                      <div className="relative">
                        <select
                          value={editTestiData.rating}
                          onChange={(e) => setEditTestiData({ ...editTestiData, rating: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 rounded-xl text-sm outline-none transition-all appearance-none cursor-pointer font-normal text-gray-700"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                          <option value={3}>⭐⭐⭐ (3 Stars)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Write your feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={editTestiData.quote}
                      onChange={(e) => setEditTestiData({ ...editTestiData, quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons on Bottom Right */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditTestiOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingTesti}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer disabled:opacity-50"
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
                    <h3 className="text-base font-semibold text-slate-900">
                      {selectedCourseForCurriculum.title} — Course Curriculum
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-purple-50 text-purple-700 border border-purple-200">
                      {selectedCourseForCurriculum.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Add, edit, or reorder curriculum phases, modules, and key learning topics for this course.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-normal px-3 py-1 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-xs">
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
                  <h4 className="text-xs font-normal text-slate-600 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    Syllabus Modules ({curriculumModules.length})
                  </h4>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Live syncing to Course Detail page
                  </span>
                </div>

                {curriculumLoading ? (
                  <div className="py-20 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
                    <p className="text-xs font-normal">Loading course modules...</p>
                  </div>
                ) : curriculumModules.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-normal text-slate-700">No Modules in Curriculum</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-normal">
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
                          className={`rounded-2xl border transition-all ${isEditing
                            ? "bg-purple-50/50 border-purple-300 ring-2 ring-purple-500/20 p-4"
                            : "bg-white border-slate-200/80 hover:border-purple-200 hover:shadow-sm p-4"
                            }`}
                        >
                          {isEditing ? (
                            /* Inline Edit Mode */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-normal text-purple-700">
                                  Editing Module #{idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEditingModuleIndex(null)}
                                  className="text-xs text-slate-400 hover:text-slate-600 font-normal cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>

                              <div>
                                <label className="block text-[11px] font-normal text-slate-600 mb-1">
                                  Module / Phase Title
                                </label>
                                <input
                                  type="text"
                                  value={editModuleTitle}
                                  onChange={(e) => setEditModuleTitle(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-normal  focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-normal text-slate-600 mb-1">
                                  Topics (One per line or comma-separated)
                                </label>
                                <textarea
                                  rows={4}
                                  value={editModuleTopics}
                                  onChange={(e) => setEditModuleTopics(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-normal  focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-y text-gray-500"
                                />
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingModuleIndex(null)}
                                  className="px-3 py-1.5 text-xs font-normal text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                                >
                                  Discard
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveEditedModule}
                                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
                                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-[11px] font-medium flex items-center justify-center shrink-0">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <h5 className="font-normal text-slate-800 text-sm leading-tight">
                                    {module.title || module.module || module.name || `Module ${idx + 1}`}
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
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100/90 text-slate-700 rounded-lg text-[11px] font-normal border border-slate-200/60"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic mt-1 font-normal">
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
                    <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-normal">
                      <ListPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-normal text-slate-800 text-sm">
                        Add New Module / Phase
                      </h4>
                      <p className="text-[11px] text-slate-400 font-normal">
                        Append a learning milestone to syllabus
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddNewModule} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-normal text-slate-600 mb-1">
                        Module Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-normal text-slate-600 mb-1">
                        Key Topics List
                      </label>
                      <textarea
                        rows={5}
                        value={newModuleTopics}
                        onChange={(e) => setNewModuleTopics(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal  focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-y text-gray-500"
                      />
                      <span className="block text-[10px] text-slate-400 mt-1 font-normal">
                        💡 Tip: Paste multiple topics directly from syllabus text.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 font-medium text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Module to List
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCurriculumOpen(false)}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs rounded-full transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={savingCurriculum}
                onClick={handleSaveAllCurriculum}
                className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 font-medium text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
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
      )}

      {/* ======================================================== */}
      {/* Modal: Certification Highlights Manager                 */}
      {/* ======================================================== */}
      {isHighlightsModalOpen && selectedCertForHighlights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      Certification Highlights
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-700">
                      {selectedCertForHighlights.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure bullet points displayed on the certification page
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHighlightsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Quick Add Bar */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                  Add New Highlight Point
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newHighlightInput}
                    onChange={(e) => setNewHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddHighlightPoint();
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlightPoint}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 font-medium text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Point
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-medium">Quick suggestions:</span>
                  {[
                    "Live Industry Projects",
                    "AI-Assisted Workflows",
                    "1-on-1 Mentorship & Doubt Clearing",
                    "Resume Building & Portfolio Review",
                    "Exclusive BITC Placement Drive"
                  ].map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        if (!highlightsList.some((h) => (h.text || h).toLowerCase() === preset.toLowerCase())) {
                          setHighlightsList([
                            ...highlightsList,
                            {
                              id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                              text: preset,
                            },
                          ]);
                        }
                      }}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-200 transition-all cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights Count & Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    Active Highlights
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {highlightsList.length} items
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 ml-1">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                    Drag to reorder
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleInsertStandardHighlights}
                  className="text-[11px] font-medium text-purple-700 hover:text-purple-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  + Insert BITC Career Essentials
                </button>
              </div>

              {/* List of Highlights */}
              {highlightsList.length === 0 ? (
                <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-6">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium text-slate-700">No Highlights Added Yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Type a point above and click "Add Point" or insert the BITC Career Essentials.
                  </p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndHighlights}>
                  <SortableContext items={highlightsList.map((h) => h.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {highlightsList.map((item, idx) => (
                        <SortableHighlightItem
                          key={item.id}
                          item={item}
                          index={idx}
                          onEdit={handleEditHighlightPoint}
                          onRemove={handleRemoveHighlightPoint}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsHighlightsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingHighlights}
                  onClick={handleSaveHighlights}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 font-medium text-xs rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {savingHighlights ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Save Highlights
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {isManageCategoriesOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Manage Categories
              </h3>
              <button
                onClick={() => setIsManageCategoriesOpen(false)}
                className="p-1.5 hover:bg-white rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleAddCategory} className="mb-6">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Add New Category <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={addingCategory}
                    className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {addingCategory ? "Adding..." : "Add"}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-500">
                    Existing Categories
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                    Drag to reorder
                  </span>
                </div>
                {categoriesLoading ? (
                  <p className="text-xs text-slate-400">Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No categories found.</p>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndCategories}>
                    <SortableContext items={categories.map((c) => c.id)} strategy={rectSortingStrategy}>
                      <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
                        {categories.map((cat) => (
                          <SortableCategoryItem
                            key={cat.id}
                            cat={cat}
                            onUpdate={handleUpdateCategory}
                            onDelete={handleDeleteCategory}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsManageCategoriesOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-full transition-all border border-transparent hover:border-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;


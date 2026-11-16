import { resolveImageUrl, getApiUrl, getSiteUrl } from "../utils";
import React, { useState, useEffect } from "react";
import DeleteConfirmModal from "./uic/DeleteConfirmModal.jsx";
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
  GripVertical,
  Check,
  ChevronDown,
  Linkedin,
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItem } from "./uic/SortableItem";
import ImageUpload from "./ImageUpload";
const LOCAL_COMPANY_LOGOS = {
  "bizonance": "/logos/bizonance.png",
  "bizonance edtech": "/logos/bizonance.png",
  "bizonance technologies": "/logos/bizonance.png",
  "bizonance pvt ltd": "/logos/bizonance.png",
  "google": "/logos/google.svg",
  "microsoft": "/logos/microsoft.svg",
  "amazon": "/logos/amazon.svg",
  "aws": "/logos/amazon.svg",
  "tcs": "/logos/tcs.svg",
  "tata consultancy services": "/logos/tcs.svg",
  "infosys": "/logos/infosys.svg",
  "wipro": "/logos/wipro.svg",
  "cognizant": "/logos/cognizant.svg",
  "capgemini": "/logos/capgemini.svg",
  "deloitte": "/logos/deloitte.svg",
  "accenture": "/logos/accenture.svg",
  "hcl": "/logos/hcl.svg",
  "hcl tech": "/logos/hcl.svg",
  "hcltech": "/logos/hcl.svg",
  "ibm": "/logos/ibm.svg",
  "tech mahindra": "/logos/tech-mahindra.svg",
  "techmahindra": "/logos/tech-mahindra.svg",
  "apple": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "meta": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "facebook": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  "netflix": "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "adobe": "https://www.google.com/s2/favicons?domain=adobe.com&sz=128",
  "mckinsey": "https://www.google.com/s2/favicons?domain=mckinsey.com&sz=128",
  "oracle": "https://www.google.com/s2/favicons?domain=oracle.com&sz=128",
  "cisco": "https://www.google.com/s2/favicons?domain=cisco.com&sz=128",
  "salesforce": "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128",
  "intel": "https://www.google.com/s2/favicons?domain=intel.com&sz=128",
  "nvidia": "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128",
  "uber": "https://www.google.com/s2/favicons?domain=uber.com&sz=128",
  "zomato": "https://www.google.com/s2/favicons?domain=zomato.com&sz=128",
  "swiggy": "https://www.google.com/s2/favicons?domain=swiggy.com&sz=128",
  "paytm": "https://www.google.com/s2/favicons?domain=paytm.com&sz=128",
  "flipkart": "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128",
  "phonepe": "https://www.google.com/s2/favicons?domain=phonepe.com&sz=128",
  "razorpay": "https://www.google.com/s2/favicons?domain=razorpay.com&sz=128",
  "cred": "https://www.google.com/s2/favicons?domain=cred.club&sz=128",
  "ola": "https://www.google.com/s2/favicons?domain=olacabs.com&sz=128",
  "zoho": "https://www.google.com/s2/favicons?domain=zoho.com&sz=128",
  "atlassian": "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
  "spotify": "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
  "slack": "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
  "stripe": "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
  "paypal": "https://www.google.com/s2/favicons?domain=paypal.com&sz=128",
};

const getCompanyLogo = (companyName, customLogo = null) => {
  if (customLogo && typeof customLogo === "string" && customLogo.trim()) {
    return resolveImageUrl(customLogo);
  }
  if (!companyName) return "";
  const normalized = companyName.trim().toLowerCase();

  if (LOCAL_COMPANY_LOGOS[normalized]) {
    return LOCAL_COMPANY_LOGOS[normalized];
  }

  for (const [key, logo] of Object.entries(LOCAL_COMPANY_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return logo;
    }
  }

  const cleanDomain = normalized.replace(/[^a-z0-9]/g, "");
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}.com&sz=128`;
};

const CompanyLogoField = ({ company, value, onChange, heightClassName = "h-[110px]", required = false }) => {
  const [isFetched, setIsFetched] = useState(false);
  const [autoLogoUrl, setAutoLogoUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    setManualOverride(false);

    if (!company || !company.trim()) {
      setIsFetched(false);
      setAutoLogoUrl("");
      setChecking(false);
      return;
    }

    const normalized = company.trim().toLowerCase();

    // 1. Check local dictionary first
    let localMatch = LOCAL_COMPANY_LOGOS[normalized];
    if (!localMatch) {
      for (const [key, logo] of Object.entries(LOCAL_COMPANY_LOGOS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          localMatch = logo;
          break;
        }
      }
    }

    if (localMatch) {
      setAutoLogoUrl(localMatch);
      setIsFetched(true);
      setChecking(false);
      if (!value) onChange(localMatch);
      return;
    }

    // 2. Check Google Favicon asynchronously with debounce
    setChecking(true);
    let cancelled = false;

    const timer = setTimeout(() => {
      const cleanDomain = normalized.replace(/[^a-z0-9]/g, "");
      if (!cleanDomain || cleanDomain.length < 2) {
        if (!cancelled) {
          setAutoLogoUrl("");
          setIsFetched(false);
          setChecking(false);
        }
        return;
      }

      const testUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}.com&sz=128`;
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        // Google returns 16x16 default globe PNG when domain does not exist or has no favicon
        if (img.naturalWidth > 16 || img.naturalHeight > 16) {
          setAutoLogoUrl(testUrl);
          setIsFetched(true);
          if (!value) onChange(testUrl);
        } else {
          setAutoLogoUrl("");
          setIsFetched(false);
        }
        setChecking(false);
      };
      img.onerror = () => {
        if (cancelled) return;
        setAutoLogoUrl("");
        setIsFetched(false);
        setChecking(false);
      };
      img.src = testUrl;
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [company]);

  // Case A: Custom logo already uploaded
  if (value && typeof value === "string" && value.trim()) {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Company Logo {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl">
          <div className="flex items-center gap-2.5">
            <img
              src={resolveImageUrl(value)}
              alt="Uploaded Company Logo"
              className="w-7 h-7 object-contain bg-white rounded-lg p-0.5 border border-blue-100 shadow-2xs"
            />
            <div>
              <span className="text-xs font-semibold text-blue-900 block">Uploaded Company Logo</span>
              <span className="text-[11px] text-blue-600 block">Custom logo for {company || "mentor"}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setManualOverride(false);
            }}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 font-medium transition-all cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  // Case B: Logo IS fetched automatically and user hasn't asked for manual override
  if (isFetched && !manualOverride) {
    return (
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-700">
          Company Logo {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center justify-between p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-emerald-100 flex items-center justify-center p-1 shadow-2xs">
              <img
                src={autoLogoUrl}
                alt="Auto Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-emerald-900">Logo Fetched Automatically</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-800">
                  Auto
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Found logo for <span className="font-semibold">{company}</span>. No upload required.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setManualOverride(true)}
            className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline shrink-0 ml-2 cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // Case C: Logo is NOT fetched -> SHOW UPLOAD BUTTON!
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          Company Logo {required && <span className="text-red-500">*</span>}
        </label>
        {checking ? (
          <span className="text-[11px] text-gray-400 animate-pulse">Checking logo...</span>
        ) : company && !isFetched ? (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Logo not found automatically • Please upload
          </span>
        ) : (
          <span className="text-[11px] font-normal text-gray-400">(Auto-fetched if available)</span>
        )}
      </div>
      <ImageUpload
        category="mentors"
        value={value}
        onChange={onChange}
        heightClassName={heightClassName}
      />
    </div>
  );
};

export const DEPARTMENTS = [
  "Information Technology",
  "Digital Media Technology",
  "Management Programs",
  "Design Programs",
  "Academic & Training"
];


const SortableDomainItem = ({ cat, onUpdate, onDelete }) => {
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
            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-gray-700"
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
              title="Drag to reorder domain"
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
              title="Edit Domain Name"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(cat.id, cat.name)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Domain"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const About = ({ activeSubTopic = "mentors" }) => {
  // Working Domains State
  const [isManageDomainsOpen, setIsManageDomainsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

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

  // Helper to format experience with default "+ Years"
  const formatExperience = (exp) => {
    if (!exp) return "1+ Years";
    const trimmed = String(exp).trim();
    if (!trimmed) return "1+ Years";
    if (/fresher/i.test(trimmed)) return trimmed;
    if (/years?/i.test(trimmed)) return trimmed;
    if (trimmed.endsWith("+")) return `${trimmed} Years`;
    if (/^\d+\s*(-|to)\s*\d+$/i.test(trimmed)) return `${trimmed} Years`;
    if (/^\d+$/.test(trimmed)) return `${trimmed}+ Years`;
    return `${trimmed}+ Years`;
  };





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
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

  // Mentor Form Data
  const [mentorForm, setMentorForm] = useState({
    name: "",
    role: "",
    company: "",
    companyLogo: "",
    exp: "",
    category: "Industry Expert",
    area: "Industry Expert",
    skills: "",
    img: "",
    linkedin: "",
    thought: "",
  });

  const [editMentorForm, setEditMentorForm] = useState({
    name: "",
    role: "",
    company: "",
    companyLogo: "",
    exp: "",
    category: "Industry Expert",
    area: "Industry Expert",
    skills: "",
    img: "",
    linkedin: "",
    thought: "",
  });

  // Job Opening Form Data
  const [jobForm, setJobForm] = useState({
    title: "",
    type: "Full-Time",
    location: "On-Site",
    experience: "",
    department: DEPARTMENTS[0],
    description: "",
    specialities: "",
  });

  const [editJobForm, setEditJobForm] = useState({
    title: "",
    type: "Full-Time",
    location: "On-Site",
    experience: "",
    department: DEPARTMENTS[0],
    description: "",
    specialities: "",
    status: "Active",
  });


  // Alumni Form Data
  const [alumniForm, setAlumniForm] = useState({
    name: "",
    role: "",
    company: "",
    photo: "",
    batch: "",
    certification: "",
    linkedin: "",
  });

  const [editAlumniForm, setEditAlumniForm] = useState({
    name: "",
    role: "",
    company: "",
    photo: "",
    batch: "",
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

  const apiUrl = getApiUrl();

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

        if (routeName === "careers") {
          fetch(`${apiUrl}/cms/careers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: newOrder }),
          }).catch(() => null);

          fetch(`${getSiteUrl()}/api/careers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderedIds: newOrder.map((item) => item.id) }),
          }).catch(() => null);
        }

        return newOrder;
      });
    }
  };


  // Mentor Categories Handlers
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${apiUrl}/mentor-categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.categories) setCategories(data.categories);
      }
    } catch (err) {
      console.warn("Failed to fetch mentor categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAddingCategory(true);
    try {
      const res = await fetch(`${apiUrl}/mentor-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
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
    setConfirmDialog({
      isOpen: true,
      title: "Delete Category",
      message: `Are you sure you want to delete "${name}"? Mentors assigned to this category might be affected.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`${apiUrl}/mentor-categories/${id}`, {
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
        }
      },
    });
  };

  const handleUpdateCategory = async (id, updatedName) => {
    try {
      const res = await fetch(`${apiUrl}/mentor-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: updatedName }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || categories.map((c) => (c.id === id ? { ...c, name: updatedName } : c)));
        showNotification("Category updated successfully!");
      } else {
        showNotification(data.error || "Failed to update category", "error");
      }
    } catch (err) {
      showNotification("Network error while updating category", "error");
    }
  };

  const handleDragEndCategories = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        fetch(`${apiUrl}/mentor-categories/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) }),
        }).catch((err) => console.error("Failed to save category reorder", err));

        return newItems;
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
      // 1. Primary Express backend /careers
      try {
        const res = await fetch(`${apiUrl}/careers`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data.openings) ? data.openings : (Array.isArray(data) ? data : []);
          setOpenings(list);
          setOpeningsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Primary /careers endpoint notice:", err);
      }

      // 2. Direct Neon PostgreSQL CMS data store
      try {
        const resCms = await fetch(`${apiUrl}/cms/careers`);
        if (resCms.ok) {
          const dataCms = await resCms.json();
          const list = Array.isArray(dataCms) ? dataCms : (dataCms.data || dataCms.openings || []);
          setOpenings(list);
          setOpeningsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("CMS /cms/careers endpoint notice:", err);
      }

      // 3. Fallback to website API /api/careers
      try {
        const resSite = await fetch(`${getSiteUrl()}/api/careers`);
        if (resSite.ok) {
          const dataSite = await resSite.json();
          const list = Array.isArray(dataSite.openings) ? dataSite.openings : (Array.isArray(dataSite) ? dataSite : []);
          setOpenings(list);
          setOpeningsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Site /api/careers endpoint notice:", err);
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
    fetchCategories();
  }, []);

  // Handle Add Mentor
  const handleAddMentor = async (e) => {
    e.preventDefault();
    if (!mentorForm.name.trim()) {
      showNotification("Please enter mentor's full name", "error");
      return;
    }
    if (!mentorForm.role?.trim()) {
      showNotification("Please enter role / designation", "error");
      return;
    }
    if (!mentorForm.company?.trim()) {
      showNotification("Please enter company / organization", "error");
      return;
    }
    if (!mentorForm.category?.trim() && !mentorForm.area?.trim()) {
      showNotification("Please select mentor category", "error");
      return;
    }
    if (!mentorForm.exp?.trim()) {
      showNotification("Please enter experience", "error");
      return;
    }
    if (!mentorForm.skills?.trim()) {
      showNotification("Please enter skills", "error");
      return;
    }
    if (!mentorForm.linkedin?.trim()) {
      showNotification("Please enter LinkedIn URL", "error");
      return;
    }
    if (!mentorForm.img?.trim()) {
      showNotification("Please upload profile picture", "error");
      return;
    }
    if (!mentorForm.companyLogo?.trim()) {
      showNotification("Please upload company logo", "error");
      return;
    }

    setSubmittingMentor(true);
    try {
      const chosenCat = mentorForm.category || mentorForm.area || "Industry Expert";
      const res = await fetch(`${apiUrl}/mentors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mentorForm,
          category: chosenCat,
          area: chosenCat,
          skills: mentorForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMentors(data.mentors || [data.mentor, ...mentors]);
        setIsAddMentorOpen(false);
        setMentorForm({
          name: "",
          role: "",
          company: "",
          companyLogo: "",
          exp: "",
          category: "Industry Expert",
          area: "Industry Expert",
          skills: "",
          img: "",
          linkedin: "",
          thought: "",
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
  const handleDeleteMentor = (id, name) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Mentor",
      message: `Are you sure you want to remove "${name}" from Mentors?`,
      onConfirm: async () => {
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
      }
    });
  };

  const openEditMentor = (mentor) => {
    setEditingMentorId(mentor.id);
    const cat = (mentor.category || mentor.area || "Industry Experts").trim();
    const matched = categories.find(
      (c) => c.name.toLowerCase() === cat.toLowerCase() ||
             c.name.toLowerCase().replace(/s$/, "") === cat.toLowerCase().replace(/s$/, "")
    );
    const finalCat = matched ? matched.name : cat;
    setEditMentorForm({
      name: mentor.name || "",
      role: mentor.role || "",
      company: mentor.company || "",
      companyLogo: mentor.companyLogo || "",
      exp: mentor.exp || "",
      category: finalCat,
      area: finalCat,
      skills: Array.isArray(mentor.skills) ? mentor.skills.join(", ") : mentor.skills || "",
      img: mentor.img || "",
      linkedin: mentor.linkedin || "",
      thought: mentor.thought || "",
    });
    setIsEditMentorOpen(true);
  };

  const handleUpdateMentor = async (e) => {
    e.preventDefault();
    if (!editMentorForm.name.trim()) {
      showNotification("Please enter mentor name", "error");
      return;
    }
    if (!editMentorForm.role?.trim()) {
      showNotification("Please enter role / designation", "error");
      return;
    }
    if (!editMentorForm.company?.trim()) {
      showNotification("Please enter company / organization", "error");
      return;
    }
    if (!editMentorForm.category?.trim() && !editMentorForm.area?.trim()) {
      showNotification("Please select mentor category", "error");
      return;
    }
    if (!editMentorForm.exp?.trim()) {
      showNotification("Please enter experience", "error");
      return;
    }
    if (!editMentorForm.skills || (typeof editMentorForm.skills === "string" && !editMentorForm.skills.trim()) || (Array.isArray(editMentorForm.skills) && editMentorForm.skills.length === 0)) {
      showNotification("Please enter skills", "error");
      return;
    }
    if (!editMentorForm.linkedin?.trim()) {
      showNotification("Please enter LinkedIn URL", "error");
      return;
    }
    if (!editMentorForm.img?.trim()) {
      showNotification("Please upload profile picture", "error");
      return;
    }
    if (!editMentorForm.companyLogo?.trim()) {
      showNotification("Please upload company logo", "error");
      return;
    }

    setUpdatingMentor(true);
    try {
      const chosenCat = editMentorForm.category || editMentorForm.area || "Industry Expert";
      const res = await fetch(`${apiUrl}/mentors/${editingMentorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editMentorForm,
          category: chosenCat,
          area: chosenCat,
          skills: typeof editMentorForm.skills === "string" ? editMentorForm.skills.split(",").map((s) => s.trim()).filter(Boolean) : editMentorForm.skills,
        }),
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
      const payload = {
        ...jobForm,
        experience: formatExperience(jobForm.experience),
      };
      const res = await fetch(`${apiUrl}/careers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedList = data.openings || [data.opening, ...openings];
        setOpenings(updatedList);
        setIsAddJobOpen(false);

        // Synchronize directly with Neon PostgreSQL CMS store and Next.js site API
        fetch(`${apiUrl}/cms/careers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: updatedList }),
        }).catch(() => null);

        fetch(`${getSiteUrl()}/api/careers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: updatedList }),
        }).catch(() => null);

        setJobForm({
          title: "",
          type: "Full-Time",
          location: "On-Site",
          experience: "",
          department: DEPARTMENTS[0],
          description: "",
          specialities: "",
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
  const handleDeleteJob = (id, title) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Job Opening",
      message: `Are you sure you want to remove opening for "${title}"?`,
      onConfirm: async () => {
        try {
          // Optimistically update UI immediately
          const remaining = openings.filter((j) => j.id !== id);
          setOpenings(remaining);

          // 1. Delete from Express backend
          fetch(`${apiUrl}/careers/${id}`, {
            method: "DELETE",
          }).catch(() => null);

          // 2. Delete from Next.js website route
          fetch(`${getSiteUrl()}/api/careers?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          }).catch(() => null);

          // 3. Persist remaining list to Neon PostgreSQL CMS store
          fetch(`${apiUrl}/cms/careers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: remaining }),
          }).catch(() => null);

          showNotification(`Opening "${title}" removed successfully.`);
        } catch (err) {
          showNotification("Network error while deleting job opening", "error");
        }
      }
    });
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
      specialities: job.specialities || job.specialization || "",
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
      const payload = {
        ...editJobForm,
        experience: formatExperience(editJobForm.experience),
      };
      const res = await fetch(`${apiUrl}/careers/${editingJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedList = data.openings || openings.map((j) => (j.id === editingJobId ? { ...j, ...payload } : j));
        setOpenings(updatedList);
        setIsEditJobOpen(false);

        // Sync update with Neon PostgreSQL CMS store and Next.js site API
        fetch(`${apiUrl}/cms/careers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: updatedList }),
        }).catch(() => null);

        fetch(`${getSiteUrl()}/api/careers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingJobId, ...payload }),
        }).catch(() => null);

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
          role: "",
          company: "",
          photo: "",
          batch: "",
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
  const handleDeleteAlumni = (id, name) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Alumni",
      message: `Are you sure you want to remove alumni "${name}"?`,
      onConfirm: async () => {
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
      }
    });
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
    if (!alumniCompanyForm.logo?.trim()) {
      showNotification("Please upload company logo", "error");
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
    if (!editAlumniCompanyForm.logo?.trim()) {
      showNotification("Please upload company logo", "error");
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

  const handleDeleteAlumniCompany = (id, name) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Company",
      message: `Are you sure you want to remove "${name}" from Alumni Hiring Companies?`,
      onConfirm: async () => {
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
      }
    });
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
        const rawList = data.partners || [...industryPartners, data.partner];
        const seen = new Set();
        const deduped = [];
        for (const p of rawList) {
          const norm = p.name?.trim().toLowerCase();
          if (norm && !seen.has(norm)) {
            seen.add(norm);
            deduped.push(p);
          }
        }
        setIndustryPartners(deduped);
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

  const handleDeleteIndustryPartner = (id, name) => {
    setConfirmDialog({
      isOpen: true,
      title: "Remove Partner",
      message: `Are you sure you want to remove "${name}" from Industry Partners?`,
      onConfirm: async () => {
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
      }
    });
  };



  return (
    <div className="p-5 md:p-6 pt-6 md:pt-7 max-w-full mx-auto space-y-6 animate-in fade-in duration-200">
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

      {/* ======================================================== */}
      {/* 1. SUB-TOPIC: MENTORS MANAGEMENT                          */}
      {/* ======================================================== */}
      {activeSubTopic === "mentors" && (
        <div className="bg-transparent p-2 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-normal">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Industry Mentors & Trainers</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {mentors.length} Active
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
                onClick={() => setIsManageDomainsOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <Layers className="w-3.5 h-3.5" />
                Manage Domain
              </button>
              <button
                onClick={() => setIsAddMentorOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
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
                      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Photo Area (flush edge-to-edge) */}
                      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                        <img
                          src={resolveImageUrl(mentor.img)}
                          alt={mentor.name}
                          onError={() => setImgError((prev) => ({ ...prev, [mentor.id]: true }))}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Subtle hover dark tint */}
                        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        {/* Action Buttons: Edit & Delete (Vertical in top-right) */}
                        <div className="absolute top-2.5 right-2.5 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <button
                            onClick={() => openEditMentor(mentor)}
                            title="Edit Mentor"
                            className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMentor(mentor.id, mentor.name)}
                            title="Remove Mentor"
                            className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          {/* Info */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <h3 className="font-semibold text-slate-800 text-sm tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
                                {mentor.name}
                              </h3>
                              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                                <Briefcase className="w-3.5 h-3.5" /> {mentor.exp}
                              </span>
                            </div>
                            <p className="text-xs text-emerald-600 font-semibold">{mentor.role}</p>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {mentor.skills?.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Footer Area */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1.5">
                            {mentor.company && (
                              <img
                                src={getCompanyLogo(mentor.company, mentor.companyLogo)}
                                alt={mentor.company}
                                className="w-4 h-4 object-contain rounded-xs"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (mentor.company?.toLowerCase().includes("bizo")) {
                                    target.src = "/logos/bizonance.png";
                                  } else {
                                    target.style.display = "none";
                                  }
                                }}
                                onLoad={(e) => {
                                  if (!mentor.companyLogo && e.currentTarget.naturalWidth <= 16 && e.currentTarget.naturalHeight <= 16) {
                                    e.currentTarget.style.display = "none";
                                  }
                                }}
                              />
                            )}
                            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                              {mentor.company}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                            {mentor.category || mentor.area || "Industry Expert"}
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
      {/* 2. SUB-TOPIC: CAREERS & CURRENT OPENINGS                 */}
      {/* ======================================================== */}
      {activeSubTopic === "careers" && (
        <div className="bg-transparent p-2 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-normal">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Current Job Openings Management</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-amber-50 text-amber-700 border border-amber-100">
                      {openings.length} Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Configure faculty, trainer, and administrative vacancies displayed on the Careers page.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddJobOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Post New Opening
            </button>
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
                          <h3 className="text-base font-semibold text-gray-900 leading-snug">
                            {job.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-0.5">
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <Briefcase className="w-3.5 h-3.5 text-amber-500" /> {job.type}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" /> {formatExperience(job.experience)}
                          </span>
                        </div>

                        {job.specialities && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-slate-400">Skills:</span>
                            {job.specialities.split(",").map((s, idx) => (
                              <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => openEditJob(job)}
                          title="Edit Opening"
                          className="w-8 h-8 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-sm hover:shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          title="Remove Opening"
                          className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                        >
                          <Trash2 size={15} />
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
        <div className="bg-transparent p-2 space-y-5 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-normal">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">Our Alumni Profiles Management</h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-100">
                      {alumni.length} Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Showcase BITC graduates placed at leading global companies on the Alumni page.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAddAlumniOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Alumni
            </button>
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
                      className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Photo Area (Circular Avatar) */}
                      <div className="relative pt-4 pb-1 px-4 flex justify-center w-full">
                        {/* Action Buttons: Edit & Delete (Vertical) */}
                        <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <button
                            onClick={() => openEditAlumni(a)}
                            title="Edit Alumni"
                            className="w-7 h-7 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAlumni(a.id, a.name)}
                            title="Remove Alumni"
                            className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-sm shrink-0 flex items-center justify-center">
                          {a.photo && !alumniImgError[a.id] ? (
                            <img
                              src={resolveImageUrl(a.photo)}
                              alt={a.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                setAlumniImgError((prev) => ({ ...prev, [a.id]: true }));
                              }}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 font-bold flex items-center justify-center text-3xl">
                              {a.name ? a.name.charAt(0).toUpperCase() : "A"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-3 text-center flex flex-col flex-1 justify-between w-full">
                        <div>
                          <p className="text-xs font-bold leading-snug text-slate-900 line-clamp-1">{a.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">{a.role}</p>

                          {a.company && (
                            <div className="mt-1">
                              <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#2f55d4]">
                                {a.company}
                              </span>
                            </div>
                          )}

                          {a.certification && (
                            <div className="mt-2">
                              <span
                                className="inline-flex items-center gap-1 rounded-md bg-orange-50 border border-orange-200/80 px-2 py-0.5 text-[9.5px] font-medium text-orange-700 max-w-full"
                                title={`Course: ${a.certification}`}
                              >
                                <GraduationCap className="w-3 h-3 text-orange-600 shrink-0" />
                                <span className="truncate">Course: {a.certification}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-100 w-full text-[10px] px-0.5">
                          {a.batch && (
                            <span className="text-slate-500 font-medium">Batch: {(() => { const yr = a.batch.toString().replace(/^Batch\s*/i, "").split('-')[0].trim(); return yr.length === 2 ? '20' + yr : yr; })()}</span>
                          )}
                          {a.linkedin && (
                            <a
                              href={a.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0A66C2] hover:text-[#084e96] hover:scale-120 transition-all p-0.5 inline-flex items-center justify-center shrink-0"
                              title="LinkedIn Profile"
                              aria-label="LinkedIn Profile"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                              </svg>
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
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAlumniCompanies}
                  disabled={alumniCompaniesLoading}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${alumniCompaniesLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                <button
                  onClick={() => setIsAddAlumniCompanyOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50 whitespace-nowrap"
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
                        className="group relative flex flex-col items-center justify-center rounded-2xl border border-transparent hover:border-slate-200 bg-transparent hover:bg-white/90 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs min-h-[90px]"
                      >
                        {/* Action Buttons: Edit & Delete (Vertical) */}
                        <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-10">
                          <button
                            onClick={() => openEditAlumniCompany(comp)}
                            title="Edit Company"
                            className="w-7 h-7 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-sm hover:shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAlumniCompany(comp.id, comp.name)}
                            title="Remove Company"
                            className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="h-8 w-full flex items-center justify-center mb-1.5 px-2">
                          <img
                            src={resolveImageUrl(comp.logo)}
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
        <div className="bg-transparent p-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Handshake className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Industry Partners</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-100">
                  {industryPartners.length} Active
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
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${industryPartnersLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={() => setIsAddPartnerOpen(true)}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 hover:border-blue-300 rounded-full font-medium text-xs shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50 whitespace-nowrap"
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
                      {/* Action Buttons: Edit & Delete (Vertical) */}
                      <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all z-10">
                        <button
                          onClick={() => openEditIndustryPartner(partner)}
                          title="Edit Partner"
                          className="w-7 h-7 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 border border-slate-200 shadow-sm hover:shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteIndustryPartner(partner.id, partner.name)}
                          title="Remove Partner"
                          className="w-8 h-8 text-red-500 hover:text-white bg-white hover:bg-red-600 hover:border-red-600 rounded-full border border-slate-200 shadow-xs transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                        >
                          <Trash2 size={15} />
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
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsAddMentorOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Add New Mentor</h3>
                <p className="text-xs text-gray-400">Register an industry expert & trainer</p>
              </div>
            </div>

            <form onSubmit={handleAddMentor} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Left Column: Profile Picture & Company Logo */}
                <div className="sm:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Profile Picture <span className="text-red-500">*</span>
                    </label>
                    <ImageUpload
                      category="mentors"
                      value={mentorForm.img}
                      onChange={(url) => setMentorForm({ ...mentorForm, img: url })}
                      heightClassName="h-[190px]"
                    />
                  </div>

                  <CompanyLogoField
                    company={mentorForm.company}
                    value={mentorForm.companyLogo}
                    onChange={(url) => setMentorForm({ ...mentorForm, companyLogo: url })}
                    heightClassName="h-[110px]"
                    required={true}
                  />
                </div>

                {/* Right Column: Name, Role, Company, Category, Exp, Skills, LinkedIn */}
                <div className="sm:col-span-7 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Mentor Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={mentorForm.name}
                      onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Role / Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={mentorForm.role}
                        onChange={(e) => setMentorForm({ ...mentorForm, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Company / Organization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={mentorForm.company}
                        onChange={(e) => setMentorForm({ ...mentorForm, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Mentor Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={mentorForm.category || mentorForm.area || ""}
                          onChange={(e) => setMentorForm({ ...mentorForm, category: e.target.value, area: e.target.value })}
                          className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800 bg-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id || c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Experience <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={mentorForm.exp}
                        onChange={(e) => setMentorForm({ ...mentorForm, exp: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Skills (Comma Separated) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={mentorForm.skills}
                      onChange={(e) => setMentorForm({ ...mentorForm, skills: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      LinkedIn URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={mentorForm.linkedin}
                      onChange={(e) => setMentorForm({ ...mentorForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons on Bottom Right */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddMentorOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMentor}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsEditMentorOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Pencil className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Edit Mentor</h3>
                <p className="text-xs text-gray-400">Update mentor information & profile image</p>
              </div>
            </div>

            <form onSubmit={handleUpdateMentor} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Left Column: Profile Picture & Company Logo */}
                <div className="sm:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Profile Picture <span className="text-red-500">*</span>
                    </label>
                    <ImageUpload
                      category="mentors"
                      value={editMentorForm.img}
                      onChange={(url) => setEditMentorForm({ ...editMentorForm, img: url })}
                      heightClassName="h-[190px]"
                    />
                  </div>

                  <CompanyLogoField
                    company={editMentorForm.company}
                    value={editMentorForm.companyLogo}
                    onChange={(url) => setEditMentorForm({ ...editMentorForm, companyLogo: url })}
                    heightClassName="h-[110px]"
                    required={true}
                  />
                </div>

                {/* Right Column: Name, Role, Company, Category, Exp, Skills, LinkedIn */}
                <div className="sm:col-span-7 space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Mentor Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editMentorForm.name}
                      onChange={(e) => setEditMentorForm({ ...editMentorForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Role / Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editMentorForm.role}
                        onChange={(e) => setEditMentorForm({ ...editMentorForm, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Company / Organization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editMentorForm.company}
                        onChange={(e) => setEditMentorForm({ ...editMentorForm, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Mentor Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={editMentorForm.category || editMentorForm.area || ""}
                          onChange={(e) => setEditMentorForm({ ...editMentorForm, category: e.target.value, area: e.target.value })}
                          className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 bg-white appearance-none cursor-pointer"
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id || c.name} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Experience <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editMentorForm.exp}
                        onChange={(e) => setEditMentorForm({ ...editMentorForm, exp: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Skills (Comma Separated) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editMentorForm.skills}
                      onChange={(e) => setEditMentorForm({ ...editMentorForm, skills: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      LinkedIn URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editMentorForm.linkedin}
                      onChange={(e) => setEditMentorForm({ ...editMentorForm, linkedin: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons on Bottom Right */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditMentorOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingMentor}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Post New Job Opening</h3>
                <p className="text-xs text-gray-500">Create a career vacancy for the public portal</p>
              </div>
            </div>

            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Job Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-normal text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-normal bg-white text-gray-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Work Location
                  </label>
                  <select
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-normal bg-white text-gray-500"
                  >
                    <option value="On-Site">On-Site (Amravati)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Required Experience
                </label>
                <input
                  type="text"
                  value={jobForm.experience}
                  onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Specialization / Key Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={jobForm.specialities}
                  onChange={(e) => setJobForm({ ...jobForm, specialities: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-normal text-gray-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddJobOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Edit Job Opening</h3>
                <p className="text-xs text-gray-500">Update position details & requirements</p>
              </div>
            </div>

            <form onSubmit={handleUpdateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Job Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editJobForm.title}
                  onChange={(e) => setEditJobForm({ ...editJobForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={editJobForm.type}
                    onChange={(e) => setEditJobForm({ ...editJobForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal bg-white text-gray-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract / Visiting">Contract / Visiting</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Workplace Location
                  </label>
                  <select
                    value={editJobForm.location}
                    onChange={(e) => setEditJobForm({ ...editJobForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal bg-white text-gray-500"
                  >
                    <option value="On-Site">On-Site (Amravati)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Required Experience
                </label>
                <input
                  type="text"
                  value={editJobForm.experience}
                  onChange={(e) => setEditJobForm({ ...editJobForm, experience: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Specialization / Key Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editJobForm.specialities}
                  onChange={(e) => setEditJobForm({ ...editJobForm, specialities: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditJobOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingJob}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Add New Alumni Profile</h3>
                <p className="text-xs text-gray-500">Showcase placed BITC graduates</p>
              </div>
            </div>

            <form onSubmit={handleAddAlumni} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Alumni Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={alumniForm.name}
                  onChange={(e) => setAlumniForm({ ...alumniForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Job Role / Title
                  </label>
                  <input
                    type="text"
                    value={alumniForm.role}
                    onChange={(e) => setAlumniForm({ ...alumniForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Placed Company
                  </label>
                  <input
                    type="text"
                    value={alumniForm.company}
                    onChange={(e) => setAlumniForm({ ...alumniForm, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Batch Year
                  </label>
                  <input
                    type="text"
                    value={alumniForm.batch}
                    onChange={(e) => setAlumniForm({ ...alumniForm, batch: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Upload Photo
                </label>
                <ImageUpload category="alumni"
                  value={alumniForm.photo}
                  onChange={(url) => setAlumniForm({ ...alumniForm, photo: url })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Course / Certification
                  </label>
                  <input
                    type="text"
                    value={alumniForm.certification}
                    onChange={(e) => setAlumniForm({ ...alumniForm, certification: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={alumniForm.linkedin}
                    onChange={(e) => setAlumniForm({ ...alumniForm, linkedin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddAlumniOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAlumni}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Edit Alumni Profile</h3>
                <p className="text-xs text-gray-500">Update graduate profile details & photo</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAlumni} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Alumni Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editAlumniForm.name}
                  onChange={(e) => setEditAlumniForm({ ...editAlumniForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Job Role / Title
                  </label>
                  <input
                    type="text"
                    value={editAlumniForm.role}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Placed Company
                  </label>
                  <input
                    type="text"
                    value={editAlumniForm.company}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Batch Year
                  </label>
                  <input
                    type="text"
                    value={editAlumniForm.batch}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, batch: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Upload Photo
                </label>
                <ImageUpload category="alumni"
                  value={editAlumniForm.photo}
                  onChange={(url) => setEditAlumniForm({ ...editAlumniForm, photo: url })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    Course / Certification
                  </label>
                  <input
                    type="text"
                    value={editAlumniForm.certification}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, certification: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={editAlumniForm.linkedin}
                    onChange={(e) => setEditAlumniForm({ ...editAlumniForm, linkedin: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditAlumniOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAlumni}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Add Alumni Company Logo</h3>
                <p className="text-xs text-gray-500">Showcase top hiring companies</p>
              </div>
            </div>

            <form onSubmit={handleAddAlumniCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={alumniCompanyForm.name}
                  onChange={(e) => setAlumniCompanyForm({ ...alumniCompanyForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Upload Company Logo <span className="text-red-500">*</span>
                </label>
                <ImageUpload
                  category="alumni-companies"
                  value={alumniCompanyForm.logo}
                  onChange={(url) => setAlumniCompanyForm({ ...alumniCompanyForm, logo: url })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddAlumniCompanyOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAlumniCompany}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Edit Company Logo</h3>
                <p className="text-xs text-gray-500">Update hiring company details & logo</p>
              </div>
            </div>

            <form onSubmit={handleUpdateAlumniCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editAlumniCompanyForm.name}
                  onChange={(e) => setEditAlumniCompanyForm({ ...editAlumniCompanyForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Upload Company Logo <span className="text-red-500">*</span>
                </label>
                <ImageUpload
                  category="alumni-companies"
                  value={editAlumniCompanyForm.logo}
                  onChange={(url) => setEditAlumniCompanyForm({ ...editAlumniCompanyForm, logo: url })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditAlumniCompanyOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAlumniCompany}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Add Industry Partner</h3>
                <p className="text-xs text-gray-500">Register a company for hiring and collaboration</p>
              </div>
            </div>

            <form onSubmit={handleAddIndustryPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Industry / Domain Category
                </label>
                <input
                  type="text"
                  value={partnerForm.category}
                  onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="text"
                  value={partnerForm.website}
                  onChange={(e) => setPartnerForm({ ...partnerForm, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPartner}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
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
                <h3 className="text-lg font-medium text-gray-600">Edit Industry Partner</h3>
                <p className="text-xs text-gray-500">Update company title, category or link</p>
              </div>
            </div>

            <form onSubmit={handleUpdateIndustryPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editPartnerForm.name}
                  onChange={(e) => setEditPartnerForm({ ...editPartnerForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Industry / Domain Category
                </label>
                <input
                  type="text"
                  value={editPartnerForm.category}
                  onChange={(e) => setEditPartnerForm({ ...editPartnerForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <input
                  type="text"
                  value={editPartnerForm.website}
                  onChange={(e) => setEditPartnerForm({ ...editPartnerForm, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-normal text-gray-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditPartnerOpen(false)}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingPartner}
                  className="px-6 py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 rounded-full font-medium text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {updatingPartner ? "Saving..." : "Update Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Manage Mentor Categories Modal */}
      {isManageDomainsOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Manage Domain
              </h3>
              <button
                onClick={() => setIsManageDomainsOpen(false)}
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
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-700"
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
                          <SortableDomainItem
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
                onClick={() => setIsManageDomainsOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-full transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <DeleteConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={() => {
          if (confirmDialog.onConfirm) confirmDialog.onConfirm();
          setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null });
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: null })}
      />

    </div>
  );
};

export default About;

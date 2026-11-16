import React, { useState } from "react";
import { Plus, Trash2, Pencil, ListPlus, Check, X } from "lucide-react";

export function parseDescriptionToSections(desc) {
  if (!desc || typeof desc !== "string" || !desc.trim()) return [];
  const lines = desc.replace(/\r\n/g, "\n").split("\n");
  const sections = [];
  let currentHeading = "";
  let currentDescLines = [];

  const flush = () => {
    if (currentHeading || currentDescLines.length > 0) {
      const trimmedDesc = currentDescLines.join("\n").trim();
      if (currentHeading || trimmedDesc) {
        sections.push({
          id: "sec-" + Math.random().toString(36).slice(2, 9),
          heading: currentHeading || "Overview",
          description: trimmedDesc,
        });
      }
      currentHeading = "";
      currentDescLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      if (currentDescLines.length > 0) {
        currentDescLines.push("");
      }
      continue;
    }

    // Markdown header (# Heading, ## Heading, ### Heading, #### Heading)
    const md = line.match(/^#{1,6}\s+(.+)$/);
    if (md) {
      flush();
      currentHeading = md[1].trim();
      continue;
    }

    // Bold header: **Heading**
    const bold = line.match(/^\*\*([^*]+)\*\*$|^__([^_]+)__$/);
    if (bold) {
      flush();
      currentHeading = (bold[1] || bold[2]).trim();
      continue;
    }

    // Plain-text heading heuristic
    const isPunctuationEnding = /[.,;!?]$/.test(line);
    const wordCount = line.split(/\s+/).length;
    const isShort = line.length <= 80 && wordCount <= 12;

    if (isShort && !isPunctuationEnding) {
      const prevLine = i > 0 ? lines[i - 1].trim() : "";
      const isStartOrAfterBlank = i === 0 || !prevLine;
      const endsWithColon = line.endsWith(":");

      const nextLine = lines.slice(i + 1).find((l) => l.trim().length > 0)?.trim();
      const nextIsBody =
        nextLine &&
        (nextLine.length > 50 ||
          nextLine.split(/\s+/).length > 7 ||
          /[.,;!?]$/.test(nextLine) ||
          /^[-*•\d]/.test(nextLine));

      if ((isStartOrAfterBlank && (nextIsBody || !nextLine)) || endsWithColon) {
        flush();
        currentHeading = line.replace(/:$/, "").trim();
        continue;
      }
    }

    currentDescLines.push(rawLine);
  }

  flush();
  return sections;
}

export function formatSectionsToDescription(secs) {
  if (!Array.isArray(secs) || secs.length === 0) return "";
  return secs
    .map((s) => {
      const h = (s.heading || "").trim();
      const d = (s.description || "").trim();
      if (h && d) {
        const prefix = /^#{1,6}\s+/.test(h) ? "" : "### ";
        return `${prefix}${h}\n${d}`;
      }
      return h || d;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function EventSectionsList({ sections = [], onChange, entityName = "Event" }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingHeading, setEditingHeading] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

  const handleDelete = (idx) => {
    const updated = sections.filter((_, i) => i !== idx);
    onChange(updated);
    if (editingIndex === idx) setEditingIndex(null);
  };

  const handleStartEdit = (idx) => {
    setEditingIndex(idx);
    setEditingHeading(sections[idx].heading || "");
    setEditingDesc(sections[idx].description || "");
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...sections];
    updated[editingIndex] = {
      ...updated[editingIndex],
      heading: editingHeading.trim() || "Overview",
      description: editingDesc.trim(),
    };
    onChange(updated);
    setEditingIndex(null);
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="space-y-3 pt-2 text-left w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">
          Added {entityName} Sections ({sections.length})
        </span>
        <span className="text-[11px] text-slate-400">
          Numbered in display order
        </span>
      </div>

      {/* 2-column responsive grid: Section 1 on left, Section 2 on right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
        {sections.map((sec, idx) => (
          <div
            key={sec.id || idx}
            className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-2.5 transition-all hover:border-slate-300 hover:shadow-xs flex flex-col justify-between"
          >
            {editingIndex === idx ? (
              /* Inline Edit Mode */
              <div className="space-y-2.5 w-full">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Heading / Section Title
                  </label>
                  <input
                    type="text"
                    value={editingHeading}
                    onChange={(e) => setEditingHeading(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-normal text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Section Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingDesc}
                    onChange={(e) => setEditingDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-normal text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-y"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-200 font-medium text-xs rounded-full cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* Normal View Mode */
              <div className="flex flex-col justify-between h-full space-y-2">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-[11px] font-semibold flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-semibold text-slate-800 text-xs leading-snug line-clamp-1">
                        {sec.heading}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(idx)}
                        title="Edit Section"
                        className="w-7 h-7 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        title="Delete Section"
                        className="w-7 h-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 pl-8 whitespace-pre-wrap leading-relaxed line-clamp-4">
                    {sec.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventSectionsBuilder({
  sections = [],
  onChange,
  entityName = "Event",
  hideList = false,
  hideInput = false,
}) {
  const [newHeading, setNewHeading] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = () => {
    if (!newHeading.trim() || !newDesc.trim()) return;
    const newSec = {
      id: "sec-" + Date.now().toString(36),
      heading: newHeading.trim(),
      description: newDesc.trim(),
    };
    const updated = [...sections, newSec];
    onChange(updated);
    setNewHeading("");
    setNewDesc("");
  };

  const lowerEntity = entityName.toLowerCase();

  return (
    <div className="space-y-4 text-left w-full">
      {/* 1. Add New Section Card */}
      {!hideInput && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-normal shrink-0">
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-xs">
                Add New Section / Topic
              </h4>
              <p className="text-[11px] text-slate-400 font-normal">
                Append a heading &amp; description section to {lowerEntity}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Heading / Section Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newHeading}
                onChange={(e) => setNewHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-y"
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={!newHeading.trim() || !newDesc.trim()}
              className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-900 hover:text-blue-950 border border-blue-200 font-medium text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Section to List
            </button>
          </div>
        </div>
      )}

      {/* 2. Added Sections List (only when hideList is false) */}
      {!hideList && (
        <EventSectionsList
          sections={sections}
          onChange={onChange}
          entityName={entityName}
        />
      )}
    </div>
  );
}

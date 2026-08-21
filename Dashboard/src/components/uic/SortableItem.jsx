import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableItem({ id, children, className }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={`group ${className || ''}`}>
      <div 
        className="absolute top-2 left-2 z-20 cursor-grab active:cursor-grabbing p-1.5 bg-white rounded-md shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes} 
        {...listeners}
        title="Drag to reorder"
      >
        <GripVertical size={18} className="text-gray-600 hover:text-gray-900" />
      </div>
      {children}
    </div>
  );
}

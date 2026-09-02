const fs = require('fs');
const path = 'd:\\BiZONANCE INDIA PVT. LTD\\B.R Harne\\frontend\\src\\components\\layout\\Header.tsx';

let content = fs.readFileSync(path, 'utf8');

const replacementText = `        {/* Mobile Nav Drawer Overlay */}
        <div 
          className={\`xl:hidden fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 \${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}
          onClick={() => setMobileOpen(false)}
        />
        
        {/* Mobile Nav Drawer */}
        <div 
          className={\`xl:hidden fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[101] shadow-2xl overflow-y-auto transition-transform duration-300 transform \${mobileOpen ? 'translate-x-0' : '-translate-x-full'}\`}
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="B.R. Harne Logo"
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[#e8821a] font-bold text-[10px] uppercase leading-tight">Jai Shree Siddhivinayak</span>
                <span className="text-[#57B745] font-bold text-[11px] leading-tight">B. R. Harne Ayurvedic Medical College</span>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Drawer Links */}
          <div className="py-2">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                onClose={() => setMobileOpen(false)}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

const getIconForLabel = (label) => {
  switch (label.toLowerCase()) {
    case 'home': return <Home size={18} />;
    case 'about': return <Info size={18} />;
    case 'academics': return <BookOpen size={18} />;
    case 'departments': return <FlaskConical size={18} />;
    case 'results': return <Award size={18} />;
    case 'hospital': return <Stethoscope size={18} />;
    case 'ncism': return <FileBadge size={18} />;
    case 'muhs': return <FileText size={18} />;
    case 'courses': return <GraduationCap size={18} />;
    case 'faculty': return <Users size={18} />;
    case 'committee/councils': return <Users size={18} />;
    case 'admissions': return <FileText size={18} />;
    case 'student zone': return <Award size={18} />;
    case 'biometric attendance': return <Fingerprint size={18} />;
    case 'imp. links': return <Link2 size={18} />;
    case 'contact': return <Phone size={18} />;
    default: return <FolderOpen size={18} />;
  }
};

function MobileNavItem({ item, onClose, depth = 0 }) {
  const [open, setOpen] = useState(false);

  const paddingLeft = depth === 0 ? "px-6" : depth === 1 ? "pl-10 pr-6" : depth === 2 ? "pl-14 pr-6" : "pl-18 pr-6";
  const bgColor = depth === 0 ? "" : depth === 1 ? "bg-gray-50" : "bg-gray-100";
  const textColor = depth === 0 ? "text-gray-700" : "text-gray-600";
  const textSize = depth === 0 ? "text-[13px]" : "text-[11px]";

  const Icon = depth === 0 ? getIconForLabel(item.label) : null;

  if (!item.children) {
    return (
      <Link
        href={item.href || "#"}
        target={(item.href && (item.href.toLowerCase().endsWith('.pdf') || item.href.toLowerCase().endsWith('.jpg') || item.href.toLowerCase().endsWith('.jpeg') || item.href.toLowerCase().endsWith('.png') || item.href.toLowerCase().endsWith('.gif'))) ? "_blank" : undefined}
        rel={(item.href && (item.href.toLowerCase().endsWith('.pdf') || item.href.toLowerCase().endsWith('.jpg') || item.href.toLowerCase().endsWith('.jpeg') || item.href.toLowerCase().endsWith('.png') || item.href.toLowerCase().endsWith('.gif'))) ? "noopener noreferrer" : undefined}
        className={\`flex items-center gap-3 \${paddingLeft} py-3.5 \${textSize} font-medium \${textColor} \${bgColor} border-b border-gray-100 hover:bg-green-50 hover:text-[#57B745]\`}
        onClick={onClose}
      >
        {Icon && <span className="text-[#e8821a] opacity-80">{Icon}</span>}
        {item.label}
      </Link>
    );
  }

  return (
    <div className={bgColor}>
      <button
        onClick={() => setOpen(!open)}
        className={\`flex items-center justify-between w-full \${paddingLeft} py-3.5 \${textSize} font-medium \${textColor} border-b border-gray-100 hover:bg-gray-50\`}
      >
        <div className="flex items-center gap-3">
          {Icon && <span className="text-[#e8821a] opacity-80">{Icon}</span>}
          <span>{item.label}</span>
        </div>
        <ChevronDown
          size={16}
          className={\`transition-transform text-gray-400 \${open ? "rotate-180 text-[#57B745]" : ""}\`}
        />
      </button>
      {open && (
        <div className="border-b border-gray-100 bg-gray-50">
          {item.children.map((child, idx) => (
            <MobileNavItem
              key={\`\${child.label}-\${idx}\`}
              item={child}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
`;

const lines = content.split('\n');
const targetLineIndex = lines.findIndex(line => line.includes('{/* Mobile Nav Drawer */}'));

if (targetLineIndex !== -1) {
  const topPart = lines.slice(0, targetLineIndex).join('\n');
  content = topPart + '\n' + replacementText;
  
  // also replace imports
  const targetTopOld = 'import { Menu, X, ChevronDown } from "lucide-react";';
  const targetTopNew = 'import { Menu, X, ChevronDown, Home, Info, BookOpen, Stethoscope, FileText, Building2, Users, GraduationCap, Link2, Phone, Fingerprint, Award, Calendar, FolderOpen, FlaskConical, TestTube, FileBadge } from "lucide-react";';
  content = content.replace(targetTopOld, targetTopNew);
  
  fs.writeFileSync(path, content, 'utf8');
  console.log("Successfully replaced mobile drawer layout.");
} else {
  console.log("Could not find the target string.");
}

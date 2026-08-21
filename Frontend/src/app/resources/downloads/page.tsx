import type { Metadata } from "next";
import { Download, FileText, File } from "lucide-react";

export const metadata: Metadata = {
  title: "Resource Downloads",
  description: "Download BITC course brochures, placement reports, syllabus PDFs, and application forms.",
  openGraph: {
    title: "Resource Downloads | BIZONANCE Industrial Training Centre. (BITC) | Amravati",
    description: "Download course brochures and placement materials.",
  },
};

export default async function DownloadsPage() {
  let files: {name: string; type: string; size: string; url: string}[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/downloads`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.items) {
        files = data.items.map((item: any) => ({
          name: item.title,
          type: item.fileUrl?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'FILE',
          size: item.description || '',
          url: item.fileUrl
        }));
      }
    }
  } catch (error) {
    console.warn("Failed to fetch downloads from backend API.");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-white py-16 text-slate-900 text-center border-b border-gray-100">
        <div className="container max-w-[1200px] mx-auto px-4">
          <Download className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">Resource <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Downloads</span></h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Access our brochures, reports, and other important documents here.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-[800px] mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      {file.type === "PDF" ? <FileText className="w-6 h-6 text-blue-500" /> : <File className="w-6 h-6 text-blue-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{file.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{file.type} • {file.size}</p>
                    </div>
                  </div>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary transition-colors">
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

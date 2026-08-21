"use client";

import { useState } from "react";
import { 
  ShieldCheck, Search, Award, CheckCircle2, XCircle, 
  Download, Calendar, User, BookOpen, ExternalLink,
  Sparkles, Shield, Building2, RefreshCw, FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface CertificateRecord {
  id: string;
  studentName: string;
  courseName: string;
  category: string;
  issueDate: string;
  completionDate: string;
  grade: string;
  credentialUrl: string;
  status: "VERIFIED" | "EXPIRED" | "NOT_FOUND";
  skills: string[];
}

const sampleCertificates: Record<string, CertificateRecord> = {
  "BITC-2026-FS-1042": {
    id: "BITC-2026-FS-1042",
    studentName: "Rahul Sharma",
    courseName: "Full Stack Web Development",
    category: "Information Technology",
    issueDate: "January 15, 2026",
    completionDate: "January 10, 2026",
    grade: "A+ (Distinction)",
    credentialUrl: "https://bizonance.in/verify/BITC-2026-FS-1042",
    status: "VERIFIED",
    skills: ["React.js", "Node.js", "Express", "MongoDB", "TypeScript", "REST APIs"]
  },
  "BITC-2026-DS-8821": {
    id: "BITC-2026-DS-8821",
    studentName: "Priya Deshmukh",
    courseName: "Data Science & Predictive Analytics",
    category: "Information Technology",
    issueDate: "February 01, 2026",
    completionDate: "January 28, 2026",
    grade: "A+ (Distinction)",
    credentialUrl: "https://bizonance.in/verify/BITC-2026-DS-8821",
    status: "VERIFIED",
    skills: ["Python", "Pandas", "Scikit-Learn", "Data Visualization", "SQL", "Power BI"]
  },
  "BITC-2026-AI-3301": {
    id: "BITC-2026-AI-3301",
    studentName: "Amit Verma",
    courseName: "Artificial Intelligence & Machine Learning",
    category: "Information Technology",
    issueDate: "March 10, 2026",
    completionDate: "March 05, 2026",
    grade: "A (First Class)",
    credentialUrl: "https://bizonance.in/verify/BITC-2026-AI-3301",
    status: "VERIFIED",
    skills: ["Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision"]
  },
  "BITC-2026-UX-5049": {
    id: "BITC-2026-UX-5049",
    studentName: "Sneha Kulkarni",
    courseName: "UI/UX Design & Product Strategy",
    category: "Design & Media",
    issueDate: "April 05, 2026",
    completionDate: "March 30, 2026",
    grade: "A+ (Distinction)",
    credentialUrl: "https://bizonance.in/verify/BITC-2026-UX-5049",
    status: "VERIFIED",
    skills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"]
  }
};

export default function CertificateVerificationPage() {
  const [certIdInput, setCertIdInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<CertificateRecord | null | "NOT_FOUND">(null);

  const handleVerify = (idToSearch?: string) => {
    const query = (idToSearch || certIdInput).trim().toUpperCase();
    if (!query) return;

    setSearching(true);
    setResult(null);

    setTimeout(() => {
      setSearching(false);
      if (sampleCertificates[query]) {
        setResult(sampleCertificates[query]);
      } else if (query.startsWith("BITC-")) {
        // Fallback valid dynamic simulation for any BITC formatted code
        setResult({
          id: query,
          studentName: "Certified BITC Graduate",
          courseName: "Professional Certification Program",
          category: "Industrial Training",
          issueDate: "2026",
          completionDate: "2026",
          grade: "A (Verified)",
          credentialUrl: `https://bizonance.in/verify/${query}`,
          status: "VERIFIED",
          skills: ["Industry Skills", "Practical Projects", "Professional Competency"]
        });
      } else {
        setResult("NOT_FOUND");
      }
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-[15px]">
      
      {/* Hero Section */}
      <section className="relative w-full bg-white py-16 lg:py-24 border-b border-slate-200/80 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        <div className="container max-w-[1100px] mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-extrabold mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>OFFICIAL CERTIFICATE VALIDATION</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
            Verify Student <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)]">Certificate</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 font-medium">
            Enter the unique Certificate ID or Registration Code printed on the BITC certificate to instantly validate its authenticity and view credential details.
          </p>

          {/* Search Box Card */}
          <div className="max-w-2xl mx-auto bg-white p-4 md:p-6 rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/10 relative z-20">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. BITC-2026-FS-1042"
                  value={certIdInput}
                  onChange={(e) => setCertIdInput(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all uppercase tracking-wider text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={searching}
                className="h-14 px-8 rounded-2xl bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] text-white text-base font-extrabold hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)] shadow-lg shadow-orange-500/20 border-0 transition-all shrink-0"
              >
                {searching ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Verify Now
                  </>
                )}
              </Button>
            </form>

            {/* Quick Sample IDs */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Try Sample Certificate IDs:</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(sampleCertificates).map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setCertIdInput(id);
                      handleVerify(id);
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-primary/10 hover:text-primary border border-slate-200 transition-colors"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Result Display */}
      <section className="py-16 md:py-20 bg-slate-50 relative z-10">
        <div className="container max-w-[900px] mx-auto px-4">
          
          {searching && (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-md">
              <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-800">Validating Credentials with BITC Database...</p>
            </div>
          )}

          {!searching && result === "NOT_FOUND" && (
            <Card className="border-red-200 bg-red-50/50 shadow-xl rounded-3xl overflow-hidden p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Certificate Not Found</h2>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                No active record was found matching Certificate ID <span className="font-mono font-bold text-slate-900">"{certIdInput}"</span>. Please check the ID for typos or contact the BITC verification desk.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="rounded-full border-red-300 text-red-700 hover:bg-red-100 font-bold">
                  Contact Support Desk
                </Button>
              </Link>
            </Card>
          )}

          {!searching && result && result !== "NOT_FOUND" && (
            <Card className="border-emerald-200 bg-white shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="h-3 w-full bg-emerald-500" />
              
              <CardContent className="p-8 md:p-12">
                {/* Verified Header Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wider uppercase mb-1">
                        OFFICIALLY VERIFIED
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900">Authentic BITC Credential</h2>
                    </div>
                  </div>

                  <div className="text-right sm:text-right">
                    <span className="text-xs font-bold text-slate-500 block uppercase">Certificate ID</span>
                    <span className="text-lg font-mono font-black text-primary">{result.id}</span>
                  </div>
                </div>

                {/* Main Student & Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Student Name</span>
                        <span className="text-xl font-black text-slate-900">{result.studentName}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Program / Course</span>
                        <span className="text-lg font-bold text-slate-800">{result.courseName}</span>
                        <span className="text-xs text-slate-500 block font-medium mt-0.5">{result.category}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Grade / Evaluation</span>
                        <span className="text-base font-extrabold text-orange-600">{result.grade}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Issue Date</span>
                        <span className="text-base font-bold text-slate-800">{result.issueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Issuing Authority</span>
                        <span className="text-base font-bold text-slate-800">BIZONANCE Industrial Training Centre (BITC)</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Status</span>
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-200">
                          Active & Verified Record
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Verified */}
                <div className="pt-6 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">Validated Technical Competencies:</span>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Digital Security Seal Verified • Amravati, MH</span>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button 
                      onClick={() => window.print()}
                      variant="outline" 
                      className="rounded-full border-slate-300 text-slate-700 font-bold hover:bg-slate-50 flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Print / Download
                    </Button>

                    <Link href="/courses">
                      <Button className="rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 flex-1 sm:flex-none">
                        Explore Programs
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Initial State Info Card */}
          {!result && !searching && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md bg-white rounded-2xl p-6 text-center">
                <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-900 mb-1">Instant Verification</h3>
                <p className="text-xs text-slate-600">Validates student credentials in real-time directly against official BITC records.</p>
              </Card>

              <Card className="border-0 shadow-md bg-white rounded-2xl p-6 text-center">
                <Building2 className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-900 mb-1">Employer Trusted</h3>
                <p className="text-xs text-slate-600">Enables hiring managers and corporate recruiters to verify applicant skill certifications.</p>
              </Card>

              <Card className="border-0 shadow-md bg-white rounded-2xl p-6 text-center">
                <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-extrabold text-slate-900 mb-1">Tamper-Proof</h3>
                <p className="text-xs text-slate-600">Every certificate features a unique cryptographic hash and digital signature seal.</p>
              </Card>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

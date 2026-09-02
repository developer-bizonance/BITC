'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp } from 'react-icons/fa';

// Official multi-color Google "G" logo
const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

export function Footer() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const socials = [
    { icon: GoogleIcon, href: 'https://google.com/maps/search/BIZONANCE/@20.911,77.7443,17z?hl=en', label: 'Google', color: null, bg: '#f1f3f4' },
    { icon: FaFacebook, href: 'https://www.facebook.com/bizonance', label: 'Facebook', color: '#1877F2', bg: '#e7f0fd' },
    { icon: FaInstagram, href: 'https://www.instagram.com/bizonance/', label: 'Instagram', color: '#E1306C', bg: '#fce4ec' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/company/bizonance/', label: 'LinkedIn', color: '#0A66C2', bg: '#e3f0fb' },
    { icon: FaYoutube, href: 'https://www.youtube.com/@bizonance', label: 'YouTube', color: '#FF0000', bg: '#ffebee' },
  ];

  const impLinks = [
    { name: 'Scholarships', href: '/scholarships' },
    { name: 'Verify Certificate', href: '/certification/verify' },
    { name: 'Placements', href: '/placements' },
    { name: 'FAQs', href: '/resources/faqs' },
    { name: 'Downloads', href: '/resources/downloads' }
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Certifications', href: '/courses' },
    { name: 'Careers', href: '/about/careers' },
    { name: 'Contact', href: '/contact' }
  ];

  const programLinks = [
    { name: 'Information Tech', href: '/courses/it' },
    { name: 'Management', href: '/courses/management' },
    { name: 'Designing', href: '/courses/design' }
  ];

  return (
    <footer className="relative overflow-hidden bg-[#f4f5f7] text-[#1b1b1b] pt-6 sm:pt-10 pb-5">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Single Main Card: Brand + Links + CTAs + Legal Badge ── */}
        <div className="rounded-2xl sm:rounded-3xl border border-orange-200/90 bg-white p-5 sm:p-8 lg:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 items-stretch">

            {/* 1. Brand & Description & Socials (Col 1-4) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-3.5 sm:gap-4 h-full">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logos.png"
                    alt="BITC Logo"
                    width={180}
                    height={50}
                    className="h-10 sm:h-12 w-auto object-contain -ml-1"
                  />
                </div>
                <p className="text-[13px] leading-relaxed text-[#555] sm:text-sm font-medium pr-0 sm:pr-2">
                  Empowering Future Professionals with Industry-Ready Skills. We bridge academic learning and industry requirements with cutting-edge tech education.
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                {socials.map((item, i) => {
                  const Icon = item.icon;
                  const isGoogle = item.label === 'Google';
                  return (
                    <a
                      key={i}
                      href={item.href}
                      aria-label={item.label}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center transition-transform duration-300 hover:-translate-y-1 hover:scale-110 p-1"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {isGoogle ? (
                        <>
                          <span className="sm:hidden transition-all duration-300">
                            <GoogleIcon size={18} />
                          </span>
                          <span className="hidden sm:block transition-all duration-300">
                            <GoogleIcon size={22} />
                          </span>
                        </>
                      ) : (
                        <>
                          <Icon
                            size={18}
                            className="transition-colors duration-300 sm:hidden"
                            style={{ color: item.color! }}
                          />
                          <Icon
                            size={22}
                            className="hidden transition-colors duration-300 sm:block"
                            style={{ color: item.color! }}
                          />
                        </>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* 2. Links Grid: IMP LINKS, COMPANY & PROGRAMS (Col 5-9) */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6 pt-1">
              {/* Imp Links Column */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm sm:text-base capitalize tracking-wide">Links</h4>
                <ul className="space-y-2 text-[13px] sm:text-sm font-medium">
                  {impLinks.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="hover:text-primary transition-colors text-slate-600 hover:translate-x-0.5 inline-flex items-center">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Programs Column */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm sm:text-base capitalize tracking-wide">Programs</h4>
                <ul className="space-y-2 text-[13px] sm:text-sm font-medium">
                  {programLinks.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="hover:text-primary transition-colors text-slate-600 hover:translate-x-0.5 inline-flex items-center">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-sm sm:text-base capitalize tracking-wide">Company</h4>
                <ul className="space-y-2 text-[13px] sm:text-sm font-medium">
                  {companyLinks.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="hover:text-primary transition-colors text-slate-600 hover:translate-x-0.5 inline-flex items-center">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Action Buttons & Legal Badge (Col 10-12) */}
            <div className="lg:col-span-3 flex flex-col items-stretch lg:items-end justify-between gap-4 h-full">

              {/* Company Legal Badge */}
              <div className="w-full sm:w-auto lg:self-end rounded-2xl border border-orange-200 bg-orange-50 px-3.5 py-2.5 text-left sm:px-4 sm:py-3 sm:text-right shadow-2xs">
                <p className="text-[12px] sm:text-[13px] font-semibold text-[#111] whitespace-nowrap">BIZONANCE Industrial Training Centre</p>
                <p className="text-[10.5px] sm:text-[11px] font-medium text-orange-600 whitespace-nowrap">A Unit of BIZONANCE India Private Limited</p>
                <p className="mt-0.5 text-[10.5px] text-[#888] sm:text-[11px] whitespace-nowrap">CIN: U74999MH2017PTC301018</p>
                <p className="text-[10.5px] text-[#888] sm:text-[11px] whitespace-nowrap">Registered Trademark · IP India</p>
              </div>

              {/* Call Now & WhatsApp buttons (Always Horizontal) */}
              <div className="flex flex-row items-center gap-2 sm:gap-2.5 w-full lg:w-auto mt-auto">
                <a
                  href="tel:+918956727311"
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-blue-50 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold text-blue-600 border border-blue-100 hover:bg-blue-100 hover:shadow-md transition-all duration-200"
                >
                  <Phone size={14} />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/918956727311?text=Hello%2C%20I%20recently%20visited%20your%20official%20website%20and%20i%20want%20to%20know%20more%20about%20your%20services"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold text-emerald-600 border border-emerald-100 hover:bg-emerald-100 hover:shadow-md transition-all duration-200"
                >
                  <FaWhatsapp size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* ── Bottom Bar: Copyright & Legal Links ── */}
        <div className="mt-5 sm:mt-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 text-center sm:text-left font-medium">
          <p className="text-[12px] sm:text-[13px] text-slate-600 flex items-center justify-center sm:justify-start gap-1 flex-wrap">
            © 2026 <Image src="/BizonanceLogo.png" alt="BIZONANCE" width={110} height={28} className="h-4 sm:h-5 w-auto inline-block align-middle mx-1 object-contain" /> Industrial Training Centre. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-[12px] sm:text-[12.5px] text-slate-600">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

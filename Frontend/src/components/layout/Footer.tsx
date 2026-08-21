import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Send } from "lucide-react";

export function Footer() {
  const socialIcons = [
    { 
      name: "Google",
      href: "https://google.com/maps/search/BIZONANCE/@20.911,77.7443,17z?hl=en",
      hoverStyle: "hover:bg-slate-200 hover:text-slate-900 hover:border-slate-300 hover:shadow-md",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2zm.75 14.5a4.5 4.5 0 1 1 3.16-7.69l-1.42 1.42A2.5 2.5 0 1 0 12 14.5c1.38 0 2.25-.87 2.45-2h-2.45v-2h4.75a4.8 4.8 0 0 1 .1 1c0 2.87-1.92 5-4.6 5z"/>
        </svg>
      )
    },
    { 
      name: "YouTube",
      href: "https://youtube.com",
      hoverStyle: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] hover:shadow-[0_4px_14px_rgba(255,0,0,0.4)]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
        </svg>
      )
    },
    { 
      name: "Twitter",
      href: "https://twitter.com",
      hoverStyle: "hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] hover:shadow-[0_4px_14px_rgba(29,161,242,0.4)]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      )
    },
    { 
      name: "LinkedIn",
      href: "https://linkedin.com",
      hoverStyle: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:shadow-[0_4px_14px_rgba(10,102,194,0.4)]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect width="4" height="12" x="2" y="9"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      )
    },
    { 
      name: "Instagram",
      href: "https://instagram.com",
      hoverStyle: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:shadow-[0_4px_14px_rgba(220,39,67,0.4)]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      )
    },
    { 
      name: "Facebook",
      href: "https://facebook.com",
      hoverStyle: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_4px_14px_rgba(24,119,242,0.4)]",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      )
    }
  ];

  const SocialMediaIconsList = () => (
    <div className="flex flex-wrap items-center gap-2.5">
      {socialIcons.map((social, idx) => (
        <Link 
          key={idx} 
          href={social.href} 
          aria-label={social.name}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm transition-all duration-300 ${social.hoverStyle}`}
        >
          {social.icon}
        </Link>
      ))}
    </div>
  );

  const StayUpdatedSection = () => (
    <div>
      <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">Stay Updated</h4>
      <p className="text-xs mb-3 text-slate-600">Subscribe to our newsletter for the latest tech news, courses, and placement opportunities.</p>
      <div className="relative flex items-center w-full max-w-md">
        <input 
          type="email" 
          placeholder="Your email address" 
          className="w-full h-10 bg-white border border-slate-200 rounded-full pl-4 pr-12 text-xs text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-400 shadow-sm"
        />
        <button 
          type="button" 
          aria-label="Subscribe" 
          className="absolute right-1 top-1 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors shadow-[0_0_15px_rgba(255,153,0,0.3)] bg-[linear-gradient(to_right,#ffcc00_0%,#ff9900_100%)] hover:bg-[linear-gradient(to_right,#ff9900_0%,#ffcc00_100%)]"
        >
          <Send className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );

  return (
    <footer className="bg-slate-100 text-slate-600 py-6 md:py-8 mt-auto relative overflow-hidden border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-500/5 blur-[120px]"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6">
        
        {/* Brand Section */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <Image
                src="/logos.png"
                alt="BITC Logo"
                width={200}
                height={60}
                className="h-[38px] md:h-[45px] w-auto object-contain -ml-2"
              />
            </div>
            <p className="text-[13px] text-slate-600 leading-snug mb-3 font-medium pr-0 sm:pr-4">
              Empowering Future Professionals with Industry-Ready Skills. We bridge academic learning and industry requirements with cutting-edge tech education.
            </p>
          </div>

          {/* On Desktop: Show Social Icons here */}
          <div className="hidden lg:block">
            <SocialMediaIconsList />
          </div>

          {/* On Mobile: Show Stay Updated (Newsletter) here instead of Social Icons */}
          <div className="block lg:hidden">
            <StayUpdatedSection />
          </div>
        </div>

        {/* Links Grid: Side-by-side 2-column layout on Mobile */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-2">
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-1.5 text-[13px] font-medium">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Courses', href: '/courses' },
                { name: 'Careers', href: '/about/careers' },
                { name: 'Contact', href: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-primary transition-colors flex items-center group text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary mr-0 group-hover:mr-1.5 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">Programs</h4>
            <ul className="space-y-1.5 text-[13px] font-medium">
              {[
                { name: 'Information Tech', href: '/courses/it' },
                { name: 'Management', href: '/courses/management' },
                { name: 'Designing', href: '/courses/design' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="hover:text-primary transition-colors flex items-center group text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary mr-0 group-hover:mr-1.5 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter / Social Media & Contact */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          
          {/* On Desktop: Show Stay Updated here */}
          <div className="hidden lg:block mb-3">
            <StayUpdatedSection />
          </div>

          {/* On Mobile: Show Social Media Icons here instead of Stay Updated */}
          <div className="block lg:hidden mb-3">
            <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">Follow Us</h4>
            <SocialMediaIconsList />
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1.5 text-xs uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-1.5 text-[13px] font-medium">
              <li>
                <a href="mailto:info@bizonance.in" className="flex items-center hover:text-primary transition-colors group text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mr-2 group-hover:border-primary/40">
                    <Mail className="w-3 h-3 text-primary" />
                  </div>
                  info@bizonance.in
                </a>
              </li>
              <li>
                <a href="tel:+918956727311" className="flex items-center hover:text-primary transition-colors group text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mr-2 group-hover:border-primary/40">
                    <Phone className="w-3 h-3 text-primary" />
                  </div>
                  +91 89567 27311
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="container max-w-7xl mx-auto px-4 lg:px-8 mt-4 relative z-10">
        <div className="pt-3 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-medium text-slate-500 text-center md:text-left">
          <p>© {new Date().getFullYear()} <img src="/BizonanceLogo.png" alt="Bizonance Logo" className="h-4 sm:h-5 w-auto inline-block align-middle mx-1 object-contain" /> Industrial Training Centre. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

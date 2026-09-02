const fs = require('fs');
const path = 'd:\\BiZONANCE INDIA PVT. LTD\\B.R Harne\\frontend\\src\\components\\layout\\Header.tsx';

let content = fs.readFileSync(path, 'utf8');

const targetOld = `      {/* Top Banner Section */}
      <div className="bg-[#f8f9fa] py-4 w-full border-b border-gray-200 relative">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          {/* Mobile Menu Toggle (Only visible on small screens) */}
          <button
            className="xl:hidden p-2 text-gray-700 bg-gray-200 rounded-md absolute top-4 right-4 z-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Section: Logo + Divider + Text */}
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 md:ml-6 lg:ml-40 xl:ml-40 w-full md:w-auto text-center sm:text-left mt-8 md:mt-0">
              {/* Left Logo */}
              <Link href="/" className="shrink-0">
                <div className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="B.R. Harne Logo"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              </Link>

              {/* Vertical Orange Divider */}
              <div className="hidden sm:block w-1.5 h-32 md:h-40 bg-[#e8821a]"></div>

              {/* Text */}
              <div className="flex-1 flex flex-col justify-center px-2 sm:px-0 text-center sm:text-left">
                <p className="text-[12px] sm:text-sm md:text-base lg:text-xl text-[#e8821a] font-bold mb-1 tracking-wider uppercase leading-tight sm:leading-snug">
                  "Jai Shree Siddhivinayak Foundation"
                </p>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#57B745] font-[var(--font-playfair)] leading-tight mb-2">
                  B. R. Harne Ayurvedic Medical College Karav-Vangani
                </h1>
                <div className="flex flex-col items-center sm:items-start gap-1 text-[10px] sm:text-[11px] md:text-[13px] text-gray-800 font-medium">
                  <p className="leading-tight">Recognised by - Central Council of Indian Medicine & Ministry of AYUSH, Delhi</p>
                  <p className="leading-tight">Affiliated to - Maharashtra University of Health Science, Nashik</p>
                  <p className="leading-tight">Permitted By - Government of Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Right Logo (Foundation) */}
            <div className="shrink-0 hidden md:block md:mr-6 lg:mr-20 xl:mr-20">
              <div className="w-[160px] h-[160px] flex items-center justify-center">
                <Image
                  src="/images/new_logo2.jpg"
                  alt="Foundation Logo"
                  width={140}
                  height={140}
                  className="object-contain w-[140px] h-[140px] mix-blend-multiply scale-100"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Dark Grey) */}
      <nav className="bg-[#374151] w-full sticky top-0 z-50 shadow-md">
        <div className="max-w-[1600px] mx-auto px-1 lg:px-2">
          {/* Use flex-wrap on smaller screens, but heavily reduce padding so it fits on one line on desktop */}
          <div className="hidden xl:flex items-center justify-center w-full py-1.5">`;

const replaceNew = `      {/* Top Banner Section */}
      <div className="bg-[#f8f9fa] py-2 sm:py-4 w-full border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-2 lg:px-6">
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            {/* Left Section: Logo + Divider + Text */}
            <div className="flex flex-row items-center gap-1.5 sm:gap-4 md:gap-6 md:ml-6 lg:ml-20 xl:ml-32 w-full lg:w-auto text-left">
              {/* Left Logo */}
              <Link href="/" className="shrink-0">
                <div className="w-[60px] h-[60px] sm:w-[90px] sm:h-[90px] md:w-[140px] md:h-[140px] rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="B.R. Harne Logo"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              </Link>

              {/* Vertical Orange Divider */}
              <div className="w-0.5 sm:w-1 md:w-1.5 h-16 sm:h-20 md:h-32 bg-[#e8821a] shrink-0"></div>

              {/* Text */}
              <div className="flex-1 flex flex-col justify-center px-0.5 sm:px-2">
                <p className="text-[7px] sm:text-[10px] md:text-sm lg:text-lg text-[#e8821a] font-bold mb-0.5 sm:mb-1 tracking-wider uppercase leading-tight sm:leading-snug">
                  "Jai Shree Siddhivinayak Foundation"
                </p>
                <h1 className="text-[9.5px] sm:text-[14px] md:text-xl lg:text-2xl font-bold text-[#57B745] font-[var(--font-playfair)] leading-tight mb-0.5 sm:mb-1 md:mb-2">
                  B. R. Harne Ayurvedic Medical College Karav-Vangani
                </h1>
                <div className="flex flex-col items-start gap-0.5 text-[5.5px] sm:text-[8px] md:text-[11px] text-gray-800 font-medium">
                  <p className="leading-[1.1]">Recognised by - Central Council of Indian Medicine & Ministry of AYUSH, Delhi</p>
                  <p className="leading-[1.1]">Affiliated to - Maharashtra University of Health Science, Nashik</p>
                  <p className="leading-[1.1]">Permitted By - Government of Maharashtra</p>
                </div>
              </div>
            </div>

            {/* Right Logo (Foundation) */}
            <div className="shrink-0 hidden lg:block lg:mr-10 xl:mr-20">
              <div className="w-[120px] h-[120px] flex items-center justify-center">
                <Image
                  src="/images/new_logo2.jpg"
                  alt="Foundation Logo"
                  width={140}
                  height={140}
                  className="object-contain w-[140px] h-[140px] mix-blend-multiply scale-100"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Dark Grey) */}
      <nav className="bg-[#374151] w-full sticky top-0 z-50 shadow-md relative">
        <div className="max-w-[1600px] mx-auto px-2 lg:px-2 flex xl:block items-center justify-between xl:justify-center min-h-[44px]">
          {/* Mobile Menu Toggle (Only visible on small screens, inside nav) */}
          <button
            className="xl:hidden p-1.5 my-1.5 text-white bg-[#4b5563] hover:bg-[#57B745] rounded-md transition-colors z-50 relative ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Use flex-wrap on smaller screens, but heavily reduce padding so it fits on one line on desktop */}
          <div className="hidden xl:flex items-center justify-center w-full py-1.5">`;

if (content.includes(targetOld)) {
  content = content.replace(targetOld, replaceNew);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Successfully replaced layout.");
} else {
  console.log("Could not find the target string.");
}

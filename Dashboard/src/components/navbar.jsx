import React, { useState } from "react";

import bizologo from "../assets/bizonance_logo.png";
import { LogOut, Menu, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "./NotificationCenter.jsx";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="bg-[#f4f7f9] relative navbar flex items-center justify-between p-4 h-[80px]">
      <div className="flex items-center space-x-4">
        {/* Menu Icon to Toggle Sidebar */}
        <Menu
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          size={60}
          className={`hidden md:block rounded-full hover:bg-gray-200 h-10 w-10 p-2 cursor-pointer ${
            isSidebarOpen ? "bg-gray-100" : "bg-transparent"
          }`}
        />
        <div className="flex items-center">
          <img 
            src="/BITC.svg" 
            alt="BITC Logo" 
            className="h-[23px] sm:h-[26px] w-auto object-contain mr-2" 
          />
        </div>
      </div>

      {/* Right Header Section: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        <NotificationCenter />

        <div className="relative group inline-block">
          {/* Logo / Avatar */}
          <img
            src={bizologo}
            alt="Bizo Logo"
            className="h-10 w-10 cursor-pointer rounded-full border border-slate-200 hover:ring-2 hover:ring-blue-300 transition-all shadow-2xs"
          />

          {/* Profile Dropdown */}
          <div className="absolute right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50 transition-all">
            <ul className="py-2 text-gray-700">
              <li
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer text-slate-900 hover:bg-red-50 hover:text-red-600 font-medium transition-all active:scale-95"
              >
                <LogOut size={16} /> Logout
              </li>
            </ul>
          </div>
        </div>
      </div>



      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 w-full flex h-[6px]">
        <div className="w-1/3 bg-gradient-to-r from-yellow-300 to-orange-400"></div>
        <div className="w-1/3 bg-blue-800"></div>
        <div className="w-1/3 bg-red-600"></div>
      </div>
    </div>
  );
};

export default Navbar;

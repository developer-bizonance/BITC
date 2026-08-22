import React, { useState, useEffect } from "react";
// REMOVED: import Help from "./Helpcenter.jsx"; <--- This was the error
import logo from "../assets/logo.png";

import bizologo from "../assets/bizonance_logo.png";
import { LogOut, Menu, HelpCircle, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isServerOn, setIsServerOn] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/health`);
        if (res.ok) {
          setIsServerOn(true);
        } else {
          setIsServerOn(false);
        }
      } catch (error) {
        setIsServerOn(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    setShowConfirm(false);
    navigate("/");
  };

  return (
    <div className=" relative z-50 navbar flex items-center justify-between p-4 h-[80px]">
      <div className="flex items-center space-x-4">
        {/* Menu Icon to Toggle Sidebar */}
        <Menu
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          size={60}
          className={`hidden md:block rounded-full hover:bg-gray-200 h-10 w-10 p-2 cursor-pointer ${isSidebarOpen ? "bg-gray-100" : "bg-transparent"
            }`}
        />
        <div className="flex items-center">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="rounded text-xl font-bold text-gray-800">
                BITC
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Server Status */}
        <div title={isServerOn ? "Server is Online" : "Server is Offline"} className="flex items-center justify-center">
          <Wifi size={24} className={`transition-colors duration-300 ${isServerOn ? "text-green-500" : "text-red-500"}`} />
        </div>

        <div className="relative group inline-block">
          {/* Logo */}
          <img
            src={bizologo}
            alt="Bizo Logo"
            className="h-10 w-10 cursor-pointer rounded-full hover:ring-2 hover:ring-gray-300 relative z-10"
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all duration-200">
            <div className="w-44 bg-white rounded-lg shadow-lg border border-gray-200">
              <ul className="py-2 text-gray-700">
                <li
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md mx-1 my-1"
                >
                  <LogOut size={18} /> Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Border Accent Removed as requested */}
    </div>
  );
};

export default Navbar;
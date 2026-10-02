import React, { useState } from 'react';
import Navbar from './navbar.jsx';
import Menu from './Sidebar.jsx';

function MainApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
      <div className="overflow-hidden bg-[#f4f7f9] h-screen w-full flex flex-col">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 overflow-hidden">
          <Menu isOpen={isSidebarOpen} />
        </div>
      </div>
  );
}

export default MainApp;
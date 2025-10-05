import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, UsersIcon, Menu, X } from "lucide-react";
import { BrainCircuitIcon } from "lucide-react"; 


const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-base-300">
        <Link to="/dashboard" className="flex items-center gap-2.5">
    
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/dashboard"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/dashboard" ? "btn-active" : ""
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/dashboard"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>



<Link
  to="/learning"
  className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
    currentPath === "/learning" ? "btn-active" : "" // Also updated path for consistency
  }`}
  onClick={() => setMobileMenuOpen(false)}
>
  {/* 2. Replace UsersIcon with BrainCircuitIcon */}
  <BrainCircuitIcon className="size-5 text-base-content opacity-70" />
  <span>Learning</span>
</Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullname}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="lg:hidden p-4">
        <button onClick={() => setMobileMenuOpen(true)} className="btn btn-square btn-ghost">
          <Menu className="size-6" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          <div className="absolute top-0 left-0 h-full w-64 bg-base-200 flex flex-col transition-transform duration-300 ease-in-out">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 btn btn-ghost btn-square"
            >
              <X className="size-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { PlusIcon, PackageSearchIcon, ShoppingBagIcon, LogOutIcon, BarChart3Icon, ShieldIcon, Truck } from "lucide-react";
import Navbar from "../components/Navbar";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
     const user=localStorage.getItem('auth_user')
     const mainuser=JSON.parse(user)
     const isAdmin=mainuser?.isAdmin===true
   
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
    const AdminLinkData = [
        { to: "/admin", label: "Dashboard", icon: BarChart3Icon },
        { to: "/admin/products/new", label: "Add Product", icon: PlusIcon },
        { to: "/admin/products", label: "Products", icon: PackageSearchIcon },
        { to: "/admin/orders", label: "Orders", icon: ShoppingBagIcon },
        { to: "/admin/delivery-partners", label: "Delivery Partners", icon: Truck },
        { to: "/", label: "Exit", icon: LogOutIcon },
    ];
if(!isAdmin){
    return <Navigate to ="/" replace/>
}
    return (
        <div className="h-screen overflow-hidden flex flex-col">
      {/* Desktop Navbar */}
      <div className="max-lg:hidden">
        <Navbar />
      </div>

      {/* Mobile Topbar with Hamburger Icon */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB] shrink-0">
        <h2 className="text-base font-semibold text-app-green flex items-center gap-2">
          <ShieldIcon className="size-5 text-green-900" /> Admin Panel
        </h2>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 h-full overflow-hidden max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 gap-8 animate-fade-in relative">
        
        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          />
        )}

        {/* Admin Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`
            max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:bottom-0 max-lg:z-50 max-lg:w-64 max-lg:bg-white max-lg:p-4 max-lg:shadow-2xl max-lg:transition-transform max-lg:duration-300
            ${isMobileMenuOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}
            lg:w-64 shrink-0 h-fit bg-white rounded-2xl p-4 border border-[#E5E7EB] h-screen
          `}
        >
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-app-border">
            <h2 className="text-lg font-semibold text-app-green flex items-center gap-2 px-2">
              <ShieldIcon className="size-5 text-green-900" /> Admin Panel
            </h2>
            <button
              onClick={closeMobileMenu}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {AdminLinkData.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={true}
                onClick={() => {
                  window.scrollTo(0, 0);
                  closeMobileMenu(); // ক্লিক করলে মোবাইল মেনু নিজে থেকেই বন্ধ হবে
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-[#032E15] text-white"
                      : "text-app-text-light hover:bg-orange-50 hover:text-zinc-900"
                  }`
                }
              >
                <link.icon className="size-4" /> {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <Outlet />
        </main>
      </div>
    </div>
    );
}
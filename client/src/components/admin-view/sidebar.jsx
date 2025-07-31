import { ChartNoAxesCombined, Blocks, AlignEndHorizontal, PackageSearch, X } from "lucide-react";
import styles from "./admin-styles.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Sheet,SheetContent, SheetHeader, SheetTitle } from "../ui/sheet copy";

import { Button } from "../ui/button";

// Custom hook to detect mobile view
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the breakpoint we're using
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};


export const adminSidebarMenuItems = [
  {
      id : 'dashboard',
      label : "Dashboard",
      path : '/admin/dashboard',
      icon : <AlignEndHorizontal />
  },

  {
      id : 'products',
      label : "Products",
      path : '/admin/products',
      icon : <Blocks />
  },

  {
      id : 'orders',
      label : "Orders",
      path : '/admin/orders',
      icon : <PackageSearch />
  },
]

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={styles.navMenu}>
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
          navigate(menuItem.path);
          setOpen ? setOpen(false) : null;
        }}
          className={`${styles.menuItem} ${
            location.pathname === menuItem.path ? styles.active : ''
          }`}
        >
          <span className={styles.menuIcon}>{menuItem.icon}</span>
          <span className={styles.menuLabel}>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ isOpen, onOpenChange }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader} onClick={() => navigate("/admin/dashboard")}>
        <ChartNoAxesCombined className={styles.sidebarIcon} />
        <span className={styles.sidebarTitle}>BOOKVAULT</span> 
      </div>
      <MenuItems />
    </aside>
  );

  // Mobile Sidebar (Sheet)
  const MobileSidebar = () => (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0 flex flex-col" showCloseButton={false}>
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined className="h-6 w-6" />
              <SheetTitle>BOOKVAULT</SheetTitle>
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <MenuItems />
        </div>
        <div className="border-t p-4">
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
            className={styles.sidebarClose}
          >
            <X className="h-4 w-4 black" />
            Close Menu
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <Fragment>
      {isMobile ? <MobileSidebar /> : <DesktopSidebar />}
    </Fragment>
  );
}

export default AdminSideBar;

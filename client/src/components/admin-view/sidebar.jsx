import { ChartNoAxesCombined, Blocks, AlignEndHorizontal, PackageSearch } from "lucide-react";
import styles from "./admin-styles.module.css";
import { useNavigate, useLocation } from "react-router-dom";


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
          onClick={() => navigate(menuItem.path)}
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

function AdminSideBar({ isOpen }) {
const navigate=useNavigate();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader} onClick={() => navigate("/admin/dashboard")}>
        <ChartNoAxesCombined className={styles.sidebarIcon} />
        <span className={styles.sidebarTitle}>BOOKVAULT</span> 
      </div>
      
      <MenuItems/>
      {/* Add navigation links here */}
    </aside>
  );
}

export default AdminSideBar;

import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./header";
import AdminSideBar from "./sidebar"; // 
import styles from "./admin-styles.module.css";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <AdminSideBar isOpen={isSidebarOpen} />
      <div className={styles.mainContent}>
        <AdminHeader setOpen={setIsSidebarOpen} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

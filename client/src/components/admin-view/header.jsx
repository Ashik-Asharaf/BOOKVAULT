import { AlignJustify, LogOut, Plus } from "lucide-react";
import { Button } from "../ui/button";
import styles from "./admin-styles.module.css";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ isOpen, onToggle }) {
  const navigate = useNavigate();
//   const dispatch = useDispatch();

//   function handleLogout() {
//     dispatch(logoutUser());
//   }

  return (
    <header className={styles.header}>
      {!isOpen && (
        <Button 
          onClick={onToggle} 
          className={styles.toggleButton}
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <AlignJustify className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}
      <div className={styles.headerActions}>
        <Button 
          size="sm"
          className={styles.addButton}
          onClick={() => navigate("/admin/products/add")}
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Product</span>
        </Button>
        <Button 
          className={styles.logoutButton}
          // onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
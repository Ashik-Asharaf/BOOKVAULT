import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import styles from "./admin-styles.module.css";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
//   const dispatch = useDispatch();

//   function handleLogout() {
//     dispatch(logoutUser());
//   }

  return (
    <header className={styles.header}>
      <Button 
        onClick={() => setOpen(true)} 
        className={styles.toggleButton}
        variant="ghost"
        size="icon"
      >
        <AlignJustify className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className={styles.headerActions}>
        <Button 
          
          className={styles.logoutButton}
          // onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
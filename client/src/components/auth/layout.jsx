import { Outlet } from "react-router-dom";
import "./layout.css";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
  {/* Left Section - Layout content (e.g., logo, welcome) */}
  <div className="w-1/2 bg-black text-white flex items-center justify-center p-10">
    {/* Your static content */}
    <div className="text-center space-y-4 welcome-content">
      <h1 className="text-4xl font-bold text-center">Welcome to BOOKVAULT</h1>
      <p className="text-gray-300 text-lg">Shop books easily and quickly.</p>
    </div>
  </div>

  {/* Right Section - Auth Form via <Outlet /> */}
  <div className="w-1/2 bg-white flex items-center justify-center p-10">
    <Outlet />
  </div>
</div>

  );
}

export default AuthLayout;
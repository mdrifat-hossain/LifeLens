import { Outlet } from "react-router-dom";

export default function CareerDashboardLayout() {
  return (
    <div>
      {/* maybe a sidebar/navbar here */}
      <Outlet /> {/* renders nested route */}
    </div>
  );
}

import useRedirectLogin from "../hooks/useRedirectLogin";
import SidebarComponent from "./SidebarComponent";

function LayoutDashboardComponent({ children }) {
  useRedirectLogin()

  return (
    <div className="container-dashboard">
      <div className="container-dashboard__sidebar shadow d-none d-sm-block">
        <SidebarComponent />
      </div>

      <main className="container-dashboard__main">
        <div className="container-fluid p-4">{children}</div>
      </main>
    </div>
  );
}

export default LayoutDashboardComponent;

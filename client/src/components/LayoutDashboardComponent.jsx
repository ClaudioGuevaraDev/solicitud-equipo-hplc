import useLoadingPage from "../hooks/useLoadingPage";
import useRedirectLogin from "../hooks/useRedirectLogin";
import SidebarComponent from "./SidebarComponent";

function LayoutDashboardComponent({ children }) {
  useLoadingPage()
  useRedirectLogin();

  return (
    <div className="container-dashboard">
      <div className="container-dashboard__sidebar shadow-lg d-none d-sm-block">
        <SidebarComponent />
      </div>

      <main
        className="container-dashboard__main"
        style={{ backgroundColor: "#f3f4f6" }}
      >
        <div className="container-fluid p-4">{children}</div>
      </main>
    </div>
  );
}

export default LayoutDashboardComponent;

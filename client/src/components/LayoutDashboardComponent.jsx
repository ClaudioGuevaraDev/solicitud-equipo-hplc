import useLoadingPage from "../hooks/useLoadingPage";
import useRedirectLogin from "../hooks/useRedirectLogin";
import SidebarComponent from "./SidebarComponent";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";

function LayoutDashboardComponent({ children }) {
  useLoadingPage();
  useRedirectLogin();

  return (
    <div className="container-dashboard">
      <div
        className="container-dashboard__sidebar shadow-lg d-none d-sm-block"
        style={{ background: "#f9fafb" }}
      >
        <SidebarComponent />
      </div>

      <main
        className="container-dashboard__main"
        style={{ backgroundColor: "#f5f6f8" }}
      >
        <div className="container-fluid p-4">
          <div className="d-block d-md-none mb-3">
            <a
              data-bs-toggle="offcanvas"
              href="#sidebarCanvas"
              role="button"
              aria-controls="sidebarCanvas"
              style={{ cursor: "pointer", color: "#000" }}
            >
              <GiHamburgerMenu size={35} />
            </a>

            <div
              className="offcanvas offcanvas-start"
              tabIndex={-1}
              id="sidebarCanvas"
              aria-labelledby="sidebarCanvasLabel"
            >
              <div className="offcanvas-header d-flex justify-content-end">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <SidebarComponent />
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

export default LayoutDashboardComponent;

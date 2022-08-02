import SidebarComponent from "./SidebarComponent";

function LayoutDashboardComponent({ children }) {
  return (
    <div className="container-dashboard">
      <SidebarComponent />

      <main className="container-dashboard__main">
        <div className="container-fluid p-4">{children}</div>
      </main>
    </div>
  );
}

export default LayoutDashboardComponent;

import SidebarComponent from "../components/SidebarComponent";

function DashboardPage() {
  return (
    <div className="container-dashboard">
      <SidebarComponent/>

      <main className="container-dashboard__main">
        <div className="container-fluid p-4">
          <h1>Hello World</h1>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

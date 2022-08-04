import PropagateLoader from "react-spinners/PropagateLoader";

function LoadingPage() {
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div
      className="w-100"
      style={{
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PropagateLoader loading={true} color="#2780e3" cssOverride={override} size={20}/>
    </div>
  );
}

export default LoadingPage;

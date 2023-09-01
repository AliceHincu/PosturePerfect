import { Link } from "react-router-dom";

export const NoMatch = () => {
  return (
    <div style={{ backgroundColor: "white" }}>
      <div className="home-button-container-login">
        <Link to="/" className="home-button">
          {"< Home"}
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <img src="/assets/error-page.png" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }} alt="" />
      </div>
    </div>
  );
};

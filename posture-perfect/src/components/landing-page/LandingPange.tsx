import { useState, useEffect } from "react";
import "./LandingPage.css";
import { NavBar } from "./Navbar";

export const LandingPage = () => {
  const [imagesLoaded, setImagesLoaded] = useState(0);

  useEffect(() => {
    const imageList = ["/assets/home-banner-background2.png", "/assets/banner-image-1.png"]; // Add all your image sources to this array
    imageList.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => setImagesLoaded((prevCount) => prevCount + 1);
    });
  }, []);

  if (imagesLoaded < 2) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Loading...</div>
    ); // You can replace this with your own loading indicator if you want
  }

  return (
    <div className="container-page home-container">
      <NavBar></NavBar>
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src="/assets/home-banner-background2.png" alt="" />
        </div>
        <div className="home-text-section">
          <p className="primary-heading">Perfect Your Posture with Precision Analysis</p>
          <p className="primary-text">
            Our algorithms monitor your posture in real-time, providing instant feedback and guidance to ensure you
            maintain a healthy stance throughout your day.
          </p>
        </div>
        <div className="home-image-section">
          <img src="/assets/banner-image-1.png" alt="" />
        </div>
      </div>
    </div>
  );
};

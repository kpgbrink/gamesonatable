import React from "react";
import Navbar from "../Navbar";
import Footer from "./Footer";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <div className="page">
        <h1>Instructions</h1>
        <p>This is how you do it. Now go back to the home page.</p>
      </div>
      <Footer />
    </div>
  );
}

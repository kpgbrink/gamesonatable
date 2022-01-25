import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <div className="page">
        <h1>About Page</h1>
        <p>
          Hey this is made by Kristofer Brink. Check out my github. Here is my
          github <a href="https://github.com/kpgbrink">link.</a>
          <br />
          Check out facebook. It is a website I don't like that much. Here is
          the <a href="https://www.facebook.com">link.</a>
          <br />
          This page is pointless.
          <br />
          Sorry about this.
        </p>
      </div>
      <Footer />
    </div>
  );
}

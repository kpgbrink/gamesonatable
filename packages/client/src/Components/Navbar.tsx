import React from "react";
import "./Navbar.css";
import NavBarLink from "./Navbar/NavBarLink";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>Games on a Table</h1>
      <ul>
        <li>
          <NavBarLink to="/">Home</NavBarLink>
        </li>
        <li>
          <NavBarLink to="/instructions">Instructions</NavBarLink>
        </li>
        <li>
          <NavBarLink to="/about">About</NavBarLink>
        </li>
        <li>
          <NavBarLink to="/testchat">Test Chat</NavBarLink>
        </li>
      </ul>
    </nav>
  );
}

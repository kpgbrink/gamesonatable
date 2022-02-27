import { useContext } from "react";
import { AppContext } from "../AppContext";
import "./Navbar.css";
import NavBarLink from "./Navbar/NavBarLink";

export default function Navbar() {
  const { roomCreated } = useContext(AppContext);

  const homeLink = (() => {
    if (!roomCreated) {
      return "/";
    }
    return `/room/${roomCreated}`;
  })();

  return (
    <nav className="navbar">
      <h1>Games on a Table</h1>
      <ul>
        <li>
          <NavBarLink to={homeLink}>Home</NavBarLink>
        </li>
        <li>
          <NavBarLink to="/instructions">Instructions</NavBarLink>
        </li>
        <li>
          <NavBarLink to="/about">About</NavBarLink>
        </li>
      </ul>
    </nav>
  );
}

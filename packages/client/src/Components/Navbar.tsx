import { isDev } from "../tools/basicTools";
import "./Navbar.css";
import NavBarLink from "./Navbar/NavBarLink";

// Gemerate random6 digit number
const generateRandomRoomId = () => {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString();
};

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>Games on a Table</h1>
      <ul>
        <li>
          <NavBarLink to="/">Home</NavBarLink>
        </li>
        {isDev() && (
          <li>
            <NavBarLink to={`/fixedRoomId/${generateRandomRoomId()}`}>
              Fixed Room
            </NavBarLink>
          </li>
        )}
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

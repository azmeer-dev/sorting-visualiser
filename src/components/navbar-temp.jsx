import { Link } from "react-router";

export default function Navbar() {
  return (
    <>
      <div>
        <nav className="navbar">
          <Link to="/" >Home</Link>
          <Link to="/visualiser" >Visualiser</Link>
          <Link to="/algorithms" >Algorithm Info</Link>
          <Link to="/about" >About</Link>
        </nav>
      </div>
    </>
  );
}

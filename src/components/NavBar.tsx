import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-surface">
          <NavLink to="/"      className={({isActive}) => "nav-btn" + (isActive ? " active" : "")}>HOME</NavLink>
          <NavLink to="/wiki"  className={({isActive}) => "nav-btn" + (isActive ? " active" : "")}>WIKI</NavLink>
          <NavLink to="/trivia"className={({isActive}) => "nav-btn" + (isActive ? " active" : "")}>TRIVIA</NavLink>
        </div>
      </div>
    </nav>
  );
}

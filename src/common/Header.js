import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to={`/`} className="navbar-brand">Arithmetic Calculator</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to={`/request-operation`} className="nav-link">Request Operation</Link>
            </li>
            <li className="nav-item">
              <Link to={`/records`} className="nav-link">Records</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

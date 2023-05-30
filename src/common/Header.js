import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export default function Header({ setPageMessage, loggedIn, setLoggedIn }) {
  const navigate = useNavigate();

  function handleLogOut() {
    console.log('Logging out...');
    axios.delete('log-out')
      .then(function (response){
        console.log('Logged out');

        Cookies.remove('user');
        navigate('/');

        setPageMessage({ message: 'Logged out', type: 'success' })
        setLoggedIn(false);
      })
      .catch(function (error){
        console.log(error.message);
        setPageMessage({ message: error.message, type: 'failure' })
      });
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to={`/`} className="navbar-brand">Arithmetic Calculator</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {loggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink to={`/perform-operation`}
                      className={ ({ isActive, isPending }) => isActive ? 'nav-link active' : 'nav-link' }>Perform Operation</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to={`/records`}
                      className={ ({ isActive, isPending }) => isActive ? 'nav-link active' : 'nav-link' }>Records</NavLink>
                </li>
              </>
            ) : null}
          </ul>
          {loggedIn ? (
            <>
              <span className="navbar-text ms-auto me-3">{JSON.parse(Cookies.get('user')).name}</span>
              <button className="btn btn-secondary" onClick={handleLogOut}>Log out</button>
            </>
          ) : null }
        </div>
      </div>
    </nav>
  );
};

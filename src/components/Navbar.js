import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  }
  let location = useLocation();
  return (
    <nav className='navbar sticky-top navbar-expand-lg navbar-light bg-light'>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ProjectBuddy</Link>
        <button class="navbar-toggler" type="button btn-sm" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/Projects" ? "active" : ""} `} aria-current="page" to="/Projects">Explore Projects</Link>
            </li>
            {localStorage.getItem('token') ?
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/MyProjects" ? "active" : ""} `} to="/MyProjects">My Projects</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/JoinedProjects" ? "active" : ""} `} to="/JoinedProjects">Discussion Room</Link>
                </li>
              </> :
              null
            }
          </ul>
          {!localStorage.getItem('token') ?
            <div className="d-flex">
              <Link className="btn btn-success btn-sm mx-2 d-flex" to="/Login" role="button">Login</Link>
              <Link className="btn btn-primary btn-sm mx-2" to="/Signup" role="button">SignUp</Link>
            </div> :
            <>
              <Link className="btn btn-outline-primary btn-sm mx-2" to="/Userprofile" role="button">My Profile</Link>
              <button onClick={handleLogout} className='btn btn-danger btn-sm '>Logout</button>
            </>}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
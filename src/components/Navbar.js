import React, {useState, useEffect} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'


const Navbar = () => {
  const [isNavbarSticky, setNavbarSticky] = useState(false);


  const navigate = useNavigate();

  const handleScroll = () => {
    const scrollHeightThreshold = 0;
    if (window.scrollY > scrollHeightThreshold) {
      setNavbarSticky(true);
    } else {
      setNavbarSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  }
  let location = useLocation();
  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-light ${isNavbarSticky ? 'sticky' : ''}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ProjectBuddy</Link>
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
import React, {useContext} from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home'
import Navbar from './components/Navbar';
import AddProject from './components/AddProject';
import UserProfile from './components/UserProfile'
import ProjectState from './context/projects/ProjectState'
import MyProjects from './components/MyProjects';
import Login from './components/Login';
import Signup from './components/Signup';
import Projects from './components/Projects';
import UserState from './context/User/UserState';
import EditProject from './components/EditProject';
import DiscussionRoom from './components/DiscussionRoom';
import JoinedProjects from './components/JoinedProjects';
import ProfileDetails from './components/ProfileDetails';
import {LoadingBarContext, LoadingBarState} from './context/LoadingBar/LoadingBarState'
import LoadingBar from 'react-top-loading-bar';

function App() {

  return (
    <>
      <LoadingBarState>
        <ProjectState>
          <UserState>
            <Router>
              <Navbar />
              <LoadingBar color="#f11946" progress={useContext(LoadingBarContext).progress} />
              <div className='container'>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Projects" element={<Projects />} />
                  {(localStorage.getItem('token')) ?
                    <><Route path="/Addproject/*" element={<AddProject  />} />
                      <Route path="/MyProjects/*" element={<MyProjects />} />
                      <Route path='/Userprofile/*' element={<UserProfile />} />
                      <Route path='/Editproject/:id' element={<EditProject />} />
                      <Route path='/DiscussionRoom/*' element={<DiscussionRoom />} />
                      <Route path='/JoinedProjects/*' element={<JoinedProjects />} />
                      <Route path='/profileDetails/:id' element={<ProfileDetails />} />
                    </> :
                    <><Route path="/Addproject/*" element={<Home />} />
                      <Route path="/MyProjects/*" element={<Home />} />
                      <Route path='/Userprofile/*' element={<Home />} />
                      <Route path="/Login/*" element={<Login />} />
                      <Route path='/Signup/*' element={<Signup />} />
                    </>
                  }
                </Routes>
              </div>
            </Router>
          </UserState>
        </ProjectState>
      </LoadingBarState>
    </>
  );
}

export default App;

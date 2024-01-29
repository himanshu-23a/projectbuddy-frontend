import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import ProjectContext from '../context/projects/ProjectContext';
import ProjectItem from './ProjectItem';
import UserContext from '../context/User/UserContext'
import './MyProjects.css'
import './header.css'
import './Home.css'
import home_img from '../image/home.png'

const Projects = (props) => {

    const projectContext = useContext(ProjectContext);
    const userContext = useContext(UserContext);
    const { user, getMyProfile } = userContext;
    const { projects, getMyProjects } = projectContext;

    useEffect(() => {
        getMyProfile();
        getMyProjects();
        //eslint-disable-next-line
    }, [])
    return (
        <>
            <h5 className='header'>My Projects</h5>
            <div>
                {user && projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectItem key={project._id} project={project} userId={user._id} />
                    ))
                ) : (
                    <div className="container p-3">
                        <div className="row">
                            <div className="col-lg-6" data-aos="zoom-in">
                                <img src={home_img} className="img-fluid animated" alt="Home" />
                            </div>
                            <div className="col-lg-6 d-flex flex-column justify-content-center" data-aos="fade-up">
                                <h2 className='p-3'>Add New Project!</h2>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Link className="add-button" data-bs-toggle="tooltip" data-bs-placement="left" to="/Addproject">Add Project</Link>

        </>
    )
}

export default Projects
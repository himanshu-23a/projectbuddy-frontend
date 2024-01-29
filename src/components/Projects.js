//All Projects
import React, { useContext, useEffect } from 'react'
import ProjectContext from '../context/projects/ProjectContext';
import ProjectItem from './ProjectItem';
import UserContext from '../context/User/UserContext'
import './header.css'
import './Home.css'
import home_img from '../image/home.png'


const Projects = () => {
    const context = useContext(ProjectContext);
    const { projects, getProjects } = context;
    const userContext = useContext(UserContext);
    const { user, getMyProfile } = userContext;

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getMyProfile();
        }
        getProjects();
        //eslint-disable-next-line
    }, [])

    return (
        <>
            <h5 className='header'>Explore Projects</h5>
            <div>
                {projects && projects.length > 0 ? (
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
                                <h2 className='p-3'>No Projects Available!</h2>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Projects
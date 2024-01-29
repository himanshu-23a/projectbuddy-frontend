import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/User/UserContext'
import ProjectContext from '../context/projects/ProjectContext';
import DiscussionRoom from './DiscussionRoom';
import './JoinedProjects.css';
import './DiscussionRoom.css';
import error_discussion from '../image/404-error.png'

const JoinedProjects = () => {
    const userContext = useContext(UserContext);
    const projectContext = useContext(ProjectContext);
    const { user, getMyProfile } = userContext;
    const { projects, getMyProjects, getProjectByid } = projectContext;
    const [projectDetailsMap, setProjectDetailsMap] = useState({});
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        getMyProfile();
        getMyProjects();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                if (user.joinedProjects && user.joinedProjects.length > 0) {
                    const detailsMap = {};
                    for (const project of user.joinedProjects) {
                        const projectDetails = await getProjectByid(project.projectId);
                        detailsMap[project.projectId] = projectDetails;
                    }
                    setProjectDetailsMap(detailsMap);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchProjectDetails();
    }, [user.joinedProjects]);


    const handleProjectClick = (projectId) => {
        setSelectedProject(projectId);
    };


    return (
        <>
            <div className='row d-flex main-row'>
                <div className='col-3 card project-list-col p-3'>
                    <div className='project-list-header my-2 '>My Projects</div>
                    <ul className="list-group">
                        {projects && projects.length > 0 ? (
                            projects.map(project => (
                                <li className='list-group-item project-list-item d-flex justify-content-start' key={project._id} onClick={() => handleProjectClick(project._id)}>
                                    {project.title}
                                </li>
                            ))
                        ) : (
                            <li className='list-group-item project-list-item d-flex justify-content-start'>No Projects Available</li>
                        )}
                    </ul>
                    <div className='project-list-header my-2'>Joined Projects</div>
                    <ul className="list-group">
                        {user.joinedProjects &&user.joinedProjects.length > 0 ? (
                            user.joinedProjects
                            .filter(project => project.status === 'accepted')
                            .map(project => (
                                <li className='list-group-item project-list-item d-flex justify-content-start' key={project.projectId} onClick={() => handleProjectClick(project.projectId)}>
                                    <div>{projectDetailsMap[project.projectId]?.title}</div>
                                </li>
                            ))
                        ) : (
                            <li className='list-group-item project-list-item d-flex justify-content-start'>No joined projects</li>
                        )}
                    </ul>
                </div>
                <div className='col-9 discussion-col'>
                    {selectedProject !== null ? (
                        <DiscussionRoom key={selectedProject} projectId={selectedProject} />
                    ) : (
                        <div className='card discussion-card' style={{justifyContent: 'center' }}>
                            <div className='start-discussion'><img className="error-img" src= {error_discussion} alt='error'/></div>
                            <div className='start-discussion p-3'>Select Project to view Discussions</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default JoinedProjects;
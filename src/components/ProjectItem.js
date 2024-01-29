import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserContext from '../context/User/UserContext'
import './ProjectItem.css'
import ProjectContext from '../context/projects/ProjectContext'
import profile from '../image/profile.jpg'

const ProjectItem = React.memo(({project, userId}) => {
    const navigate = useNavigate();
    const projectContext = useContext(ProjectContext);
    const { deleteProject, respondToJoinRequest } = projectContext;
    const userContext = useContext(UserContext);
    const { user, getUserByid, sendJoinRequest } = userContext;
    const [userInfo, setUserInfo] = useState([]);

    const [userDetailsMap, setUserDetailsMap] = useState({});

    useEffect(() => {
        const fetchUserInfo = async () => {
            console.log("Initial run")
            try {
                const info = await getUserByid(project.user);
                setUserInfo(info);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
        //eslint-disable-next-line
    }, [])


    useEffect(() => {
        console.log("request and team member run  run")
        const fetchUserDetails = async () => {
            try {
                const detailsMap = {};

                if (project.requests) {
                    for (const request of project.requests) {
                        const userDetails = await getUserByid(request.userId);
                        detailsMap[request.userId] = userDetails;
                    }
                }

                if (project.team_members) {
                    for (const team_mem of project.team_members) {
                        const userDetails = await getUserByid(team_mem);
                        detailsMap[team_mem] = userDetails;
                    }
                }
                setUserDetailsMap(detailsMap);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, [project.requests, project.team_members, getUserByid]);

    //const isTeamMember = project.team_members?.includes(userId);
    var joinRequest = {};
    var hasJoinRequest = false;
    if (userId && userId !== project.user) {
        hasJoinRequest = user.joinedProjects.some((joinedProject) => joinedProject.projectId === project._id);
        if (hasJoinRequest) {
            joinRequest = user.joinedProjects.find((joinedProject) => joinedProject.projectId === project._id);
        }
    }
    return (
        <>
            <div className={`card border my-4`}>
                <div className="card-body row">
                    <div className="card-content col bg-left-col">
                        <h5 className="card-title">{project.title}</h5>
                        <p className="card-text">{project.description}</p>
                        <h4 className="badge bg-danger">{project.category}</h4>
                        <p>
                            Skills:
                            {project.skills_required && project.skills_required.map(skills => (
                                <span className="badge bg-primary mx-1" key={skills}>{skills}</span>
                            ))}
                        </p>
                        <button className='btn btn-repo' onClick={() => window.location.href = project.repository_link}>Repository</button>
                        <div className='my-2 profile-highlight' onClick={() => { (localStorage.getItem('token')) ? navigate(`/profileDetails/${userInfo._id}`) : navigate(``) }}>
                            <img src={profile} className="profile-item" alt='profile' />
                            <span className="card-title my-2 mx-2 ">{userInfo.name}</span>
                        </div>
                    </div>
                    <div className="container card-content col">
                        <p className="card-text">
                            <span>
                                {project.open_closed==="Open to Work" ?
                                    <span className="badge bg-success">Open to Work</span>
                                    :
                                    <span className="badge bg-danger">Closed</span>
                                }
                            </span>
                            <span className='mx-2'>
                                {project.status==="In Progress" ?
                                    <span className="badge bg-primary">In Progress</span>
                                    :
                                    <span className="badge bg-success">Completed</span>
                                }
                            </span>
                        </p>
                        <p className='card-text row'>
                            <div className='col mx-3'>
                                <h2 className='row'>
                                    {project.members_no}
                                </h2>
                                <div className='row'>
                                    Team Size
                                </div>
                            </div>
                            <div className='col'>
                                <h2 className='row'>
                                    {project.weeks}
                                </h2>
                                <div className='row'>
                                    Weeks to Finish
                                </div>
                            </div>
                        </p>
                        {userId === project.user && (
                            <>
                                <p className='card-text'>Requests:</p>
                                <ul className="list-group">
                                    {project.requests.map(request => (
                                        <li className="list-group-item d-flex justify-content-between align-items-center" key={request.userId}>
                                            <div className='profile-highlight' onClick={() => navigate(`/profileDetails/${request.userId}`)}>
                                                <img src={profile} className="profile-item" alt='profile' />
                                                <span className="card-title mx-2">{userDetailsMap[request.userId]?.name}</span>
                                            </div>
                                            <span className='ml-auto'>
                                                <button type="button" className="btn btn-success mx-2" onClick={() => { respondToJoinRequest(project._id, request.userId, `accepted`) }}>Accept</button>
                                                <button type="button" className="btn btn-danger " onClick={() => { respondToJoinRequest(project._id, request.userId, `rejected`) }}>Reject</button>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <p className='card-text my-2'>Team Members:</p>
                                <ul className="list-group my-2">
                                    {project.team_members.map(team_member => (
                                        <li className="list-group-item d-flex align-items-center profile-highlight" key={team_member} onClick={() => navigate(`/profileDetails/${team_member}`)}>
                                            <img src={profile} className="profile-item" alt='profile' />
                                            <span className="card-title my-2 mx-2">{userDetailsMap[team_member]?.name}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className='my-2'>
                                    <button type="button" className="btn btn-primary" onClick={() => navigate(`/Editproject/${project._id}`)}>Edit</button>
                                    <button type="button" className="btn btn-danger mx-2" onClick={() => { deleteProject(project._id) }}>Delete</button>
                                </div>
                            </>
                        )}

                        {userId !== project.user && joinRequest.status === 'pending' && (
                            <button type="button" className="btn btn-primary" disabled>Request Sent</button>
                        )}
                        {userId !== project.user && joinRequest.status === 'accepted' && (
                            <button type="button" className="btn btn-primary" disabled>Joined</button>
                        )}
                        {userId !== project.user && !hasJoinRequest && (
                            <button type="button" className="btn btn-primary " onClick={() => { sendJoinRequest(project._id) }}>Join Request</button>
                        )}
                    </div>
                    <div className="row">
                    </div>
                </div>
            </div >
        </>
    )
});

export default ProjectItem
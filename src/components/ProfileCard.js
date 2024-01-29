import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/User/UserContext'
import ProjectContext from '../context/projects/ProjectContext'
import './profile_image.css'
import './ProfileCard.css'
import './header.css'
import profile from '../image/profile.jpg'

const ProfileCard = (props) => {
    const projectContext = useContext(ProjectContext);
    const { getProjectByid } = projectContext;
    const { user, isMyProfile } = props;
    const context = useContext(UserContext);
    const { deleteUser, updateUser } = context;
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate();

    const [projectDetailsMap, setProjectDetailsMap] = useState({});

    const handleDelete = async () => {
        const isConfirmed = window.confirm("Delete your Profile? It will not be recovered again!!");
        if (isConfirmed) {
            await deleteUser();
            localStorage.removeItem('token');
            navigate('/');
            window.location.reload();
        }
    }

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
    }, [user.joinedProjects, getProjectByid]);

    const onChange = (event) => {
        setUserInfo({ ...userInfo, [event.target.name]: event.target.value })
    }
    const updateValue = () => {
        setUserInfo({ name: user.name, bio: user.bio, skills: user.skills, institute: user.institute, role: user.role })
    }
    const handleClick = () => {
        if (userInfo.name.length <= 0 || userInfo.name.length > 30) {
            alert("Name must be between 1 and 100 characters");
        }
        else if (userInfo.bio.length > 300) {
            alert("Bio is exceeding the word limit");
        }
        else if(userInfo.institute.length > 70) {
            alert("Institute is exceeding the word limit");
        }
        else {
            updateUser(userInfo.name, userInfo.bio, userInfo.skills, userInfo.institute, userInfo.profile_picture, userInfo.role)
        }
    }

    const handleSkillChange = (event, index) => {
        const updatedSkills = [...userInfo.skills];
        updatedSkills[index] = event.target.value;
        setUserInfo({ ...userInfo, skills: updatedSkills });
    };

    const handleSkillRemove = (index) => {
        const updatedSkills = userInfo.skills.filter((_, i) => i !== index);
        setUserInfo({ ...userInfo, skills: updatedSkills });
    };

    const handleAddSkill = () => {
        setUserInfo({ ...userInfo, skills: [...userInfo.skills, ""] });
    };



    return (
        <>
            <div className='card card-profile my-4'>
                <div className='card-body row'>
                    <div className='col'>
                        <img src={profile} className="profile" alt='profile' />
                        <span className='card-title mx-3 username' >{user.username}</span>
                        <span className='badge bg-primary'>{user.role}</span>
                        <div className='card-text name my-2' >{user.name}</div>
                        <div className='card-text text-white my-2'>{user.bio}</div>
                        <div className='badge bg-success' >{user.institute}</div>
                        <p className='card-text text-white my-2'>
                            Skills:
                            {user.skills && user.skills.map(skill => (
                                <span className="badge bg-primary mx-1" key={skill}>{skill}</span>
                            ))}
                        </p>
                    </div>
                    <div className='col text-white'>
                        <p className='badge email-text'>{user.email}</p>
                        {isMyProfile && (
                            <>
                                <h5>Joined Projects:</h5>
                                <ul className="list-group">
                                    {user.joinedProjects && user.joinedProjects.length > 0 ? (
                                        user.joinedProjects.map(project => (
                                            <li className='list-group-item d-flex justify-content-between align-items-center' key={project.projectId}>
                                                <h6>{projectDetailsMap[project.projectId]?.title}</h6>
                                                <span className='badge bg-primary'>{project.status}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className='list-group-item d-flex justify-content-between align-items-center'>No joined projects</li>
                                    )}
                                </ul>
                            </>)}
                    </div>
                </div>
            </div>


            {isMyProfile && (
                <>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateUser" onClick={updateValue}>Edit</button>
                    <button type="button" className="btn btn-danger mx-2" onClick={handleDelete}>Delete</button>

                    <div className="modal fade" id="updateUser" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 className="modal-title fs-5 header" id="exampleModalLabel">Edit Profile</h3>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="name" defaultValue={userInfo.name} name='name' onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="bio" className="form-label">Bio</label>
                                            <input type="text" className="form-control" id="bio" defaultValue={userInfo.bio} name='bio' onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="skills" className="form-label">Skills</label>
                                            {userInfo.skills && userInfo.skills.map((skill, index) => (
                                                <div key={index} className="d-flex align-items-center mb-2">
                                                    <input
                                                        type="text"
                                                        className="form-control me-2"
                                                        id={`skill-${index}`}
                                                        placeholder="Enter skill"
                                                        value={skill}
                                                        onChange={(e) => handleSkillChange(e, index)}
                                                    />
                                                    <button type="button" className="btn btn-sm btn-danger mx-2" onClick={() => handleSkillRemove(index)}>
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" className="btn btn-sm btn-primary mx-2" onClick={handleAddSkill}>Add Skill</button>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="institute" className="form-label">Institute</label>
                                            <input type="text" className="form-control" id="institute" value={userInfo.institute} name='institute' onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="role" className="form-label">Role</label>
                                            <select className="form-control" id="role" value={userInfo.role} name='role' onChange={onChange}>
                                                <option value="Student">Student</option>
                                                <option value="Instructor">Instructor</option>
                                                <option value="Professional">Professional</option>
                                                <option value="Freelancer">Freelancer</option>
                                                <option value="Other" >Other</option>
                                            </select>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleClick}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>)}
        </>
    )
}

export default ProfileCard;
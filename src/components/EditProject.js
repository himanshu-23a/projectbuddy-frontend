import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ProjectContext from '../context/projects/ProjectContext'
import './header.css'

const EditProject = () => {
    const { id } = useParams();
    console.log("id received", id);
    let navigate = useNavigate();
    const projectContext = useContext(ProjectContext);
    const { getProjectByid, editProject } = projectContext;
    const [projectInfo, setProjectInfo] = useState({
        title: "", description: "", category: "", members_no: 1, weeks: 1, open_closed: "Open to Work", status: "In Progress", skills_required: [], repository_link: ""
    });

    useEffect(() => {
        console.log("Enters useEffect");
        const fetchUserDetails = async () => {
            const details = await getProjectByid(id);
            console.log("After fetching details: ", details)
            if (details) {
                setProjectInfo((prev) => {
                    console.log("ProjectInfo inside: ", { ...prev, ...details });
                    return { ...prev, ...details };
                });
                console.log("ProjectInfo: ", projectInfo);
            }
            else {
                alert("Project not found");
                navigate("/MyProjects");
            }
        }
        if (id) {
            fetchUserDetails();
        }
    }, [id])

    const handleClick = (event) => {
        event.preventDefault();
        if (projectInfo.title.length <= 0 || projectInfo.title.length > 100) {
            alert("Title must be between 1 and 100 characters");
        }
        else if (projectInfo.description.length <= 0 || projectInfo.description.length > 500) {
            alert("Description must be between 1 and 500 characters");
        }
        else if(projectInfo.category.length < 0 || projectInfo.category.length > 60){
            alert("Category is exceeding the word limit");
        }
        else {
            console.log()
            editProject(projectInfo._id, projectInfo.title, projectInfo.description, projectInfo.category, projectInfo.members_no, projectInfo.weeks, projectInfo.open_closed, projectInfo.status, projectInfo.skills_required, projectInfo.repository_link);
            alert("Project Updated!");
            navigate("/MyProjects");
        }
    };

    const handleSkillChange = (event, index) => {
        const updatedSkills = [...projectInfo.skills_required];
        updatedSkills[index] = event.target.value;
        setProjectInfo({ ...projectInfo, skills_required: updatedSkills });
    };

    const handleSkillRemove = (index) => {
        const updatedSkills = projectInfo.skills_required.filter((_, i) => i !== index);
        setProjectInfo({ ...projectInfo, skills_required: updatedSkills });
    };

    const handleAddSkill = () => {
        setProjectInfo({ ...projectInfo, skills_required: [...projectInfo.skills_required, ""] });
    };

    const onChange = (event) => {
        const { name, value, type } = event.target;

        if (type === "number") {
            const numericValue = parseFloat(value); // Convert to a number
            if (numericValue < 1 || numericValue > 100) {
                console.log("Given field cannot be less than 1 or greater than 100");
                return; // Do not update state
            }
        }

        setProjectInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <div className='container'>
                <h5 className='header'>Edit Project</h5>
                <form>
                    <div className='row align-items-center'>
                        <div className="mb-3 col-6">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="title" name='title' value={projectInfo.title} onChange={onChange} />
                        </div>
                        <div className="mb-3 col-3">
                            <label htmlFor="open_closed" className="form-label" ></label>
                            <select className={`form-control ${projectInfo.open_closed === "Open to Work" ? 'bg-success' : projectInfo.open_closed === "Closed" ? 'bg-danger' : ''}`} id="open_closed" value={projectInfo.open_closed} name='open_closed' onChange={onChange}>
                                <option className='bg-white' value="Open to Work">Open to Work</option>
                                <option className="bg-white" value="Closed">Closed</option>
                            </select>
                        </div>
                        <div className="mb-3 col-3">
                            <label htmlFor="status" className="form-label"></label>
                            <select className={`form-control ${projectInfo.status === "In Progress" ? 'bg-primary' : projectInfo.status === "Completed" ? 'bg-success' : ''}`} id="status" value={projectInfo.status} name='status' onChange={onChange}>
                                <option className='bg-white' value="In Progress">In Progress</option>
                                <option className='bg-white' value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" value={projectInfo.description} name='description' onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <input type="text" className="form-control" id="category" value={projectInfo.category} name='category' onChange={onChange} />
                    </div>
                    <div className='row'>
                        <div className="mb-3 col">
                            <label htmlFor="members_no" className="form-label">Team Size</label>
                            <input type="number" className="form-control" id="members_no" value={projectInfo.members_no} name='members_no' onChange={onChange} />
                        </div>
                        <div className="mb-3 col">
                            <label htmlFor="weeks" className="form-label">Weeks to finish</label>
                            <input type="number" className="form-control" id="weeks" value={projectInfo.weeks} name='weeks' onChange={onChange} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="skills_required" className="form-label my-2">Skills</label>
                        {projectInfo.skills_required && projectInfo.skills_required.map((skill, index) => (
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
                        <label htmlFor="repository_link" className="form-label">Repository Link</label>
                        <input type="text" className="form-control" id="repository_link" value={projectInfo.repository_link} name='repository_link' onChange={onChange} />
                    </div>
                    <button type="button" className="btn btn-success my-3" onClick={handleClick}>Update</button>
                    <button type="button" className="btn btn-danger mx-2 my-3" onClick={() => { navigate("/MyProjects") }}>Close</button>
                </form>
            </div>
        </>
    )
}

export default EditProject
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectContext from '../context/projects/ProjectContext'
import './header.css'

const AddProject = (props) => {
    let navigate = useNavigate();
    const context = useContext(ProjectContext);
    const { addProject } = context;
    const [project, setProject] = useState({ title: "", description: "", category: "", members_no: 1, weeks: 1, open_closed: "Open to Work", status: "In Progress", skills_required: [], repository_link: "" });

    const handleClick = async (event) => {
        event.preventDefault();
        if (project.title.length <= 0 || project.title.length > 100) {
            alert("Title must be between 1 and 100 characters");
        }
        else if (project.description.length <= 0 || project.description.length > 500) {
            alert("Description must be between 1 and 500 characters");
        }
        else if(project.category.length < 0 || project.category.length > 60){
            alert("Category is exceeding the word limit");
        }
        else {
            await addProject(project.title, project.description, project.category, project.members_no, project.weeks, project.open_closed, project.status, project.skills_required, project.repository_link)
            setProject({ title: "", description: "", category: "", members_no: 1, weeks: 1, open_closed: "Open to Work", status:"In Progress", skills_required: [], repository_link: "" })
            console.log("Project  Added!");
            alert("Project Added!");
            navigate("/MyProjects");
        }
    };

    const handleSkillChange = (event, index) => {
        const updatedSkills = [...project.skills_required];
        updatedSkills[index] = event.target.value;
        setProject({ ...project, skills_required: updatedSkills });
    };

    const handleSkillRemove = (index) => {
        const updatedSkills = project.skills_required.filter((_, i) => i !== index);
        setProject({ ...project, skills_required: updatedSkills });
    };

    const handleAddSkill = () => {
        setProject({ ...project, skills_required: [...project.skills_required, ""] }); // Add empty string placeholder
    };

    const onChange = (event) => {
        const { name, value, type} = event.target;

        if (type === "number") {
            const numericValue = parseFloat(value); // Convert to a number
            if (numericValue < 1 || numericValue > 100) {
                console.log("Given field cannot be less than 1 or greater than 100");
                return; // Do not update state
            }
        }

        setProject((prev) => ({
            ...prev,
            [name] : value,
        }));
    };

    return (
        <div className='container'>
            <h5 className='header'>Add New Project</h5>
            <form>
                <div className='row align-items-center'>
                    <div className="mb-3 col-6 ">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name='title' value={project.title} onChange={onChange} />
                    </div>
                    <div className="mb-3 col-3">
                        <label htmlFor="open_closed" className="form-label" ></label>
                        <select className={`form-control ${project.open_closed === "Open to Work" ? 'bg-success' : project.open_closed === "Closed" ? 'bg-danger' : ''}`} id="open_closed" value={project.open_closed} name='open_closed' onChange={onChange}>
                            <option className='bg-white' value="Open to Work">Open to Work</option>
                            <option className="bg-white" value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="mb-3 col-3">
                        <label htmlFor="status" className="form-label"></label>
                        <select className={`form-control ${project.status === "In Progress" ? 'bg-primary' : project.status === "Completed" ? 'bg-success' : ''}`} id="status" value={project.status} name='status' onChange={onChange}>
                            <option className='bg-white' value="In Progress">In Progress</option>
                            <option className='bg-white' value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" value={project.description} name='description' onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input type="text" className="form-control" id="category" value={project.category} name='category' onChange={onChange} />
                </div>
                <div className='row'>
                    <div className="mb-3 col">
                        <label htmlFor="members_no" className="form-label">Team Size</label>
                        <input type="number" className="form-control" id="members_no" value={project.members_no} name='members_no' onChange={onChange} />
                    </div>
                    <div className="mb-3 col">
                        <label htmlFor="weeks" className="form-label">Weeks to finish</label>
                        <input type="number" className="form-control" id="weeks" value={project.weeks} name='weeks' onChange={onChange} />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="skills_required" className="form-label my-2">Skills</label>
                    {project.skills_required.map((skill, index) => (
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
                    <input type="text" className="form-control" id="repository_link" value={project.repository_link} name='repository_link' onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-success my-3" onClick={handleClick}>Create Project</button>
            </form>
        </div>
    )
}

export default AddProject
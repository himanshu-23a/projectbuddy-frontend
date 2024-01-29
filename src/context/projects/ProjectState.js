import React, { useState } from "react";
import ProjectContext from "./ProjectContext";

const ProjectState = (props) => {
    const host = process.env.REACT_APP_HOST || "http://localhost:5000"
    const projectInitial = []

    const [projects, setProjects] = useState(projectInitial)

    //Get all the projects
    const getProjects = async () => {
        //API Call
        const response = await fetch(`${host}/api/projects/fetchallProjects`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });
        const json = await response.json()
        console.log(json)
        setProjects(json)
    }

    //Get my  projects
    const getMyProjects = async () => {
        //API Call
        try {
            const response = await fetch(`${host}/api/projects/fetchmyprojects`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const json = await response.json()
            console.log(json)
            setProjects(json)
        }
        catch (error) {
            console.log("Error occurred in get my projects", error);
        }
    }

    //Get project by id
    const getProjectByid = async (id) => {
        //API Call
        const response = await fetch(`${host}/api/projects/getprojectbyid/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json()
        console.log(json)
        return (json)
    }

    //Add a Project
    const addProject = async (title, description, category, members_no, weeks, open_closed, status, skills_required, repository_link) => {
        // Prepare the project data
        const projectData = { title, description, category, members_no: Number(members_no), weeks: Number(weeks), open_closed, status, skills_required, repository_link };
        //API Call
        try {

            const respones = await fetch(`${host}/api/projects/addproject`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify(projectData)
            });
            const json = await respones.json();
            console.log("Project added!!")
            setProjects([...projects, json]);
        }
        catch (error) {
            console.log("There is error in adding project");
        }
    }

    //Delete a Project
    const deleteProject = async (id) => {
        const isConfirmed = window.confirm("Delete the Project?");
        if (isConfirmed) {
            //API Call
            const respones = await fetch(`${host}/api/projects/deleteproject/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const json = respones.json();
            console.log(json);

            console.log("Deleting project with id: " + id);
            const newProjects = projects.filter((project) => { return project._id !== id })
            setProjects(newProjects)
        }
    }

    //Edit a Project
    const editProject = async (id, title, description, category, members_no, weeks, open_closed, status, skills_required, repository_link) => {
        // Prepare the project data
        const projectData = { title, description, category, members_no: Number(members_no), weeks: Number(weeks), open_closed, status, skills_required, repository_link };
        //API Call
        const respones = await fetch(`${host}/api/projects/updateproject/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(projectData)
        });
        await respones.json();
        const newProject = JSON.parse(JSON.stringify(projects))
        //Logic to edit in client
        for (let index = 0; index < projects.length; index++) {
            const element = newProject[index];
            if (element._id === id) {
                newProject[index].title = title;
                newProject[index].description = description;
                newProject[index].category = category;
                newProject[index].members_no = members_no;
                newProject[index].weeks = weeks;
                newProject[index].open_closed = open_closed;
                newProject[index].status = status;
                newProject[index].skills_required = skills_required;
                newProject[index].repository_link = repository_link
                break;
            }
        }
        setProjects(newProject);
    }

    // Accept or Reject Join Request
    const respondToJoinRequest = async (projectId, userId, userResponse) => {
        console.log(userResponse);

        // API Call
        try {
            const response = await fetch(`${host}/api/projects/respondtojoinrequest/${projectId}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ response: userResponse }) // 'accepted' or 'rejected'
            });
            const json = await response.json();
            console.log(json);
            // Check for the specific message
            if (json.message === 'Project has reached the maximum number of members') {
                // Display a message or perform actions for maximum members reached
                alert('Project has reached the maximum number of members');
            }
            // Logic to update client-side
            else if (response.status === 200) {
                const updatedProjects = JSON.parse(JSON.stringify(projects)); // Assuming projects is your state
                const projectIndex = updatedProjects.findIndex(project => project._id === projectId);

                // Update the client-side state based on the response
                if (userResponse === 'accepted') {
                    console.log("Accepted this");
                    // Update the project's team_members and requests
                    updatedProjects[projectIndex].team_members.push(userId);
                } else if (userResponse === 'rejected') {
                    console.log("Rejected this");
                }

                // Remove the join request from the project's requests
                updatedProjects[projectIndex].requests = updatedProjects[projectIndex].requests.filter(request => request.userId !== userId);

                // Update the state
                setProjects(updatedProjects);
            }
            else {
                console.error("An unexpected error occurred:");
            }
        }
        catch (error) {
            console.error("An unexpected error occurred:", error);
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <ProjectContext.Provider value={{ projects, getProjects, getMyProjects, getProjectByid, addProject, deleteProject, editProject, respondToJoinRequest }}>
            {props.children}
        </ProjectContext.Provider>
    )
}

export default ProjectState
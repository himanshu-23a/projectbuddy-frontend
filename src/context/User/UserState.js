import React, { useState } from "react";
import UserContext from "./UserContext";
import host from "../../host"

const UserState = (props) => {
    //const host = "http://localhost:5000"
    const userInitial = []

    const [user, setUser] = useState(userInitial)

    //Get my Profile Details
    const getMyProfile = async () => {
        //API Call
        const response = await fetch(`${host}/api/auth/getuser`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json()
        console.log(json)
        setUser(json)
    }
    //Get user details with user id
    const getUserByid = async (id) => {
        //API Call
        try {
            console.log(`${host}/api/auth/getuserbyid/${id}`);
            const response = await fetch(`${host}/api/auth/getuserbyid/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const json = await response.json()
            console.log("GetUserById:", json)
            return (json)
        }
        catch(error){
            console.log("An unexpected error occurred", error);
        }
    }

    //Delete the user
    const deleteUser = async () => {

        //API Call
        const respones = await fetch(`${host}/api/auth/deleteuser`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        await respones.json();
        console.log("User deleted")
    }

    //update User Information
    const updateUser = async (name, bio, skills, institute, profile_picture, role) => {
        //API Call
        const respones = await fetch(`${host}/api/auth/updateuserinfo`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ name, bio, skills, institute, profile_picture, role })
        });
        await respones.json();
        const newUserInfo = JSON.parse(JSON.stringify(user))
        //Logic to edit in client
        newUserInfo.name = name;
        newUserInfo.bio = bio;
        newUserInfo.skills = skills;
        newUserInfo.institute = institute;
        newUserInfo.profile_picture = profile_picture;
        newUserInfo.role = role;
        setUser(newUserInfo);
    }

    //Send Join request to a project  
    const sendJoinRequest = async (projectId) => {
        try {
            // API Call
            const response = await fetch(`${host}/api/auth/sendjoinrequest/${projectId}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                }
            });
            const result = await response.json();

            // Logic to handle the response
            if (response.ok) {
                // Join request sent successfully
                console.log(result.message);
            } else {
                // Failed to send join request
                console.error(result.message);
            }
            getMyProfile();
        } catch (error) {
            console.error('Error sending join request:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, getMyProfile, getUserByid, deleteUser, updateUser, sendJoinRequest }}>
            {props.children}
        </UserContext.Provider>
    )

}

export default UserState;
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/User/UserContext'
import { useParams } from 'react-router-dom';
import ProfileCard from './ProfileCard';

const ProfileDetails = () => {
    const { id } = useParams();
    const context = useContext(UserContext);
    const { getUserByid } = context;
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            const details = await getUserByid(id);
            if (details) {
                setUserDetails(details);
            }
            else{
                alert("User not found!");
            }
        }
        fetchUserDetails();
    }, [id])

    return (
        <>
            {userDetails && <ProfileCard user={userDetails} isMyProfile={false} />}
        </>
    )
}

export default ProfileDetails;
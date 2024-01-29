import React, { useContext, useEffect} from 'react'
import UserContext from '../context/User/UserContext'
import ProfileCard from './ProfileCard';

const UserProfile = () => {
  const context =   useContext(UserContext);
  const { user, getMyProfile } = context;
  
  useEffect(() => {
    getMyProfile();
    //eslint-disable-next-line
  }, [])

  return (
    <>
      {user && <ProfileCard user= {user} isMyProfile = {true}/>}
    </>
  )
}

export default UserProfile;
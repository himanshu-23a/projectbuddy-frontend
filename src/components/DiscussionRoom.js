import React, { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
import socket from '../utils/Socket'; // Make sure to have a utility to create and export the socket instance
import UserContext from '../context/User/UserContext';
import './DiscussionRoom.css'
import profile from '../image/profile.jpg'
import error_discussion from '../image/404-error.png'


const DiscussionRoom = ({ projectId }) => {
  const [discussions, setDiscussions] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const userContext = useContext(UserContext);
  const { user } = userContext;
  const chatAreaRef = useRef(null); // Add a ref for the chat area


  // Function to fetch discussions for a specific project
  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/discussions/getdiscussions/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
      });

      const fetchedDiscussions = await response.json();
      console.log("Fetched Discussion", fetchedDiscussions);
      setDiscussions(fetchedDiscussions);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  // Listen for new discussions
  const handleNewDiscussion = (discussion) => {
    console.log('New Discussion Received', discussion);
    setDiscussions((prevDiscussions) => [...prevDiscussions, discussion]);
  };

  // Set up socket listeners
  useEffect(() => {
    console.log('Entering useEffect');
    // Join the discussion room on component mount
    socket.emit('joinDiscussionRoom', { projectId });
    // Call fetchDiscussions to initially fetch discussions
    fetchDiscussions();

    // Listen for new discussions
    socket.on('newDiscussion', handleNewDiscussion);

    // Clean up event listener when the component unmounts
    return () => {
      console.log('Cleaning up useEffect');
      socket.off('newDiscussion', handleNewDiscussion);
    };
  }, []);

  useEffect(() => {
    // Scroll the chat area to the bottom when discussions change
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [discussions]);


  const onSubmit = async (data) => {
    try {
      // Add a new discussion to a specific project
      const response = await fetch(`http://localhost:5000/api/discussions/adddiscussion/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ message: data.message }),
      });

      const newDiscussion = await response.json();

      // Handle the new discussion if needed
      console.log(newDiscussion);

      // Emit new discussion to the server (if not handled by socket.on('newDiscussion'))
      console.log('Before socket.emit');
      socket.emit('newDiscussion', { projectId, message: data.message, user, timestamp: new Date().toISOString() });
      console.log('After socket.emit');

      console.log('Socket connected:', socket.connected);

      // Clear the input field
      reset();
    } catch (error) {
      console.error('Error adding discussion:', error);
    }
  };

  return (
    <div className='card discussion-card' >
      <div ref={chatAreaRef} className='chat-area'>
        {Array.isArray(discussions) && discussions.length > 0 ? (
          <ul className='list-group'>
            {discussions.map((discussion, index) => {
              const date = new Date(discussion.timestamp);
              const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', });
              const showDate = (index === 0) || (date.getDate() !== new Date(discussions[index - 1].timestamp).getDate());
              return (
                <li key={discussion.timestamp}>
                  {showDate &&
                    <p className="d-flex justify-content-center align-items-center">
                      <span className="badge date-separator">{formattedDate}</span>
                    </p>
                  }
                  <div className='card p-2 mb-2 chat-card'>
                    <div>
                      {discussion.user ? (
                        <>
                          <img src={profile} className="profile-item" alt='profile' />
                          <span className='mx-2 profile-name'>{discussion.user.name}</span>
                        </>
                      ) : (
                        <span className='mx-2 profile-name'>User account deleted</span>
                      )}
                    </div>
                    <div className='message-box'>{discussion.message}</div>
                    <span className='text-end time-chat m-0'>{date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                  </div>

                </li>
              )
            })
            }
          </ul>
        ) : (
          <div className='card discussion-card' style={{ justifyContent: 'center' }}>
            <div className='start-discussion'><img className="error-img" src={error_discussion} alt='error' /></div>
            <div className='start-discussion p-3'>Be the First to start Discussion</div>
          </div>
        )}
      </div>
      <div className='form-style'>
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex align-items-center">
          <textarea {...register('message', { required: true })} rows="1" className="form-control textbox me-2" placeholder="Add your discussion" />
          <button type="submit" className='btn btn-primary btn-send'>Send</button>
        </form>
      </div>
    </div>
  );
};

export default DiscussionRoom;

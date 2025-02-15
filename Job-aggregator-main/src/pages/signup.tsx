import React, { useState } from 'react';
import UserDetailsForm from '../components/UserDetailsForm';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const history = useHistory();

  const handleSignUp = async (userDetails) => {
    try {
      // Assuming you have a sign-up API endpoint
      await axios.post('/api/signup', userDetails);
      setIsSignedUp(true);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleUserDetailsSubmit = async (details) => {
    try {
      // Assuming you have an API endpoint to save user details
      await axios.post('/api/user-details', details);
      history.push('/home');
    } catch (error) {
      console.error('Error saving user details:', error);
    }
  };

  return (
    <div>
      {!isSignedUp ? (
        <SignUpForm onSubmit={handleSignUp} />
      ) : (
        <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
      )}
    </div>
  );
}
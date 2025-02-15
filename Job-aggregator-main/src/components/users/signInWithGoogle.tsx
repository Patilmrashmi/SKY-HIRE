import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { auth, db } from ".././firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../../google.png";

const SignInwithGoogle: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = useCallback(() => {
    navigate('/homepage', { replace: true });
  }, [navigate]);

  const googleLogin = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user) {
        // First save the user data
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: user.displayName,
          photo: user.photoURL,
          lastName: "",
        });

        // Then show toast and navigate
        toast.success("Account created successfully!", {
          position: "top-center",
          autoClose: 1500,
          onClose: handleNavigation
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Error during login", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <p className="text-center text-gray-500 m-2">--Or continue with--</p>
      <div 
        className="flex justify-center cursor-pointer" 
        onClick={googleLogin}
      >
        <img src={googleLogo} width={"60%"} alt="Google SignIn" />
      </div>
    </div>
  );
};

export default SignInwithGoogle;
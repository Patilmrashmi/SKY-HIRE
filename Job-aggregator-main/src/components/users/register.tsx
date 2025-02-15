import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, FormEvent } from "react";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // Refresh user info
        setUser({ ...currentUser, displayName: currentUser.displayName || "User" });
        navigate("/"); // ✅ Redirect to home if already logged in
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Set the user's name in Firebase Auth
      await updateProfile(user, { displayName: `${fname} ${lname}` });

      // ✅ Store user data in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: fname,
        lastName: lname,
        fullName: `${fname} ${lname}`,
        photo: "",
      });

      toast.success("User Registered Successfully!", { position: "top-center" });
      navigate("/"); // ✅ Redirect after registration
    } catch (error: any) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-rose-300 flex items-center justify-center">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-semibold text-center text-pink-500 mb-6">Sign Up</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-pink-700 mb-2">First Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:ring-pink-500"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-pink-700 mb-2">Last Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md focus:ring-pink-500"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-pink-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-pink-700 mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md focus:ring-pink-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

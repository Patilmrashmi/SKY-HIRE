import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../components/firebase";
import { FaUserCircle } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // Refresh user info
        setUser({ ...currentUser, displayName: currentUser.displayName || "User" });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-pink-500">Job Portal</Link>

      <div>
        {user ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-pink-500 hover:text-pink-600"
              onClick={() => setDropdownVisible(!dropdownVisible)}
            >
              <FaUserCircle size={24} />
              <span>{user.displayName}</span>
            </button>

            {dropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-50">
                <div className="px-4 py-2 text-gray-700">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.displayName}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-pink-500 hover:text-pink-600">Login / Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

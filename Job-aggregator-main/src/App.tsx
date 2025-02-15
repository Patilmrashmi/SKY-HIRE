import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './components/users/login';
import Register from './components/users/register';
import Homepage from "./pages/homepage";
import SignInwithGoogle from "./components/auth/signInWithGoogle";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
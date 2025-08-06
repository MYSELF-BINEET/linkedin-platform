
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  console.log("Navbar user:", user);
  
  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-700 p-4 flex justify-between items-center">
      <Link 
        to="/" 
        className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text hover:from-blue-300 hover:to-purple-300 transition-colors duration-200"
      >
        SocialHub
      </Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link 
              to={`/profile/${user._id}`}
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              {user.name}
            </Link>
            <button
              onClick={logout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="bg-gradient-to-r to-emerald-300  hover:to-emerald-200 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (user && user._id === id) {
      setName(user.name);
      setBio(user.bio || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
    }
  }, [user, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put("/users/profile", { name, bio, location, website });
      toast.success("Profile updated!");
      navigate(`/profile/${id}`);
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  if (!user || user._id !== id) {
    return <p className="text-center mt-10 text-gray-600">Unauthorized</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 transition resize-none"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 transition"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-lg p-2 transition"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition shadow-sm"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

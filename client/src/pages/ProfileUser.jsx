import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import SkeletonProfile from "../components/SkeletonProfile";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProfileUser() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchData = async () => {
    try {
      const resUser = await API.get(`/users/${id}`);
      const resPosts = await API.get(`/users/${id}/posts`);
      setProfile(resUser.data.data.user);
      setPosts(resPosts.data.data.posts);
      setIsFollowing(resUser.data.data.user.followers?.includes(user?._id));
    } catch (err) {
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  const handlePostDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Error deleting post");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <SkeletonProfile />;

  const isOwnProfile = user?._id === id;
  const followerCount = profile?.followers?.length || 0;
  const followingCount = profile?.following?.length || 0;
  const postCount = posts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        {profile.coverPhoto && (
          <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile Picture */}
      <div className="relative w-32 h-32 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg">
        <img
          src={profile.profilePicture || "https://via.placeholder.com/128"}
          alt={profile.name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
          <p className="text-gray-600 text-lg mb-4 max-w-md mx-auto">
            {profile.bio || "No bio available"}
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{postCount}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{followerCount}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{followingCount}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>

          {/* Follow / Message Buttons */}
          {!isOwnProfile && (
            <div className="flex justify-center space-x-3">
              <button
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  isFollowing
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium">
                Message
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === "posts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Posts ({postCount})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === "about"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === "media"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Media
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {activeTab === "posts" && (
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onUpdate={handlePostUpdate}
                    onDelete={handlePostDelete}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {profile.name}</h2>
              <p className="text-gray-600">{profile.bio || "No bio available"}</p>
            </div>
          )}

          {activeTab === "media" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media</h3>
              <p className="text-gray-500">Photos and videos will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

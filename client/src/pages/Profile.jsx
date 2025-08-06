import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import SkeletonProfile from "../components/SkeletonProfile";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Camera } from "lucide-react"; // or use any icon library you prefer

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchData = async () => {
    try {
      const resUser = await API.get(`/users/${id}`);
      const resPosts = await API.get(`/users/${id}/posts`);
      setProfile(resUser.data.data.user);
      setPosts(resPosts.data.data.posts);
      // Check if current user is following this profile
      setIsFollowing(resUser.data.data.user.followers?.includes(user?._id));
    } catch (err) {
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
  };

  // const handlePostDelete = (postId) => {
  //   setPosts(posts.filter(post => post._id !== postId));
  //   toast.success("Post deleted successfully");
  // };

  const handlePostDelete = async (postId) => {
  if (!window.confirm("Are you sure you want to delete this post?")) return;
  try {
    await API.delete(`/posts/${postId}`);
    setPosts(prev => prev.filter(post => post._id !== postId));
    toast.success("Post deleted successfully");
  } catch (err) {
    toast.error("Error deleting post");
  }
};

const handleProfilePicChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const res = await API.post("/users/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProfile(res.data.data.user);
    toast.success("Profile picture updated!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating profile picture");
  }
};

const handleDeleteProfilePic = async () => {
  if (!window.confirm("Delete profile picture?")) return;
  try {
    const res = await API.delete("/users/profile-picture");
    setProfile(res.data.data.user);
    toast.success("Profile picture deleted!");
  } catch {
    toast.error("Error deleting profile picture");
  }
};

const handleCoverPhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("coverPhoto", file);

  try {
    const res = await API.post("/users/cover-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setProfile(res.data.data.user);
    toast.success("Cover photo updated!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating cover photo");
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
      {/* Cover Photo Section */}
        <div className="relative h-64 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
           {profile.coverPhoto && (
          <img
            src={profile.coverPhoto}
            alt="Cover"
            className=" w-full h-full object-cover"
          />
        )}
        {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}

        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <label className="bg-white bg-opacity-20 backdrop-blur-sm text-black px-4 py-2 rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all cursor-pointer">
              Edit Cover
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverPhotoChange}
              />
            </label>
          </div>
        )}
      </div>

        
        {/* Profile Picture */}
        <div className="relative w-32 h-32 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/128"}
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          {isOwnProfile && (
            <label className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          )}
        </div>


        {/* <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/128"}
              alt={profile.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />

            {isOwnProfile && (
              <label className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            )} */}
        {/* </div> */}


      {/* Profile Info Section */}
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

          {/* Action Buttons */}
          <div className="flex justify-center space-x-3">
            {isOwnProfile ? (
              <>
                <Link
                  to={`/profile/${id}/edit`}
                  className=" text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </Link>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </>
            ) : (
              <>
                <button
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                    isFollowing
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Following
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Follow
                    </>
                  )}
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.414-.72L5 17.5l1.5-4.086A8.955 8.955 0 015 10c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                  </svg>
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Posts ({postCount})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                activeTab === 'media'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Media
            </button>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="max-w-2xl mx-auto">
          {activeTab === 'posts' && (
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
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-500">
                    {isOwnProfile ? "Share your first post to get started!" : "No posts from this user yet."}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About {profile.name}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Bio</h3>
                  <p className="text-gray-600">
                    {profile.bio || "No bio available"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Joined</h3>
                  <p className="text-gray-600">
                    {new Date(profile.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No media</h3>
                <p className="text-gray-500">Photos and videos will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    // </div>
  );
}

// import { useParams, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../services/api";
// import SkeletonProfile from "../components/SkeletonProfile";
// import PostCard from "../components/PostCard";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";
// import { Camera } from "lucide-react";

// export default function Profile() {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("posts");
//   const [isFollowing, setIsFollowing] = useState(false);

//   const fetchData = async () => {
//     try {
//       const resUser = await API.get(`/users/${id}`);
//       const resPosts = await API.get(`/users/${id}/posts`);
//       setProfile(resUser.data.data.user);
//       setPosts(resPosts.data.data.posts);
//       setIsFollowing(resUser.data.data.user.followers?.includes(user?._id));
//     } catch (err) {
//       toast.error("Error loading profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePostUpdate = (updatedPost) => {
//     setPosts((prev) =>
//       prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
//     );
//   };

//   const handlePostDelete = async (postId) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await API.delete(`/posts/${postId}`);
//       setPosts((prev) => prev.filter((post) => post._id !== postId));
//       toast.success("Post deleted successfully");
//     } catch {
//       toast.error("Error deleting post");
//     }
//   };

//   const handleProfilePicChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("profilePicture", file);

//     try {
//       const res = await API.post("/users/profile-picture", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setProfile(res.data.data.user);
//       toast.success("Profile picture updated!");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error updating profile picture");
//     }
//   };

//   const handleCoverPhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("coverPhoto", file);

//     try {
//       const res = await API.post("/users/cover-photo", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setProfile(res.data.data.user);
//       toast.success("Cover photo updated!");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error updating cover photo");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [id]);

//   if (loading) return <SkeletonProfile />;

//   const isOwnProfile = user?._id === id;
//   const followerCount = profile?.followers?.length || 0;
//   const followingCount = profile?.following?.length || 0;
//   const postCount = posts.length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Cover Photo */}
//       <div className="relative h-64 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
//         {profile.coverPhoto && (
//           <img
//             src={profile.coverPhoto}
//             alt="Cover"
//             className=" w-full h-full object-cover"
//           />
//         )}
//         {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}

//         {isOwnProfile && (
//           <div className="absolute top-4 right-4">
//             <label className="bg-white bg-opacity-20 backdrop-blur-sm text-black px-4 py-2 rounded-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all cursor-pointer">
//               Edit Cover
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleCoverPhotoChange}
//               />
//             </label>
//           </div>
//         )}
//       </div>

//       {/* Profile Picture */}
//       <div className="relative w-32 h-32 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg">
//         <img
//           src={profile.profilePicture || "https://via.placeholder.com/128"}
//           alt={profile.name}
//           className="w-full h-full rounded-full object-cover"
//         />
//         {isOwnProfile && (
//           <label className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition">
//             <Camera className="w-4 h-4 text-white" />
//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleProfilePicChange}
//             />
//           </label>
//         )}
//       </div>

//       {/* Profile Info */}
//       <div className="max-w-4xl mx-auto px-4 pt-6 pb-6">
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
//           <p className="text-gray-600 text-lg">{profile.bio || "No bio available"}</p>

//           {/* Stats */}
//           <div className="flex justify-center gap-8 my-4">
//             <div className="text-center">
//               <div className="text-2xl font-bold">{postCount}</div>
//               <div className="text-sm text-gray-500">Posts</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold">{followerCount}</div>
//               <div className="text-sm text-gray-500">Followers</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold">{followingCount}</div>
//               <div className="text-sm text-gray-500">Following</div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-center gap-3">
//             {isOwnProfile ? (
//               <Link
//                 to={`/profile/${id}/edit`}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
//               >
//                 Edit Profile
//               </Link>
//             ) : (
//               <button
//                 className={`px-6 py-2 rounded-lg ${
//                   isFollowing
//                     ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
//                     : "bg-blue-600 hover:bg-blue-700 text-white"
//                 }`}
//               >
//                 {isFollowing ? "Following" : "Follow"}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b border-gray-200 mb-6">
//           <nav className="flex justify-center gap-8">
//             {["posts", "about", "media"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`py-3 px-1 font-medium text-sm border-b-2 ${
//                   activeTab === tab
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Tab Content */}
//         {activeTab === "posts" && (
//           <div className="space-y-6">
//             {posts.length > 0 ? (
//               posts.map((post) => (
//                 <PostCard
//                   key={post._id}
//                   post={post}
//                   onUpdate={handlePostUpdate}
//                   onDelete={handlePostDelete}
//                 />
//               ))
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 No posts yet
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "about" && (
//           <div className="bg-white rounded-lg border p-6">
//             <h2 className="text-xl font-semibold">About {profile.name}</h2>
//             <p className="mt-2 text-gray-600">{profile.bio || "No bio available"}</p>
//             <p className="mt-2 text-gray-600">
//               Joined{" "}
//               {new Date(profile.createdAt || Date.now()).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//               })}
//             </p>
//           </div>
//         )}

//         {activeTab === "media" && (
//           <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
//             No media
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

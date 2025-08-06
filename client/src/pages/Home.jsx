import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import SkeletonPost from "../components/SkeletonPost";
import toast from "react-hot-toast";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data.data.posts || []);
    } catch (err) {
      toast.error("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  // Create post
  const handleCreate = async () => {
    if (!content.trim()) return;
    setCreating(true);
    try {
      const res = await API.post("/posts", { content });
      setPosts([res.data.data.post, ...posts]);
      setContent("");
      toast.success("Post created");
    } catch {
      toast.error("Error creating post");
    }
    setCreating(false);
  };

  // Update post
  const handleUpdate = async (id) => {
    if (!content.trim()) return;
    try {
      const res = await API.put(`/posts/${id}`, { content });
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? res.data.data.post : p))
      );
      setContent("");
      setEditingPostId(null);
      toast.success("Post updated");
    } catch {
      toast.error("Error updating post");
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Error deleting post");
    }
  };

//   const handleDelete = async (id) => {
//   if (!window.confirm("Are you sure?")) return;
//   try {
//     await API.delete(`/posts/${id}`);
//     toast.success("Post deleted");
//   } catch {
//     toast.error("Error deleting post");
//   }
// };


  // Like post
  const handleLike = async (id) => {
    try {
      const res = await API.post(`/posts/${id}/like`);
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? res.data.data.post : p))
      );
    } catch {
      toast.error("Error liking post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200">
        <div className="max-w-7xl mx-auto pt-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <SkeletonPost />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {Array(3)
                .fill()
                .map((_, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                    <SkeletonPost />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200">
      <div className="max-w-7xl mx-auto pt-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Create/Edit post */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 sticky top-8">
              <textarea
                placeholder={editingPostId ? "Edit your post..." : "What's on your mind?"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-2xl resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 bg-white/80 text-gray-800 placeholder-gray-500"
                rows={4}
              />
              <div className="mt-4 flex justify-end">
                {editingPostId ? (
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setEditingPostId(null);
                        setContent("");
                      }}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(editingPostId)}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none"
                  >
                    {creating ? "Posting..." : "Post"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Posts list */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
                  {/* <PostCard
                    post={post}
                    onEditClick={() => {
                      setEditingPostId(post._id);
                      setContent(post.content);
                    }}
                    onDelete={() => handleDelete(post._id)}
                    onLike={() => handleLike(post._id)}
                  /> */}
                 <PostCard
                    post={post}
                    onUpdate={(updatedPost) => {
                      setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
                    }}
                    onDelete={(postId) => {
                      setPosts(prev => prev.filter(p => p._id !== postId));
                      handleDelete(postId); // still call API
                    }}
                    onEditClick={() => {
                      setEditingPostId(post._id);
                      setContent(post.content);
                    }}
                  />


                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
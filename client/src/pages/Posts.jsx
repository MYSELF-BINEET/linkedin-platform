// import { useEffect, useState } from "react";
// import API from "../services/api";
// import PostCard from "../components/PostCard";
// import toast from "react-hot-toast";

// export default function Posts() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [content, setContent] = useState("");
//   const [editingPostId, setEditingPostId] = useState(null);
//   const [creating, setCreating] = useState(false);

//   const fetchPosts = async () => {
//     try {
//       const res = await API.get("/posts");
//       setPosts(res.data.data.posts || []);
//     } catch {
//       toast.error("Error fetching posts");
//     }
//     setLoading(false);
//   };

//   const handleCreate = async () => {
//     if (!content.trim()) return;
//     setCreating(true);
//     try {
//       const res = await API.post("/posts", { content });
//       if (res.data?.data?.post?._id) {
//         setPosts([res.data.data.post, ...posts]);
//         setContent("");
//         toast.success("Post created");
//       }
//     } catch {
//       toast.error("Error creating post");
//     }
//     setCreating(false);
//   };

//   const handleUpdate = async (id) => {
//     if (!content.trim()) return;
//     try {
//       const res = await API.put(`/posts/${id}`, { content });
//       if (res.data?.data?.post?._id) {
//         setPosts((prev) =>
//           prev.map((p) => (p._id === id ? res.data.data.post : p))
//         );
//         setContent("");
//         setEditingPostId(null);
//         toast.success("Post updated");
//       }
//     } catch {
//       toast.error("Error updating post");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     try {
//       await API.delete(`/posts/${id}`);
//       setPosts((prev) => prev.filter((p) => p._id !== id));
//       toast.success("Post deleted");
//     } catch {
//       toast.error("Error deleting post");
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;

//   return (
//     <div className="max-w-lg mx-auto mt-4 space-y-4">
//       {/* Create or Edit post */}
//       <div className="bg-white p-4 rounded shadow">
//         <textarea
//           placeholder={
//             editingPostId ? "Edit your post..." : "What's on your mind?"
//           }
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full border p-2 rounded"
//         />
//         {editingPostId ? (
//           <button
//             type="button"
//             onClick={() => handleUpdate(editingPostId)}
//             className="bg-yellow-500 text-white px-4 py-1 rounded mt-2"
//           >
//             Update
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={handleCreate}
//             disabled={creating}
//             className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
//           >
//             Post
//           </button>
//         )}
//       </div>

//       {/* Posts list */}
//       {posts.map((post) => (
//         <PostCard
//           key={post._id}
//           post={post}
//           onUpdateClick={() => {
//             setEditingPostId(post._id);
//             setContent(post.content);
//           }}
//           onDelete={() => handleDelete(post._id)}
//         />
//       ))}
//     </div>
//   );
// }

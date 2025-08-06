import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import toast from "react-hot-toast";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data.data.post);
    } catch {
      toast.error("Error fetching post");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="max-w-lg mx-auto mt-4">
      <PostCard post={post} onUpdate={setPost} onDelete={() => {}} />
    </div>
  );
}

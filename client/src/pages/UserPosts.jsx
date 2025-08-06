import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import SkeletonPost from "../components/SkeletonPost";
import toast from "react-hot-toast";

export default function UserPosts() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await API.get(`/users/${id}/posts`);
      setPosts(res.data.data.posts);
    } catch (err) {
      toast.error("Error fetching posts",err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto mt-4 space-y-4">
        {Array(3).fill().map((_, i) => <SkeletonPost key={i} />)}
      </div>
    );
  }

  return (
    <div className="max-w-mg mx-auto mt-4 space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom"; // add this import


export default function PostCard({ post, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showComments, setShowComments] = useState(true);

  const handleLike = async () => {
    setLikeLoading(true);
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      onUpdate(res.data.data.post);
    } catch (err) {
      toast.success( " liking post");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await API.post(`/posts/${post._id}/comments`, { content: comment });
      onUpdate(res.data.data.post);
      setComment("");
    } catch (err) {
      toast.success(" adding comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const isLiked = post.likes?.some(like => like === user?._id);
  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Link to={`/users/${post.author._id}`}>
                  <img
                    src={post.author.profilePicture || "https://via.placeholder.com/40"}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 hover:opacity-80 transition"
                  />
                </Link>

              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/users/${post.author._id}`}>
            <h3 className="font-semibold text-gray-900 truncate hover:underline">
              {post.author.name}
            </h3>
        </Link>

              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          {user && user._id === post.author._id && (
            <div className="relative">
              <button
                onClick={() => onDelete(post._id)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                title="Delete post"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Post Stats */}
      {(likeCount > 0 || commentCount > 0) && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {likeCount > 0 && (
                <span className="flex items-center">
                  <span className="text-blue-500 mr-1">👍</span>
                  {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </span>
              )}
            </div>
            {commentCount > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:underline"
              >
                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isLiked
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className={`text-base ${likeLoading ? 'animate-pulse' : ''}`}>
              {isLiked ? '👍' : '👍'}
            </span>
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.414-.72L5 17.5l1.5-4.086A8.955 8.955 0 015 10c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            <span>Comment</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex space-x-3">
          <img
            src={user?.profilePicture || "https://via.placeholder.com/32"}
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {comment.trim() && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={commentLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {commentLoading ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      {showComments && post.comments && post.comments.length > 0 && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-3 space-y-3">
            {post.comments.map((c) => (
              <div key={c._id} className="flex space-x-3">
                <img
                  src={c.user.profilePicture || "https://via.placeholder.com/32"}
                  alt={c.user.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <p className="font-semibold text-sm text-gray-900">
                      {c.user.name}
                    </p>
                    <p className="text-sm text-gray-800 mt-0.5">
                      {c.content}
                    </p>
                  </div>
                  <div className="mt-1 px-3">
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
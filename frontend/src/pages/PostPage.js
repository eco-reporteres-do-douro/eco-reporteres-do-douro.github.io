import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { toast } from "sonner";

const API = process.env.REACT_APP_BACKEND_URL;

export default function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        axios.get(`${API}/api/posts/${postId}`),
        axios.get(`${API}/api/comments?post_id=${postId}`),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/api/comments`, { name, message, post_id: postId });
      setComments([data, ...comments]);
      setName("");
      setMessage("");
      toast.success("Comentário publicado!");
    } catch {
      toast.error("Erro ao publicar comentário.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-pulse text-[#722F37] font-['Playfair_Display'] text-xl">A carregar...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-[#5C4A41] text-lg mb-4">Post não encontrado.</p>
          <Link to="/trabalhos" className="text-[#722F37] font-medium">Voltar aos trabalhos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16" data-testid="post-page">
      {/* Hero */}
      {post.cover_image && (
        <div className="h-[50vh] relative">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A11]/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <Link to="/trabalhos" className="inline-flex items-center gap-2 text-sm text-[#5C4A41] hover:text-[#722F37] transition-colors mb-8" data-testid="back-to-works">
            <ArrowLeft size={16} /> Voltar aos trabalhos
          </Link>

          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">{post.category}</p>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#2D1A11] tracking-tight leading-tight mb-6" data-testid="post-title">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-[#5C4A41] mb-12">
            <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('pt-PT')}</span>
          </div>

          <div className="text-base md:text-lg leading-relaxed text-[#5C4A41] whitespace-pre-wrap" data-testid="post-content">
            {post.content}
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="py-16 md:py-24 bg-[#F4F0E6]" data-testid="comments-section">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#2D1A11] mb-8">
            Comentários ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-12" data-testid="comment-form">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="O teu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-[#7C3A00]/30 py-3 text-[#2D1A11] placeholder-[#5C4A41]/50 focus:border-[#722F37] focus:outline-none transition-colors"
                data-testid="comment-name-input"
              />
              <textarea
                placeholder="Escreve o teu comentário..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-b border-[#7C3A00]/30 py-3 text-[#2D1A11] placeholder-[#5C4A41]/50 focus:border-[#722F37] focus:outline-none transition-colors resize-none"
                data-testid="comment-message-input"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#722F37] text-[#FDFBF7] px-8 py-3 hover:bg-[#5A252B] transition-colors font-medium text-sm disabled:opacity-50"
                data-testid="comment-submit-button"
              >
                {submitting ? "A enviar..." : "Publicar comentário"}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-[#E5DCD0] pb-6" data-testid={`comment-${comment.id}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#2D1A11]">{comment.name}</span>
                  <span className="text-xs text-[#5C4A41]/60">{new Date(comment.created_at).toLocaleDateString('pt-PT')}</span>
                </div>
                <p className="text-sm text-[#5C4A41]">{comment.message}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-[#5C4A41]/60 text-sm">Sê o primeiro a comentar!</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

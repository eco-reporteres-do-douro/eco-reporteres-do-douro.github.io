import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Trash2, Plus, Edit } from "lucide-react";

const API = process.env.REACT_APP_BACKEND_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [team, setTeam] = useState([]);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);

  // Form states
  const [postForm, setPostForm] = useState({ title: "", content: "", category: "", excerpt: "", cover_image: "" });
  const [galleryForm, setGalleryForm] = useState({ title: "", description: "", image_url: "", category: "" });
  const [timelineForm, setTimelineForm] = useState({ date: "", title: "", description: "" });
  const [teamForm, setTeamForm] = useState({ name: "", role: "", description: "", image_url: "" });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [postsRes, galleryRes, timelineRes, teamRes, commentsRes, catsRes] = await Promise.all([
        axios.get(`${API}/api/posts`),
        axios.get(`${API}/api/gallery`),
        axios.get(`${API}/api/timeline`),
        axios.get(`${API}/api/team`),
        axios.get(`${API}/api/comments`),
        axios.get(`${API}/api/categories`),
      ]);
      setPosts(postsRes.data);
      setGallery(galleryRes.data);
      setTimeline(timelineRes.data);
      setTeam(teamRes.data);
      setComments(commentsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Posts
  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await axios.put(`${API}/api/posts/${editingPost}`, postForm, { headers: getAuthHeaders(), withCredentials: true });
        toast.success("Post atualizado!");
        setEditingPost(null);
      } else {
        await axios.post(`${API}/api/posts`, postForm, { headers: getAuthHeaders(), withCredentials: true });
        toast.success("Post criado!");
      }
      setPostForm({ title: "", content: "", category: "", excerpt: "", cover_image: "" });
      fetchAll();
    } catch { toast.error("Erro ao guardar post."); }
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setPostForm({ title: post.title, content: post.content, category: post.category, excerpt: post.excerpt || "", cover_image: post.cover_image || "" });
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Tens a certeza?")) return;
    try {
      await axios.delete(`${API}/api/posts/${id}`, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Post eliminado!");
      fetchAll();
    } catch { toast.error("Erro ao eliminar."); }
  };

  // Gallery
  const handleCreateGallery = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/gallery`, galleryForm, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Imagem adicionada!");
      setGalleryForm({ title: "", description: "", image_url: "", category: "" });
      fetchAll();
    } catch { toast.error("Erro ao adicionar imagem."); }
  };

  const handleDeleteGallery = async (id) => {
    try {
      await axios.delete(`${API}/api/gallery/${id}`, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Imagem removida!");
      fetchAll();
    } catch { toast.error("Erro ao remover."); }
  };

  // Timeline
  const handleCreateTimeline = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/timeline`, timelineForm, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Evento adicionado!");
      setTimelineForm({ date: "", title: "", description: "" });
      fetchAll();
    } catch { toast.error("Erro ao adicionar evento."); }
  };

  const handleDeleteTimeline = async (id) => {
    try {
      await axios.delete(`${API}/api/timeline/${id}`, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Evento removido!");
      fetchAll();
    } catch { toast.error("Erro ao remover."); }
  };

  // Team
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/team`, teamForm, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Membro adicionado!");
      setTeamForm({ name: "", role: "", description: "", image_url: "" });
      fetchAll();
    } catch { toast.error("Erro ao adicionar membro."); }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await axios.delete(`${API}/api/team/${id}`, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Membro removido!");
      fetchAll();
    } catch { toast.error("Erro ao remover."); }
  };

  // Comments
  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`${API}/api/comments/${id}`, { headers: getAuthHeaders(), withCredentials: true });
      toast.success("Comentário removido!");
      fetchAll();
    } catch { toast.error("Erro ao remover."); }
  };

  const inputClass = "w-full bg-transparent border-b border-[#7C3A00]/30 py-2 text-sm text-[#2D1A11] focus:border-[#722F37] focus:outline-none transition-colors";
  const btnClass = "bg-[#722F37] text-[#FDFBF7] px-6 py-2 hover:bg-[#5A252B] transition-colors font-medium text-sm inline-flex items-center gap-2";

  return (
    <div className="pt-16 min-h-screen bg-[#FDFBF7]" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-2">Painel de Administração</p>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#2D1A11]">
            Bem-vindo, {user?.name || "Admin"}
          </h1>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-[#F4F0E6] border border-[#E5DCD0] mb-8">
            <TabsTrigger value="posts" data-testid="tab-posts">Trabalhos ({posts.length})</TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery">Galeria ({gallery.length})</TabsTrigger>
            <TabsTrigger value="timeline" data-testid="tab-timeline">Cronologia ({timeline.length})</TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">Equipa ({team.length})</TabsTrigger>
            <TabsTrigger value="comments" data-testid="tab-comments">Comentários ({comments.length})</TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <form onSubmit={handleCreatePost} className="bg-[#F4F0E6] p-6 mb-8 space-y-4" data-testid="post-form">
              <h3 className="font-semibold text-[#2D1A11] mb-2">{editingPost ? "Editar Trabalho" : "Novo Trabalho"}</h3>
              <input placeholder="Título" value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} className={inputClass} required data-testid="post-title-input" />
              <select value={postForm.category} onChange={(e) => setPostForm({...postForm, category: e.target.value})} className={inputClass} required data-testid="post-category-select">
                <option value="">Selecionar categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Resumo" value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} className={inputClass} data-testid="post-excerpt-input" />
              <input placeholder="URL da imagem de capa" value={postForm.cover_image} onChange={(e) => setPostForm({...postForm, cover_image: e.target.value})} className={inputClass} data-testid="post-image-input" />
              <textarea placeholder="Conteúdo" value={postForm.content} onChange={(e) => setPostForm({...postForm, content: e.target.value})} rows={6} className={`${inputClass} resize-none`} required data-testid="post-content-input" />
              <div className="flex gap-4">
                <button type="submit" className={btnClass} data-testid="post-submit-btn"><Plus size={14} /> {editingPost ? "Atualizar" : "Criar"}</button>
                {editingPost && <button type="button" onClick={() => { setEditingPost(null); setPostForm({ title: "", content: "", category: "", excerpt: "", cover_image: "" }); }} className="text-sm text-[#5C4A41] hover:text-[#722F37]">Cancelar</button>}
              </div>
            </form>
            <div className="space-y-3">
              {posts.map(post => (
                <div key={post.id} className="flex items-center justify-between p-4 border-b border-[#E5DCD0]" data-testid={`admin-post-${post.id}`}>
                  <div>
                    <h4 className="font-medium text-[#2D1A11]">{post.title}</h4>
                    <p className="text-xs text-[#5C4A41]">{categories.find(c => c.id === post.category)?.name} &middot; {new Date(post.created_at).toLocaleDateString('pt-PT')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditPost(post)} className="p-2 text-[#5C4A41] hover:text-[#722F37]" data-testid={`edit-post-${post.id}`}><Edit size={16} /></button>
                    <button onClick={() => handleDeletePost(post.id)} className="p-2 text-[#5C4A41] hover:text-red-600" data-testid={`delete-post-${post.id}`}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <form onSubmit={handleCreateGallery} className="bg-[#F4F0E6] p-6 mb-8 space-y-4" data-testid="gallery-form">
              <h3 className="font-semibold text-[#2D1A11] mb-2">Nova Imagem</h3>
              <input placeholder="Título" value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} className={inputClass} required data-testid="gallery-title-input" />
              <input placeholder="Descrição" value={galleryForm.description} onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})} className={inputClass} data-testid="gallery-desc-input" />
              <input placeholder="URL da imagem" value={galleryForm.image_url} onChange={(e) => setGalleryForm({...galleryForm, image_url: e.target.value})} className={inputClass} required data-testid="gallery-url-input" />
              <button type="submit" className={btnClass} data-testid="gallery-submit-btn"><Plus size={14} /> Adicionar</button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="relative group" data-testid={`admin-gallery-${item.id}`}>
                  <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover" />
                  <button onClick={() => handleDeleteGallery(item.id)} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                  <p className="text-xs text-[#5C4A41] mt-1 truncate">{item.title}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <form onSubmit={handleCreateTimeline} className="bg-[#F4F0E6] p-6 mb-8 space-y-4" data-testid="timeline-form">
              <h3 className="font-semibold text-[#2D1A11] mb-2">Novo Evento</h3>
              <input type="date" value={timelineForm.date} onChange={(e) => setTimelineForm({...timelineForm, date: e.target.value})} className={inputClass} required data-testid="timeline-date-input" />
              <input placeholder="Título" value={timelineForm.title} onChange={(e) => setTimelineForm({...timelineForm, title: e.target.value})} className={inputClass} required data-testid="timeline-title-input" />
              <textarea placeholder="Descrição" value={timelineForm.description} onChange={(e) => setTimelineForm({...timelineForm, description: e.target.value})} rows={3} className={`${inputClass} resize-none`} required data-testid="timeline-desc-input" />
              <button type="submit" className={btnClass} data-testid="timeline-submit-btn"><Plus size={14} /> Adicionar</button>
            </form>
            <div className="space-y-3">
              {timeline.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border-b border-[#E5DCD0]" data-testid={`admin-timeline-${event.id}`}>
                  <div>
                    <h4 className="font-medium text-[#2D1A11]">{event.title}</h4>
                    <p className="text-xs text-[#5C4A41]">{event.date}</p>
                  </div>
                  <button onClick={() => handleDeleteTimeline(event.id)} className="p-2 text-[#5C4A41] hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <form onSubmit={handleCreateTeam} className="bg-[#F4F0E6] p-6 mb-8 space-y-4" data-testid="team-form">
              <h3 className="font-semibold text-[#2D1A11] mb-2">Novo Membro</h3>
              <input placeholder="Nome" value={teamForm.name} onChange={(e) => setTeamForm({...teamForm, name: e.target.value})} className={inputClass} required data-testid="team-name-input" />
              <input placeholder="Função (ex: Investigador, Redator)" value={teamForm.role} onChange={(e) => setTeamForm({...teamForm, role: e.target.value})} className={inputClass} required data-testid="team-role-input" />
              <input placeholder="Descrição (opcional)" value={teamForm.description} onChange={(e) => setTeamForm({...teamForm, description: e.target.value})} className={inputClass} data-testid="team-desc-input" />
              <input placeholder="URL da foto (opcional)" value={teamForm.image_url} onChange={(e) => setTeamForm({...teamForm, image_url: e.target.value})} className={inputClass} data-testid="team-image-input" />
              <button type="submit" className={btnClass} data-testid="team-submit-btn"><Plus size={14} /> Adicionar</button>
            </form>
            <div className="space-y-3">
              {team.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border-b border-[#E5DCD0]" data-testid={`admin-team-${member.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#722F37] text-[#FDFBF7] flex items-center justify-center text-xs font-bold">{member.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-medium text-[#2D1A11]">{member.name}</h4>
                      <p className="text-xs text-[#5C4A41]">{member.role}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTeam(member.id)} className="p-2 text-[#5C4A41] hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments">
            <div className="space-y-3" data-testid="admin-comments-list">
              {comments.length === 0 ? (
                <p className="text-[#5C4A41] text-sm py-8 text-center">Ainda não há comentários.</p>
              ) : comments.map(comment => (
                <div key={comment.id} className="flex items-start justify-between p-4 border-b border-[#E5DCD0]" data-testid={`admin-comment-${comment.id}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-[#2D1A11]">{comment.name}</span>
                      <span className="text-xs text-[#5C4A41]/60">{new Date(comment.created_at).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <p className="text-sm text-[#5C4A41]">{comment.message}</p>
                    {comment.post_id && <p className="text-xs text-[#7C3A00] mt-1">Post: {comment.post_id}</p>}
                  </div>
                  <button onClick={() => handleDeleteComment(comment.id)} className="p-2 text-[#5C4A41] hover:text-red-600 flex-shrink-0"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

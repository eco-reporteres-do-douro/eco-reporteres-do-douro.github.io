import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import staticData from "../data/static-posts.json";

const API = process.env.REACT_APP_BACKEND_URL;

const categoryImages = {
  "museu-do-douro": "https://customer-assets.emergentagent.com/job_douro-class-7e/artifacts/4rl916vj_IMG_9080.JPG",
  "paisagem": "https://images.pexels.com/photos/32906683/pexels-photo-32906683.jpeg",
  "gastronomia": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
  "historia": "https://images.pexels.com/photos/34930529/pexels-photo-34930529.jpeg",
  "cultura": "https://images.unsplash.com/photo-1614807254023-133d1a7a3c41",
  "outros": "https://images.pexels.com/photos/20095795/pexels-photo-20095795.jpeg",
};

export default function WorksPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const [postsRes, catsRes] = await Promise.all([
        axios.get(`${API}/api/posts${category ? `?category=${category}` : ""}`),
        axios.get(`${API}/api/categories`),
      ]);
      const fetchedPosts = Array.isArray(postsRes.data) ? postsRes.data : [];
      const fetchedCategories = Array.isArray(catsRes.data) ? catsRes.data : [];

      // If backend returned no posts, fall back to static data
      if (fetchedPosts.length === 0) {
        const fallbackPosts = category
          ? staticData.posts.filter(p => p.category === category)
          : staticData.posts;
        setPosts(fallbackPosts);
      } else {
        setPosts(fetchedPosts);
      }

      setCategories(fetchedCategories.length ? fetchedCategories : staticData.categories);
    } catch (err) {
      // On error (no backend), use static data
      console.warn("Backend unreachable — using static posts fallback", err);
      const fallbackPosts = category
        ? staticData.posts.filter(p => p.category === category)
        : staticData.posts;
      setPosts(fallbackPosts);
      setCategories(staticData.categories);
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(c => c.id === category);

  return (
    <div className="pt-16" data-testid="works-page">
      {/* Header */}
      <section className="py-24 md:py-32 bg-[#F4F0E6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">
            {currentCategory ? "Tema" : "Todos os Temas"}
          </p>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#2D1A11] tracking-tighter leading-none mb-6">
            {currentCategory ? currentCategory.name : "Trabalhos"}
          </h1>
          {currentCategory && (
            <p className="text-base md:text-lg text-[#5C4A41]">{currentCategory.description}</p>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-[#E5DCD0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-4" data-testid="category-filter">
            <Link
              to="/trabalhos"
              className={`text-sm px-4 py-2 transition-colors ${!category ? "bg-[#722F37] text-[#FDFBF7]" : "text-[#5C4A41] hover:text-[#722F37]"}`}
              data-testid="filter-all"
            >
              Todos
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/trabalhos/${cat.id}`}
                className={`text-sm px-4 py-2 transition-colors ${category === cat.id ? "bg-[#722F37] text-[#FDFBF7]" : "text-[#5C4A41] hover:text-[#722F37]"}`}
                data-testid={`filter-${cat.id}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center text-[#5C4A41]">A carregar...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#5C4A41] text-lg">Ainda não há trabalhos nesta categoria.</p>
              <p className="text-[#5C4A41]/60 text-sm mt-2">Os trabalhos serão adicionados em breve.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="group opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}
                  data-testid={`post-card-${post.id}`}
                >
                  <div className="overflow-hidden h-56 mb-4">
                    <img
                      src={post.cover_image || categoryImages[post.category] || categoryImages.outros}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs tracking-[0.15em] uppercase text-[#7C3A00] mb-2">
                    {categories.find(c => c.id === post.category)?.name || post.category}
                  </p>
                  <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#2D1A11] mb-2 group-hover:text-[#722F37] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#5C4A41] line-clamp-2 mb-3">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-[#722F37] font-medium group-hover:gap-2 transition-all">
                    Ler mais <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

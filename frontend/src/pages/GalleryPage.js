import React, { useState, useEffect } from "react";
import axios from "axios";
import staticData from "../data/static-posts.json";
import Lightbox from "../components/Lightbox";

const API = process.env.REACT_APP_BACKEND_URL;

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data } = await axios.get(`${API}/api/gallery`);
      setItems(data);
    } catch (err) {
      console.warn("Backend unreachable — using static gallery fallback", err);
      setItems(staticData.gallery || []);
    } finally {
      setLoading(false);
    }
  };

  // Default gallery items if none exist
  const defaultItems = [
    { id: "1", title: "Vale do Douro", description: "Vista panorâmica do vale", image_url: "https://images.pexels.com/photos/20095795/pexels-photo-20095795.jpeg" },
    { id: "2", title: "Vinhas em socalcos", description: "Os famosos terraços do Douro", image_url: "https://images.pexels.com/photos/32906683/pexels-photo-32906683.jpeg" },
    { id: "3", title: "Azulejos portugueses", description: "Arte tradicional portuguesa", image_url: "https://images.unsplash.com/photo-1614807254023-133d1a7a3c41" },
    { id: "4", title: "Vinho do Porto", description: "A tradição vinhateira", image_url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb" },
    { id: "5", title: "Museu do Douro", description: "Um espaço de cultura", image_url: "https://images.pexels.com/photos/34930529/pexels-photo-34930529.jpeg" },
  ];

  const displayItems = items.length > 0 ? items : (staticData.gallery && staticData.gallery.length > 0 ? staticData.gallery : defaultItems);

  return (
    <div className="pt-16" data-testid="gallery-page">
      {/* Header */}
      <section className="py-24 md:py-32 bg-[#F4F0E6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Galeria</p>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#2D1A11] tracking-tighter leading-none">
            Galeria de Fotos
          </h1>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center text-[#5C4A41]">A carregar...</div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4" data-testid="gallery-grid">
              {displayItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="break-inside-avoid group overflow-hidden opacity-0 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}
                  data-testid={`gallery-item-${item.id}`}
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#2D1A11]/0 group-hover:bg-[#2D1A11]/40 transition-colors duration-300 flex items-end">
                      <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#FDFBF7]">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-[#F4F0E6]/80 mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lightboxOpen && (
          <Lightbox images={displayItems} initialIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />
        )}
      </section>
    </div>
  );
}

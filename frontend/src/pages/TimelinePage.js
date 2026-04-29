import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const { data } = await axios.get(`${API}/api/timeline`);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16" data-testid="timeline-page">
      {/* Header */}
      <section className="py-24 md:py-32 bg-[#F4F0E6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Cronologia</p>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#2D1A11] tracking-tighter leading-none">
            O nosso percurso
          </h1>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center text-[#5C4A41]">A carregar...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#5C4A41]">A cronologia será adicionada em breve.</p>
            </div>
          ) : (
            <div className="relative" data-testid="timeline-content">
              {/* Vertical line */}
              <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-[#7C3A00]/30" />

              <div className="space-y-12">
                {events.map((event, idx) => (
                  <div
                    key={event.id}
                    className="relative pl-12 md:pl-16 opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: 'forwards' }}
                    data-testid={`timeline-event-${event.id}`}
                  >
                    {/* Node */}
                    <div className="absolute left-2.5 md:left-4.5 top-1 w-3 h-3 rounded-full border-2 border-[#7C3A00] bg-[#FDFBF7]" />

                    <div>
                      <p className="text-xs tracking-[0.15em] uppercase font-semibold text-[#7C3A00] mb-1">
                        {new Date(event.date).toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <h3 className="font-['Playfair_Display'] text-xl md:text-2xl font-semibold text-[#2D1A11] mb-2">
                        {event.title}
                      </h3>
                      <p className="text-base text-[#5C4A41] leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

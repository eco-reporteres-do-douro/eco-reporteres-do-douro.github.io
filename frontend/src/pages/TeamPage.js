import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const { data } = await axios.get(`${API}/api/team`);
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16" data-testid="team-page">
      {/* Header */}
      <section className="py-24 md:py-32 bg-[#F4F0E6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Equipa</p>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#2D1A11] tracking-tighter leading-none mb-6">
            A nossa equipa
          </h1>
          <p className="text-base md:text-lg text-[#5C4A41] max-w-2xl">
            Conheçam os membros da turma 7.E que contribuíram para este projeto.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center text-[#5C4A41]">A carregar...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-16" data-testid="team-empty">
              <p className="text-[#5C4A41] text-lg mb-2">A equipa será apresentada em breve.</p>
              <p className="text-[#5C4A41]/60 text-sm">Os membros podem ser adicionados no painel de administração.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="team-grid">
              {members.map((member, idx) => (
                <div
                  key={member.id}
                  className="text-center opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}
                  data-testid={`team-member-${member.id}`}
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-[#F4F0E6]">
                    {member.image_url ? (
                      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#722F37] text-[#FDFBF7] font-['Playfair_Display'] text-2xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#2D1A11]">{member.name}</h3>
                  <p className="text-xs tracking-[0.1em] uppercase text-[#7C3A00] mt-1">{member.role}</p>
                  {member.description && (
                    <p className="text-sm text-[#5C4A41] mt-2">{member.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

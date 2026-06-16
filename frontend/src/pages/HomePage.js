import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="pt-16" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/20095795/pexels-photo-20095795.jpeg"
            alt="Vale do Douro"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D1A11]/80 via-[#2D1A11]/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-32">
          <div className="max-w-2xl">
            <p className="text-xs md:text-sm tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
              Projeto Turma 7.E
            </p>
            <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl font-bold text-[#FDFBF7] leading-none tracking-tighter mb-6 opacity-0 animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
              Na descoberta<br />do Douro
            </h1>
            <p className="text-base md:text-lg text-[#F4F0E6]/80 leading-relaxed mb-8 max-w-lg opacity-0 animate-fade-in-up" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
              Exploramos a história, a cultura, a paisagem e as tradições de uma das regiões mais fascinantes de Portugal.
            </p>
            <div className="flex gap-4 opacity-0 animate-fade-in-up" style={{animationDelay: '0.7s', animationFillMode: 'forwards'}}>
              <Link
                to="/trabalhos"
                className="inline-flex items-center gap-2 bg-[#722F37] text-[#FDFBF7] px-8 py-3 hover:bg-[#5A252B] transition-colors font-medium text-sm"
                data-testid="hero-cta-button"
              >
                Ver Trabalhos <ArrowRight size={16} />
              </Link>
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 border border-[#FDFBF7]/40 text-[#FDFBF7] px-8 py-3 hover:bg-[#FDFBF7]/10 transition-colors font-medium text-sm"
                data-testid="hero-about-button"
              >
                Sobre Nós
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 md:py-32" data-testid="about-preview-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Quem Somos</p>
              <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#2D1A11] tracking-tight leading-tight mb-6">
                Turma 7.E
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-[#5C4A41] mb-8">
                Somos a turma do 7.E, um grupo que comeou o seu percurso em conjunto apenas este ano. 
                Apesar de estarmos juntos há pouco tempo, já conseguimos criar um espírito de união e de entreajuda que nos caracteriza.
              </p>
              <Link
                to="/sobre"
                className="inline-flex items-center gap-2 text-[#722F37] font-medium text-sm hover:gap-3 transition-all"
                data-testid="about-read-more"
              >
                Saber mais <ArrowRight size={16} />
              </Link>
            </div>
            <div className="overflow-hidden bg-[#F4F0E6] h-80 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#722F37] flex items-center justify-center">
                  <span className="font-['Playfair_Display'] text-3xl font-bold text-[#FDFBF7]">7.E</span>
                </div>
                <p className="text-sm text-[#5C4A41]">Turma 7.E &mdash; Unidos pela descoberta</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Themes Preview */}
      <section className="py-24 md:py-32 bg-[#F4F0E6]" data-testid="themes-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Temas</p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#2D1A11] tracking-tight leading-tight mb-12">
            Os nossos trabalhos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-6">
            {/* Bento Grid Items */}
            <Link to="/trabalhos/museu-do-douro" className="md:col-span-4 lg:col-span-5 group" data-testid="theme-museu">
              <div className="overflow-hidden h-80 relative">
                <img
                  src="https://customer-assets.emergentagent.com/job_douro-class-7e/artifacts/4rl916vj_IMG_9080.JPG"
                  alt="Museu do Douro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A11]/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#F4F0E6]/70 mb-1">Tema</p>
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#FDFBF7]">Museu do Douro</h3>
                </div>
              </div>
            </Link>
            <Link to="/trabalhos/paisagem" className="md:col-span-4 lg:col-span-7 group" data-testid="theme-paisagem">
              <div className="overflow-hidden h-80 relative">
                <img
                  src="https://images.pexels.com/photos/32906683/pexels-photo-32906683.jpeg"
                  alt="Paisagem do Douro"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A11]/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#F4F0E6]/70 mb-1">Tema</p>
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#FDFBF7]">Paisagem</h3>
                </div>
              </div>
            </Link>
            <Link to="/trabalhos/gastronomia" className="md:col-span-4 lg:col-span-4 group" data-testid="theme-gastronomia">
              <div className="overflow-hidden h-64 relative">
                <img
                  src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb"
                  alt="Gastronomia"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A11]/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#F4F0E6]/70 mb-1">Tema</p>
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#FDFBF7]">Gastronomia</h3>
                </div>
              </div>
            </Link>
            <Link to="/trabalhos/historia" className="md:col-span-4 lg:col-span-4 group" data-testid="theme-historia">
              <div className="overflow-hidden h-64 relative bg-[#722F37]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-xs tracking-[0.15em] uppercase text-[#F4F0E6]/70 mb-1">Tema</p>
                    <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#FDFBF7]">História</h3>
                    <p className="text-sm text-[#F4F0E6]/60 mt-2">Tradições e património</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/trabalhos/cultura" className="md:col-span-4 lg:col-span-4 group" data-testid="theme-cultura">
              <div className="overflow-hidden h-64 relative bg-[#7C3A00]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-xs tracking-[0.15em] uppercase text-[#F4F0E6]/70 mb-1">Tema</p>
                    <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#FDFBF7]">Cultura</h3>
                    <p className="text-sm text-[#F4F0E6]/60 mt-2">Arte e cultura do Douro</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/trabalhos/ciencias" className="md:col-span-4 lg:col-span-6 group" data-testid="theme-ciencias">
              <div className="overflow-hidden h-64 relative">
                <img
                  src="https://images.unsplash.com/photo-1604850849447-6435708cb130?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxzY2hpc3QlMjByb2NrcyUyMHZpbmV5YXJkJTIwUG9ydHVnYWx8ZW58MHx8fHwxNzgxNjE1ODk0fDA&ixlib=rb-4.1.0&q=85"
                  alt="Ciências"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A11]/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#F4F0E6]/70 mb-1">Tema</p>
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#FDFBF7]">Ciências</h3>
                </div>
              </div>
            </Link>
            <Link to="/trabalhos/matematica" className="md:col-span-4 lg:col-span-6 group" data-testid="theme-matematica">
              <div className="overflow-hidden h-64 relative">
                <img
                  src="https://customer-assets.emergentagent.com/job_douro-class-7e/artifacts/ggum7bxs_IMG_9954.jpeg"
                  alt="Matemática"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A11]/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs tracking-[0.15em] uppercase text-[#F4F0E6]/70 mb-1">Tema</p>
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#FDFBF7]">Matemática</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-[#2D1A11] tracking-tight mb-6">
            Acompanhe o nosso projeto
          </h2>
          <p className="text-base md:text-lg text-[#5C4A41] mb-8 max-w-xl mx-auto">
            Deixe o seu comentário, explore a nossa galeria e descubra a cronologia do projeto.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/galeria" className="bg-[#722F37] text-[#FDFBF7] px-8 py-3 hover:bg-[#5A252B] transition-colors font-medium text-sm" data-testid="cta-gallery">
              Galeria
            </Link>
            <Link to="/cronologia" className="border border-[#722F37] text-[#722F37] px-8 py-3 hover:bg-[#722F37] hover:text-[#FDFBF7] transition-colors font-medium text-sm" data-testid="cta-timeline">
              Cronologia
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

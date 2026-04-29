import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#2D1A11] text-[#F4F0E6] py-16" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#FDFBF7] mb-4">Douro 7.E</h3>
            <p className="text-sm text-[#F4F0E6]/70 leading-relaxed">
              Um projeto da turma 7.E dedicado a explorar e partilhar as maravilhas do Douro.
            </p>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Navegação</h4>
            <div className="space-y-2">
              <Link to="/sobre" className="block text-sm text-[#F4F0E6]/70 hover:text-[#FDFBF7] transition-colors">Sobre Nós</Link>
              <Link to="/trabalhos" className="block text-sm text-[#F4F0E6]/70 hover:text-[#FDFBF7] transition-colors">Trabalhos</Link>
              <Link to="/galeria" className="block text-sm text-[#F4F0E6]/70 hover:text-[#FDFBF7] transition-colors">Galeria</Link>
              <Link to="/cronologia" className="block text-sm text-[#F4F0E6]/70 hover:text-[#FDFBF7] transition-colors">Cronologia</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Projeto Escolar</h4>
            <p className="text-sm text-[#F4F0E6]/70 leading-relaxed">
              Este blogue é um projeto educativo da turma 7.E, desenvolvido no âmbito do estudo da região do Douro.
            </p>
            <Link to="/login" className="inline-block mt-4 text-xs text-[#F4F0E6]/40 hover:text-[#F4F0E6]/60 transition-colors" data-testid="admin-login-link">
              Administração
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#F4F0E6]/10 text-center text-xs text-[#F4F0E6]/40">
          &copy; 2025 Turma 7.E &mdash; Projeto Douro
        </div>
      </div>
    </footer>
  );
}

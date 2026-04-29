import React from "react";

export default function AboutPage() {
  return (
    <div className="pt-16" data-testid="about-page">
      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#F4F0E6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-[#7C3A00] mb-4">Sobre Nós</p>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#2D1A11] tracking-tighter leading-none mb-8">
            Turma 7.E
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none">
                <p className="text-base md:text-lg leading-relaxed text-[#5C4A41] mb-6">
                  Somos a turma do 7.E, um grupo que começou o seu percurso em conjunto apenas este ano. Apesar de estarmos juntos há pouco tempo, já conseguimos criar um espírito de união e de entreajuda que nos caracteriza. Somos uma turma criativa, com vontade de aprender, partilhar ideias e crescer em conjunto.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#5C4A41] mb-6">
                  Decidimos participar neste projeto porque consideramos que é uma excelente forma de dar a conhecer a nossa cidade a todos os interessados. Através do nosso blogue, queremos explorar, descobrir e partilhar curiosidades, tradições e aspetos importantes do local onde vivemos.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-[#5C4A41]">
                  Este projeto representa não só uma oportunidade de aprendizagem, mas também uma forma de trabalharmos em equipa e mostrarmos aquilo de que somos capazes.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="overflow-hidden bg-[#722F37] flex items-center justify-center py-16">
                  <div className="text-center">
                    <span className="font-['Playfair_Display'] text-6xl font-bold text-[#FDFBF7]">7.E</span>
                    <p className="text-sm text-[#F4F0E6]/70 mt-3">Turma 7.E</p>
                  </div>
                </div>
                <div className="mt-8 p-6 bg-[#F4F0E6]">
                  <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#2D1A11] mb-3">O Projeto</h3>
                  <ul className="space-y-2 text-sm text-[#5C4A41]">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#722F37] mt-2 flex-shrink-0" />
                      Exploração da região do Douro
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#722F37] mt-2 flex-shrink-0" />
                      Visitas de estudo e pesquisa
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#722F37] mt-2 flex-shrink-0" />
                      Trabalho colaborativo em equipa
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#722F37] mt-2 flex-shrink-0" />
                      Partilha de descobertas e conhecimento
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

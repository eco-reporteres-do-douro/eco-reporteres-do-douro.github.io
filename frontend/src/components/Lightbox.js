import React, { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, handlePrev, handleNext]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#2D1A11]/95 flex items-center justify-center"
      onClick={onClose}
      data-testid="lightbox-overlay"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#FDFBF7]/80 hover:text-[#FDFBF7] z-10"
        data-testid="lightbox-close"
      >
        <X size={28} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 md:left-8 text-[#FDFBF7]/60 hover:text-[#FDFBF7] z-10"
            data-testid="lightbox-prev"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 md:right-8 text-[#FDFBF7]/60 hover:text-[#FDFBF7] z-10"
            data-testid="lightbox-next"
          >
            <ChevronRight size={36} />
          </button>
        </>
      )}

      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={typeof images[currentIndex] === "string" ? images[currentIndex] : images[currentIndex]?.image_url}
          alt={`Foto ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain"
          data-testid="lightbox-image"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#FDFBF7]/60 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

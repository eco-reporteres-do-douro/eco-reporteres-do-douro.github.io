import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Início" },
    { path: "/sobre", label: "Sobre Nós" },
    { path: "/trabalhos", label: "Trabalhos" },
    { path: "/galeria", label: "Galeria" },
    { path: "/cronologia", label: "Cronologia" },
    { path: "/equipa", label: "Equipa" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FDFBF7]/80 border-b border-[#E5DCD0]/50" data-testid="main-header">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-['Playfair_Display'] text-xl font-bold text-[#722F37] hover:opacity-80 transition-opacity" data-testid="logo-link">
            Douro 7.E
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#722F37] ${
                  isActive(link.path) ? "text-[#722F37]" : "text-[#5C4A41]"
                }`}
                data-testid={`nav-link-${link.path.replace("/", "") || "home"}`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/admin" className="text-sm font-medium text-[#722F37] flex items-center gap-1" data-testid="admin-dashboard-link">
                  <LayoutDashboard size={14} /> Painel
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-[#5C4A41] hover:text-[#722F37] flex items-center gap-1" data-testid="logout-button">
                  <LogOut size={14} /> Sair
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#2D1A11]"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-[#E5DCD0]/50" data-testid="mobile-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.path) ? "text-[#722F37]" : "text-[#5C4A41]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-[#722F37]">Painel</Link>
                <button onClick={handleLogout} className="block py-2 text-sm font-medium text-[#5C4A41]">Sair</button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

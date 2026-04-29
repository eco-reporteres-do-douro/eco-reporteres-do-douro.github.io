import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/admin");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login efetuado com sucesso!");
      navigate("/admin");
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : Array.isArray(detail) ? detail.map(e => e.msg || JSON.stringify(e)).join(" ") : "Erro ao fazer login.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center" data-testid="login-page">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-12">
          <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#2D1A11] mb-2">Administração</h1>
          <p className="text-sm text-[#5C4A41]">Acesso reservado à equipa do projeto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 border border-red-200" data-testid="login-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-semibold text-[#5C4A41] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#7C3A00]/30 py-3 text-[#2D1A11] focus:border-[#722F37] focus:outline-none transition-colors"
              placeholder="email@exemplo.pt"
              required
              data-testid="login-email-input"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.1em] uppercase font-semibold text-[#5C4A41] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[#7C3A00]/30 py-3 text-[#2D1A11] focus:border-[#722F37] focus:outline-none transition-colors"
              placeholder="Introduza a password"
              required
              data-testid="login-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#722F37] text-[#FDFBF7] py-3 hover:bg-[#5A252B] transition-colors font-medium text-sm disabled:opacity-50"
            data-testid="login-submit-button"
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import WorksPage from "./pages/WorksPage";
import PostPage from "./pages/PostPage";
import GalleryPage from "./pages/GalleryPage";
import TimelinePage from "./pages/TimelinePage";
import TeamPage from "./pages/TeamPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col" data-testid="app-container">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/trabalhos" element={<WorksPage />} />
              <Route path="/trabalhos/:category" element={<WorksPage />} />
              <Route path="/post/:postId" element={<PostPage />} />
              <Route path="/galeria" element={<GalleryPage />} />
              <Route path="/cronologia" element={<TimelinePage />} />
              <Route path="/equipa" element={<TeamPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

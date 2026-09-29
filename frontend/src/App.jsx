import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { MusicPlayerProvider } from "./context/MusicPlayerContext";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import Sidebar from "./components/Sidebar";
import ArtistSidebar from "./components/ArtistSidebar";
import AdminSidebar from "./components/AdminSidebar";

import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";

import Home from "./pages/Home";
import Songs from "./pages/Songs";
import Playlists from "./pages/Playlists";
import LikedSongs from "./pages/LikedSongs";

import UserProfilePage from "./pages/profilepage";
import ArtistProfilePage from "./pages/artist/ProfilePage";

import SettingPage from "./pages/SettingPage";

import ArtistHome from "./pages/artist/ArtistHome";
import UploadSong from "./pages/artist/UploadSong";
import MySongs from "./pages/artist/MySongs";

import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminArtists from "./pages/admin/AdminArtists";
import AdminSongs from "./pages/admin/AdminSongs";

import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import LoginPage from "./pages/artist/LoginPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicPlayerProvider>
          <Routes>

            {/* ================= AUTH ================= */}

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/verify-otp"
              element={<VerifyOtp />}
            />


            {/* ================= USER HOME ================= */}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <Home />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </ProtectedRoute>
              }
            />


            {/* ================= SONGS ================= */}

            <Route
              path="/songs"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <Songs />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </ProtectedRoute>
              }
            />


            {/* ================= PLAYLISTS ================= */}

            <Route
              path="/playlists"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <Playlists />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </ProtectedRoute>
              }
            />


            {/* ================= LIKED SONGS ================= */}

            <Route
              path="/liked-songs"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <LikedSongs />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </ProtectedRoute>
              }
            />


            {/* ================= USER PROFILE ================= */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <UserProfilePage />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </ProtectedRoute>
              }
            />


            {/* ================= SETTINGS ================= */}

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <SettingPage />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </ProtectedRoute>
              }
            />


            {/* ================= ARTIST HOME ================= */}

            <Route
              path="/artist"
              element={
                <RoleProtectedRoute role="artist">
                  <>
                    <ArtistSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <ArtistHome />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ARTIST UPLOAD ================= */}

            <Route
              path="/artist/upload"
              element={
                <RoleProtectedRoute role="artist">
                  <>
                    <ArtistSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <UploadSong />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ARTIST SONGS ================= */}

            <Route
              path="/artist/songs"
              element={
                <RoleProtectedRoute role="artist">
                  <>
                    <ArtistSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <MySongs />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ARTIST PROFILE ================= */}

            <Route
              path="/artist/profile"
              element={
                <RoleProtectedRoute role="artist">
                  <>
                    <ArtistSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <ArtistProfilePage />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ADMIN DASHBOARD ================= */}

            <Route
              path="/admin"
              element={
                <RoleProtectedRoute role="admin">
                  <>
                    <AdminSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <AdminHome />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ADMIN PROFILE ================= */}

            <Route
              path="/admin/profile"
              element={
                <RoleProtectedRoute role="admin">
                  <>
                    <AdminSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <UserProfilePage />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ADMIN USERS ================= */}

            <Route
              path="/admin/users"
              element={
                <RoleProtectedRoute role="admin">
                  <>
                    <AdminSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <AdminUsers />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ADMIN ARTISTS ================= */}

            <Route
              path="/admin/artists"
              element={
                <RoleProtectedRoute role="admin">
                  <>
                    <AdminSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <AdminArtists />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />


            {/* ================= ADMIN SONGS ================= */}

            <Route
              path="/admin/songs"
              element={
                <RoleProtectedRoute role="admin">
                  <>
                    <AdminSidebar
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />

                    <main className="min-h-screen bg-black pl-0 lg:pl-64">
                      <Navbar
                        onMenuClick={() => setSidebarOpen(true)}
                      />

                      <div className="p-4 pb-32 sm:p-6">
                        <AdminSongs />
                      </div>
                    </main>

                    <MusicPlayer />
                  </>
                </RoleProtectedRoute>
              }
            />

          </Routes>
        </MusicPlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
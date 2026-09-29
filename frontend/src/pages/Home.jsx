import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Heart,
  Music2,
  Headphones,
  ListMusic,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const [listeningSeconds, setListeningSeconds] = useState(0);
  const [lastAudioTime, setLastAudioTime] = useState(null);

  // ================= CURRENT PLAYING =================

  const [playingSong, setPlayingSong] = useState({
    title: "Welcome to BeatFlow",
    audioUrl: "",
  });

  const formatListeningTime = () => {
    const hours = Math.floor(listeningSeconds / 3600);
    const minutes = Math.floor((listeningSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="w-full space-y-8 pb-28 text-white">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-900 p-5 sm:rounded-3xl sm:p-8 lg:p-10">

        <div className="relative z-10 max-w-2xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-purple-100 backdrop-blur">
            <Sparkles size={14} />
            Your personal music space
          </div>

          <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Your music.
            <br />
            Your mood.
            <br />
            Your flow.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
            Discover music, create playlists and enjoy your favorite tracks
            with BeatFlow.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() => navigate("/songs")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 sm:w-auto"
            >
              <Play size={17} fill="currentColor" />
              Start Listening
            </button>

            <button
              onClick={() => navigate("/playlists")}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
            >
              Explore Playlists
              <ArrowRight size={16} />
            </button>

          </div>
        </div>

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-white/10" />

        <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <Headphones size={55} className="text-white/80" />
            </div>
          </div>
        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-blue-500/30">

          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Headphones size={22} />
          </div>

          <p className="text-sm text-zinc-400">
            Listening Time
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {formatListeningTime()}
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            This session
          </p>

        </div>

      </section>


      {/* ================= CURRENT PLAYING ================= */}

      <section>

        <div className="mb-5">

          <h2 className="text-2xl font-bold">
            Current Playing
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your currently selected track
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Icon */}

            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">

              <Music2 size={28} />

            </div>


            {/* Song info */}

            <div className="min-w-0 flex-1">

              <p className="text-xs uppercase tracking-wider text-purple-400">
                Now Playing
              </p>

              <h3 className="mt-1 truncate text-lg font-semibold">
                {playingSong.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                BeatFlow Music
              </p>

            </div>


            {/* Player */}

            {playingSong.audioUrl ? (

              <audio
                controls
                autoPlay
                src={playingSong.audioUrl}
                className="w-full sm:w-64"
                onTimeUpdate={(e) => {

                  const currentTime =
                    e.currentTarget.currentTime;

                  if (lastAudioTime !== null) {

                    const difference =
                      currentTime - lastAudioTime;

                    if (
                      difference > 0 &&
                      difference < 2
                    ) {
                      setListeningSeconds(
                        (prev) => prev + difference
                      );
                    }
                  }

                  setLastAudioTime(currentTime);

                }}
                onPlay={(e) => {
                  setLastAudioTime(
                    e.currentTarget.currentTime
                  );
                }}
                onPause={() => {
                  setLastAudioTime(null);
                }}
                onEnded={() => {
                  setLastAudioTime(null);
                }}
              />

            ) : (

              <button
                onClick={() => navigate("/songs")}
                className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
              >
                <Play
                  size={16}
                  fill="currentColor"
                />
                Choose a Song
              </button>

            )}

          </div>

        </div>

      </section>


      {/* ================= QUICK ACCESS ================= */}

      <section>

        <div className="mb-5">

          <h2 className="text-xl font-bold sm:text-2xl">
            Quick Access
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Everything you need, right here
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Browse Songs */}

          <div
            onClick={() => navigate("/songs")}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-purple-500/40 hover:bg-zinc-800/70"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Music2 size={23} />
              </div>

              <ArrowRight
                size={18}
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-purple-400"
              />

            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Browse Songs
            </h3>

            <p className="mt-1 text-sm leading-5 text-zinc-500">
              Explore all available songs in your music library.
            </p>

          </div>


          {/* Playlists */}

          <div
            onClick={() => navigate("/playlists")}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-blue-500/40 hover:bg-zinc-800/70"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ListMusic size={23} />
              </div>

              <ArrowRight
                size={18}
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
              />

            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Your Playlists
            </h3>

            <p className="mt-1 text-sm leading-5 text-zinc-500">
              Create and manage your personal music playlists.
            </p>

          </div>


          {/* Liked Songs */}

          <div
            onClick={() => navigate("/liked-songs")}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900 p-5 transition hover:border-pink-500/40 hover:bg-zinc-800/70 sm:col-span-2 lg:col-span-1"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                <Heart size={23} />
              </div>

              <ArrowRight
                size={18}
                className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-pink-400"
              />

            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Liked Songs
            </h3>

            <p className="mt-1 text-sm leading-5 text-zinc-500">
              Keep your favorite songs in one place.
            </p>

          </div>

        </div>

      </section>


      {/* ================= DISCOVER ================= */}

      <section>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-8">

          <div className="relative z-10 max-w-2xl">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles size={22} />
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Discover something new
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Explore your music library and find tracks that match your mood.
              Your next favorite song might already be waiting for you.
            </p>

            <button
              onClick={() => navigate("/songs")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500 sm:w-auto"
            >
              Explore Music
              <ArrowRight size={17} />
            </button>

          </div>

          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-purple-600/10" />

          <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-indigo-600/10" />

        </div>

      </section>


      {/* ================= BOTTOM PLAYER ================= */}

      {playingSong.audioUrl && (

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-xl lg:left-64">

          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">

            <div className="w-full min-w-0 sm:w-48 sm:flex-shrink-0">

              <p className="truncate text-sm font-semibold">
                {playingSong.title}
              </p>

              <p className="truncate text-xs text-zinc-500">
                Music
              </p>

            </div>


            <audio
              controls
              autoPlay
              src={playingSong.audioUrl}
              className="w-full min-w-0 sm:flex-1"
              onTimeUpdate={(e) => {

                const currentTime =
                  e.currentTarget.currentTime;

                if (lastAudioTime !== null) {

                  const difference =
                    currentTime - lastAudioTime;

                  if (
                    difference > 0 &&
                    difference < 2
                  ) {
                    setListeningSeconds(
                      (prev) => prev + difference
                    );
                  }
                }

                setLastAudioTime(currentTime);

              }}
              onPlay={(e) => {
                setLastAudioTime(
                  e.currentTarget.currentTime
                );
              }}
              onPause={() => {
                setLastAudioTime(null);
              }}
              onEnded={() => {
                setLastAudioTime(null);
              }}
            />

          </div>

        </div>

      )}

    </div>
  );
};

export default Home;
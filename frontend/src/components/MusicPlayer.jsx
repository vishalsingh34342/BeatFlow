import { useEffect } from "react";
import { Pause, Play, X } from "lucide-react";
import { useMusicPlayer } from "../context/MusicPlayerContext";

const MusicPlayer = () => {
  const {
    audioRef,
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    stopSong,
  } = useMusicPlayer();

  useEffect(() => {
    if (!currentSong || !audioRef.current) {
      return;
    }

    audioRef.current.src = currentSong.audioUrl;

    audioRef.current
      .play()
      .catch((error) => {
        console.log("PLAY ERROR:", error);
      });

  }, [currentSong]);

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-xl lg:left-64">

      <div className="mx-auto flex max-w-7xl items-center gap-3 sm:gap-5">

        {/* SONG INFO */}

        <div className="min-w-0 flex-1">

          <p className="truncate text-sm font-semibold text-white">
            {currentSong.title}
          </p>

          <p className="truncate text-xs text-zinc-500">
            Music
          </p>

        </div>


        {/* AUDIO */}

        <audio
          ref={audioRef}
          controls
          className="w-40 sm:w-64 md:w-80"
          onPlay={resumeSong}
          onPause={pauseSong}
        />


        {/* PLAY / PAUSE */}

        <button
          onClick={() => {
            if (isPlaying) {
              pauseSong();
            } else {
              resumeSong();
            }
          }}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-white transition hover:bg-purple-500"
        >
          {isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play
              size={18}
              fill="currentColor"
            />
          )}
        </button>


        {/* STOP */}

        <button
          onClick={stopSong}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
        >
          <X size={18} />
        </button>

      </div>

    </div>
  );
};

export default MusicPlayer;
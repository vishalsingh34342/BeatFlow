import { createContext, useContext, useRef, useState } from "react";

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsPlaying(false);
  };

  const resumeSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }

    setIsPlaying(true);
  };

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        audioRef,
        currentSong,
        isPlaying,
        playSong,
        pauseSong,
        resumeSong,
        stopSong,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export function AudioPlayer({ onStatusChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const prevVolumeRef = useRef(0.5);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Notifier le parent quand l'état de lecture change
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isPlaying);
    }
  }, [isPlaying, onStatusChange]);

  useEffect(() => {
    // Mettre à jour la durée quand l'audio est chargé
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    // Mettre à jour le temps actuel pendant la lecture
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.volume = volume;
    }

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Erreur de lecture:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = prevVolumeRef.current;
      setVolume(prevVolumeRef.current);
    } else {
      prevVolumeRef.current = volume;
      audioRef.current.volume = 0;
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculer le pourcentage de progression
  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`audio-player ${isPlaying ? 'playing' : ''} bg-[#003E50] bg-opacity-90 text-white rounded-lg p-2 flex flex-col shadow-lg border ${isPlaying ? 'border-[#FFD700]' : 'border-[#5AA088]'} transition-colors duration-300`}>
      <audio ref={audioRef} src="/canon.mp3" preload="auto" loop />
      
      {isMobile ? (
        // Version mobile simplifiée
        <div className="flex items-center justify-between">
          <button 
            onClick={togglePlay} 
            className={`p-1.5 ${isPlaying ? 'bg-[#FFD700] text-[#003E50]' : 'bg-[#5AA088]'} rounded-full transition-all duration-300`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          
          <div className="flex-1 text-center text-xs mx-2">
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={toggleMute} 
              className="p-1 text-white hover:text-[#FFD700] transition-colors duration-300 mr-1"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 h-1.5 rounded-full appearance-none bg-[#d1d5db] outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)`
              }}
            />
          </div>
        </div>
      ) : (
        // Version desktop
        <div className="flex items-center justify-between">
          <button 
            onClick={togglePlay} 
            className={`p-2 ${isPlaying ? 'bg-[#FFD700] text-[#003E50]' : 'bg-[#5AA088]'} hover:bg-[#4C8B79] rounded-full transition-all duration-300`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <div className="flex-1 mx-2 text-xs text-center hidden sm:block">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={toggleMute} 
              className="p-1 text-white hover:text-[#FFD700] transition-colors duration-300"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 sm:w-20 h-2 rounded-full appearance-none bg-[#d1d5db] outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${volume * 100}%, #d1d5db ${volume * 100}%, #d1d5db 100%)`
              }}
            />
          </div>
        </div>
      )}
      
      <style jsx>{`
        .playing {
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          background: #FFD700;
          border-radius: 50%;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: #FFD700;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
} 
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export function AudioPlayer({ onStatusChange, id }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const prevVolumeRef = useRef(0.5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const updateMetadata = () => setDuration(audio.duration);
    const updateTime = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => {
      setIsPlaying(true);
      if(onStatusChange) onStatusChange(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
      if(onStatusChange) onStatusChange(false);
    };

    audio.addEventListener('loadedmetadata', updateMetadata);
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    audio.volume = volume;

    return () => {
      audio.removeEventListener('loadedmetadata', updateMetadata);
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [volume, onStatusChange]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
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

  return (
    <div className={`audio-player ${isPlaying ? 'playing' : ''} bg-[#003E50] text-white rounded-lg p-2`}>
      <audio ref={audioRef} src="/canon.mp3" preload="auto" loop />
      <div className="flex items-center justify-between">
        <button onClick={togglePlay} className={`p-2 ${isPlaying ? 'bg-[#FFD700]' : 'bg-[#5AA088]'} rounded-full`}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="mx-2 text-xs">{formatTime(currentTime)} / {formatTime(duration)}</div>
        <div className="flex items-center">
          <button onClick={toggleMute} className="p-1 mr-1">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input 
            type="range" 
            min="0" max="1" step="0.01" value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-2 rounded-full appearance-none bg-gray-300 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

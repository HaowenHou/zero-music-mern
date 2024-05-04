import React, { useState, useEffect, useRef } from 'react';

const PlayerControl = () => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [trackProgress, setTrackProgress] = useState(0);

    // Load track when track changes
    useEffect(() => {
        audioRef.current = new Audio('Stars In Her Eyes.mp3');
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
        // audioRef.current.src = 'Stars In Her Eyes.mp3';
        // tracks[currentTrackIndex].file;
        setTrackProgress(0);
    }, [currentTrackIndex]);

    // Update progress as audio plays
    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current) {
                setTrackProgress(audioRef.current.currentTime / audioRef.current.duration);
            }
        }, 500);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const playPause = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prevIndex) => {
            return (prevIndex + 1) % tracks.length;
        });
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prevIndex) => {
            return prevIndex === 0 ? tracks.length - 1 : prevIndex - 1;
        });
    };

    const onProgressChange = (e) => {
        const newTime = e.target.value * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setTrackProgress(audioRef.current.currentTime / audioRef.current.duration);
    };

    return (
        <div>
            <div className='flex flex-col'>
                <div className='flex justify-center'>
                    <button onClick={prevTrack}>
                        <svg className="size-7 fill-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
                        </svg>
                    </button>
                    <button onClick={playPause}>
                        {isPlaying ? (
                            <svg className="size-12 fill-orange-400 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="size-12 fill-orange-400 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                    <button onClick={nextTrack}>
                        <svg className="size-7 fill-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
                        </svg>
                    </button>
                </div>
                <input type="range" value={trackProgress} step="0.01" min="0" max="1" onChange={onProgressChange}
                className='my-2 h-1.5 bg-gray-200 rounded-lg cursor-pointer' />
            </div>
        </div>
    );
};

export default PlayerControl;

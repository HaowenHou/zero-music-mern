import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlay, setPlay, setVolume, setTrackIndex, setCurrentTime, setCurrentTrackId } from '../redux/actionCreators';
import { formatTime } from '../utils/timeUtils';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PlayerControl = () => {
  const { t } = useTranslation();
  const { isPlaying, volume, currentTrackIndex, currentTime, currentTrackId } = useSelector(state => state.playerState);
  const { playlist } = useSelector(state => state.playlistState);
  const dispatch = useDispatch();

  // tracks: [{id, title, artist, file, cover}, ...]
  const audioRef = useRef(null);
  const [trackProgress, setTrackProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");

  const navigate = useNavigate();

  // Load track when track changes
  useEffect(() => {
    if (!playlist.length) return;
    const newAudio = new Audio(import.meta.env.VITE_SERVER_URL + playlist[currentTrackIndex].track);
    audioRef.current = newAudio;
    newAudio.volume = volume;

    const current = formatTime(0);
    dispatch(setCurrentTime(current));

    const onMetadataLoaded = () => {
      const dur = formatTime(newAudio.duration);
      setDuration(dur);

      if (isPlaying) {
        newAudio.play();
      }
    };

    const onAudioEnded = () => {
      nextTrack();
    };

    newAudio.addEventListener('loadedmetadata', onMetadataLoaded);
    newAudio.addEventListener('ended', onAudioEnded);

    return () => {
      newAudio.removeEventListener('loadedmetadata', onMetadataLoaded);
      newAudio.pause();
    };
  }, [currentTrackId]);

  // Update progress as audio plays
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      return;
    }
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.readyState) {
        setTrackProgress(audioRef.current.currentTime / audioRef.current.duration);
        const current = formatTime(audioRef.current.currentTime);
        dispatch(setCurrentTime(current));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const playPause = () => {
    dispatch(togglePlay());
  };

  const nextTrack = () => {
    dispatch(setPlay(false));
    const newIndex = (currentTrackIndex + 1) % playlist.length;
    dispatch(setTrackIndex(newIndex));
    dispatch(setCurrentTrackId(playlist[newIndex]._id));
    dispatch(setPlay(true));
  };

  const prevTrack = () => {
    dispatch(setPlay(false));
    const newIndex = (currentTrackIndex === 0) ? playlist.length - 1 : currentTrackIndex - 1;
    dispatch(setTrackIndex(newIndex));
    dispatch(setCurrentTrackId(playlist[newIndex]._id));
    dispatch(setPlay(true));
  };

  const onProgressChange = (e) => {
    const newTime = e.target.value * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setTrackProgress(audioRef.current.currentTime / audioRef.current.duration);
    const current = formatTime(audioRef.current.currentTime);
    dispatch(setCurrentTime(current));
  };

  const onVolumeChange = (e) => {
    dispatch(setVolume(e.target.value));
    if (audioRef.current) {
      audioRef.current.volume = e.target.value;
    }
  };

  return (
    <div className='flex bg-gray-50 min-h-20'>
      {!!playlist.length ? (
        <>
          <div className='flex flex-[3] items-center'>
            <button className='relative ml-3' onClick={() => navigate(`/playing/${playlist[currentTrackIndex]._id}`)}>
              <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300'>
                <svg className="size-6 stroke-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
                </svg>
              </div>
              <img src={import.meta.env.VITE_SERVER_URL + playlist[currentTrackIndex].cover} className='w-14 h-14 rounded-md' />
            </button>
            <div className='ml-4 flex flex-col'>
              <span className='text-lg font-bold'>{playlist[currentTrackIndex].title}</span>
              <span className='text-sm'>{playlist[currentTrackIndex].artist}</span>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center flex-[4]'>
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
            <div className='flex w-full items-center gap-1'>
              <span>{currentTime}</span>
              <input type="range" value={trackProgress} step="0.01" min="0" max="1" onChange={onProgressChange}
                className='my-2 h-1 bg-gray-200 rounded-lg cursor-pointer w-full accent-orange-400' />
              <span>{duration}</span>
            </div>
          </div>

          <div className='flex flex-[3] items-center gap-4'>
            {/* {playlist[currentTrackIndex].isFavorited ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-4">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 ml-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            )} */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 ml-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
            <input type="range" className='accent-orange-400 h-1 mr-12'
              value={volume} min="0" max="1" step="0.01" onChange={onVolumeChange} />
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <span>{t("nullPlaylist")}</span>
        </div>
      )}
    </div>
  );
};

export default PlayerControl;

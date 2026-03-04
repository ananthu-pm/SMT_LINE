// ──────────────────────────────────────────────────
//  RobotAssistant — Static image when idle,
//  Animated GIF + Audio when playing
//  User view only — bottom-left corner
// ──────────────────────────────────────────────────

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ROBOT_GIF = '/assets/robot.gif';
const ROBOT_STILL = '/assets/robot-still.png';

// Audio map: machineId → audio file path
const AUDIO_MAP = {
    null: '/assets/audio/home.m4a',
    'pcba-magazine-loader': '/assets/audio/pcba-magazine-loader.m4a',
    'link-conveyor-1': '/assets/audio/link-conveyor-1.m4a',
    'screen-printer': '/assets/audio/screen-printer.m4a',
    'link-conveyor-2': '/assets/audio/link-conveyor-2.m4a',
    'solder-paste-inspection': '/assets/audio/solder-paste-inspection.m4a',
    'reject-conveyor-1': '/assets/audio/reject-conveyor-1.m4a',
    'surface-mounter': '/assets/audio/surface-mounter.m4a',
    'inspection-conveyor': '/assets/audio/inspection-conveyor.m4a',
    'pre-aoi': '/assets/audio/pre-aoi.m4a',
    'reject-conveyor-2': '/assets/audio/reject-conveyor-2.m4a',
    'reflow-oven': '/assets/audio/reflow-oven.m4a',
    'cooling-conveyor': '/assets/audio/cooling-conveyor.m4a',
    'final-aoi': '/assets/audio/final-aoi.m4a',
    'reject-conveyor-3': '/assets/audio/reject-conveyor-3.m4a',
    'magazine-unloader': '/assets/audio/magazine-unloader.m4a',
};

export default function RobotAssistant({ activeMachineId, isModelLoaded }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gifKey, setGifKey] = useState(0);
    const lastAutoPlayedRef = useRef(null);
    const autoPlayAttemptRef = useRef(null);

    // Get audio path for current view
    const audioKey = activeMachineId === undefined ? null : activeMachineId;
    const audioSrc = AUDIO_MAP[audioKey] || AUDIO_MAP[null];

    // Stop audio
    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    }, []);

    // Play audio + switch to GIF
    const playAudio = useCallback(() => {
        if (audioRef.current) {
            // Force reload audio src to ensure fresh playback
            audioRef.current.load();
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setGifKey((k) => k + 1);
                    setIsPlaying(true);
                }).catch((err) => {
                    console.warn('Audio play blocked:', err);
                    setIsPlaying(false);
                });
            }
        }
    }, []);

    // Toggle play/stop
    const togglePlayback = useCallback(() => {
        if (isPlaying) {
            stopAudio();
        } else {
            playAudio();
        }
    }, [isPlaying, stopAudio, playAudio]);

    // When audio ends naturally
    const handleAudioEnded = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // When machine changes — stop audio and reset
    useEffect(() => {
        stopAudio();
        lastAutoPlayedRef.current = null;
        // Clear any pending auto-play attempts
        if (autoPlayAttemptRef.current) {
            clearTimeout(autoPlayAttemptRef.current);
            clearInterval(autoPlayAttemptRef.current);
        }
    }, [audioKey]); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-play when model loads — immediate + retry
    useEffect(() => {
        if (isModelLoaded && lastAutoPlayedRef.current !== audioKey) {
            lastAutoPlayedRef.current = audioKey;

            const tryPlay = () => {
                if (!audioRef.current) return;
                audioRef.current.load();
                const p = audioRef.current.play();
                if (p !== undefined) {
                    p.then(() => {
                        setGifKey((k) => k + 1);
                        setIsPlaying(true);
                    }).catch(() => {
                        // Autoplay blocked by browser — try again on any user interaction
                        setIsPlaying(false);
                        const events = ['click', 'touchstart', 'keydown'];
                        const handler = () => {
                            if (audioRef.current && lastAutoPlayedRef.current === audioKey) {
                                audioRef.current.play().then(() => {
                                    setGifKey((k) => k + 1);
                                    setIsPlaying(true);
                                }).catch(() => { });
                            }
                            events.forEach(e => document.removeEventListener(e, handler));
                        };
                        events.forEach(e => document.addEventListener(e, handler, { once: true }));
                    });
                }
            };

            // Try immediately, then retry after short delay
            tryPlay();
            const timer = setTimeout(tryPlay, 300);
            return () => clearTimeout(timer);
        }
    }, [isModelLoaded, audioKey]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-3 left-3 z-50 flex flex-col items-start gap-2"
        >
            {/* Robot image container — LARGER (200px) */}
            <div className="relative" style={{ width: '300px', height: '300px' }}>
                {isPlaying ? (
                    /* Playing → show animated GIF */
                    <img
                        key={`gif-${gifKey}`}
                        src={ROBOT_GIF}
                        alt="Robot Speaking"
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.35))' }}
                    />
                ) : (
                    /* Idle → show static image */
                    <img
                        src={ROBOT_STILL}
                        alt="Robot Assistant"
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}
                    />
                )}

                {/* Speaking indicator */}
                <AnimatePresence>
                    {isPlaying && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-1 left-1"
                        >
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: ['4px', '14px', '4px'] }}
                                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                                        className="w-[3px] rounded-full"
                                        style={{ backgroundColor: isDark ? '#00b4ff' : '#3b82f6' }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Play/Stop button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayback}
                className={`ml-16 flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-heading uppercase tracking-wider transition-all duration-300 ${isPlaying
                    ? isDark
                        ? 'bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20'
                        : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : isDark
                        ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20'
                        : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                    }`}
            >
                <span className="text-sm">{isPlaying ? '⏹' : '▶'}</span>
                {isPlaying ? 'Stop' : 'Play'}
            </motion.button>

            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={audioSrc}
                onEnded={handleAudioEnded}
                preload="auto"
            />
        </motion.div>
    );
}

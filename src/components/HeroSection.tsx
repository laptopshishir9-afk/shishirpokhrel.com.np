import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin, School, BookOpen, Sparkles } from 'lucide-react';
import { SocialIcons3D } from './SocialIcons3D';
import { TypingHeading } from './TypingHeading';
import {
  getStoredProfilePhoto,
  subscribeProfilePhoto,
  DEFAULT_PHOTO_PATHS
} from '../utils/photoManager';

interface HeroSectionProps {
  onReadMore?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onReadMore }) => {
  // Real profile photo management (viewing only on public devices)
  const [photoSrc, setPhotoSrc] = useState<string>(() => getStoredProfilePhoto() || DEFAULT_PHOTO_PATHS[0]);
  const [hasPhotoError, setHasPhotoError] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeProfilePhoto((newUrl) => {
      if (newUrl) {
        setPhotoSrc(newUrl);
        setHasPhotoError(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleReadMoreClick = () => {
    if (onReadMore) {
      onReadMore();
    } else {
      window.location.hash = '#/about-me';
    }
  };

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-sky-50/80 via-amber-50/30 to-blue-50/50 overflow-hidden"
    >
      {/* Subtle fine geometric dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* =========================================================================
            1. AT TOP: TYPING ANIMATION (TYPED ONCE IN 1 SEC) & HIGHLIGHTED NAME
           ========================================================================= */}
        <div className="text-center mb-10 sm:mb-14">
          <TypingHeading prefix="Hi, I'm " name="Shishir Pokhrel" durationMs={1000} />
          <p className="text-xs sm:text-sm font-bold text-blue-700 mt-2 uppercase tracking-widest">
            Class 11 Computer Science Student • Butwal, Nepal
          </p>
        </div>

        {/* =========================================================================
            2. CIRCLE PHOTO FRAME WITH SMOOTH MOVEMENT + INFO DOWN OF LOGO + READ MORE
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start justify-center">
          
          {/* COLUMN 1 (5 cols): CIRCLE PHOTO FRAME + INFO DOWN OF LOGO + READ MORE */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col items-center text-center mx-auto w-full max-w-sm"
          >
            {/* SMOOTH FLOATING CIRCLE CONTAINER */}
            <div className="relative flex flex-col items-center justify-center mb-6">
              
              {/* Outer decorative orbital ring */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 24,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -inset-3.5 rounded-full border-2 border-dashed border-sky-300/80 pointer-events-none -z-10"
              />

              {/* Gentle ambient colored backplate glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-300/40 via-sky-200/50 to-blue-300/40 blur-xl pointer-events-none -z-20 transform scale-110" />

              {/* SMOOTH MOVEMENT ANIMATION: Gentle harmonic levitation */}
              <motion.div
                id="hero-circle-photo-container"
                animate={{
                  y: [0, -12, 0],
                  x: [0, 3, 0, -3, 0],
                  rotate: [0, 1, 0, -1, 0],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-white p-2 shadow-2xl border-4 border-amber-300 ring-8 ring-sky-100/90"
              >
                {/* Circular image overflow mask */}
                <div className="w-full h-full rounded-full overflow-hidden bg-sky-50 relative flex items-center justify-center">
                  {!hasPhotoError ? (
                    <img
                      id="hero-profile-circle-img"
                      src={photoSrc}
                      alt="Shishir Pokhrel"
                      referrerPolicy="no-referrer"
                      onError={() => setHasPhotoError(true)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    /* Fallback avatar when photo is loading or unconfigured */
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-amber-50 to-blue-100 text-blue-950 p-4">
                      <div className="w-16 h-16 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shadow-xs mb-1">
                        <span className="font-display font-black text-2xl text-blue-800">SP</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800">Shishir Pokhrel</span>
                      <span className="text-[10px] text-blue-700 font-semibold">Nepal</span>
                    </div>
                  )}

                  {/* Shimmer badge */}
                  <div className="absolute bottom-2 bg-blue-950/90 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300/60 backdrop-blur-xs flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Shishir Pokhrel</span>
                  </div>
                </div>
              </motion.div>

              {/* Dynamic breathing ground shadow beneath the floating circle */}
              <motion.div
                animate={{
                  scale: [1, 0.84, 1],
                  opacity: [0.35, 0.18, 0.35],
                }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-40 h-4 bg-sky-950/20 rounded-full blur-md mt-4 pointer-events-none"
              />
            </div>

            {/* =========================================================================
                IN THE DOWN OF LOGO: GIVE INFO LIKE "I AM A CLASS..."
               ========================================================================= */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/95 border-2 border-sky-200/90 shadow-sm text-center w-full">
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
                I am a <strong>Class 11 Computer Science</strong> student studying at{' '}
                <strong>Everest English Boarding Secondary School</strong>. I live in{' '}
                <strong>Jitgadhi, Butwal-13, Rupandehi, Nepal</strong>. I enjoy learning new things, building websites, coding, and video editing.
              </p>
            </div>

            {/* =========================================================================
                BELOW THIS TEXT: ADD READ MORE
               ========================================================================= */}
            <div className="mt-4 w-full flex flex-col items-center">
              <button
                type="button"
                id="hero-read-more-btn"
                onClick={handleReadMoreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-extrabold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-amber-500/30 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-blue-950" />
                <span>Read More</span>
                <ArrowRight className="w-4 h-4 text-blue-950" />
              </button>
            </div>
          </motion.div>

          {/* COLUMN 2 (7 cols): QUICK CONTEXT, BUTTONS & SOCIAL CHAT */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 rounded-3xl bg-white/90 border-2 border-sky-200/90 p-6 sm:p-8 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Slogan */}
              <div className="font-display text-xl sm:text-2xl text-blue-950 font-extrabold tracking-tight flex items-center gap-2 mb-4">
                <span className="text-blue-600">Learning.</span>
                <span className="text-amber-600">Building.</span>
                <span className="text-sky-600">Creating.</span>
              </div>

              {/* Natural overview */}
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                I believe that improving little by little every day makes a big difference over time. As a student at the beginning of my journey, I am focused on mastering the foundations of computer science, writing clean code, and working toward my dream of becoming a software engineer.
              </p>

              {/* Badges */}
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-blue-950 shadow-2xs">
                  <School className="w-3.5 h-3.5 text-blue-600" />
                  Everest English Boarding Sec. School
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Jitgadhi, Butwal-13, Nepal
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="mt-8 pt-6 border-t border-sky-100 flex flex-wrap items-center gap-3">
              <a
                id="hero-explore-button"
                href="#about"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs hover:shadow-sm"
              >
                <span>Explore Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                id="hero-connect-button"
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-blue-950 font-bold text-xs transition-all shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Let's Connect</span>
              </a>
            </div>

            {/* Social Media & Direct Chat */}
            <div className="mt-6 pt-5 border-t border-sky-100">
              <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider block mb-2.5">
                Official Social Profiles & Direct Chat
              </span>
              <SocialIcons3D size="md" withWhatsAppButton={true} />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

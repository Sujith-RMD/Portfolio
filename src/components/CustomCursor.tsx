import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 460, damping: 36, mass: 0.28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const ringX = useSpring(mouseX, { stiffness: 280, damping: 24, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 280, damping: 24, mass: 0.5 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateEnabled = () => {
      setIsEnabled(mediaQuery.matches && !shouldReduceMotion);
    };

    updateEnabled();

    mediaQuery.addEventListener('change', updateEnabled);

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      mediaQuery.removeEventListener('change', updateEnabled);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, shouldReduceMotion]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#f5c400] pointer-events-none z-[9999]"
        style={{ x: cursorX, y: cursorY }}
        animate={{ scale: isHovering ? 0 : 1 }}
        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#f5c400]/70 pointer-events-none z-[9998]"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isHovering ? 1.35 : 1,
          backgroundColor: isHovering ? 'rgba(245, 196, 0, 0.16)' : 'rgba(0, 0, 0, 0)',
          borderColor: isHovering ? 'rgba(245, 196, 0, 1)' : 'rgba(245, 196, 0, 0.7)',
        }}
        transition={{ type: 'spring', stiffness: 210, damping: 20, mass: 0.35 }}
      />
    </>
  );
};

export default CustomCursor;

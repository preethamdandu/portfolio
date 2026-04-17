"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isHovering = false;

    // quickSetter for better performance
    const xSet = gsap.quickSetter(cursor, 'x', 'px');
    const ySet = gsap.quickSetter(cursor, 'y', 'px');
    const rxSet = gsap.quickSetter(ring, 'x', 'px');
    const rySet = gsap.quickSetter(ring, 'y', 'px');

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isHovering) {
        gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });
        gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.3, ease: 'power2.out' });
      } else {
        // Find hovered element
        const targets = document.querySelectorAll('[data-magnetic]');
        let snapped = false;
        targets.forEach((target) => {
          const rect = target.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
          if (distance < 50) {
            snapped = true;
            // Magnetic pull
            gsap.to(cursor, { x: centerX + (mouseX - centerX) * 0.2, y: centerY + (mouseY - centerY) * 0.2, duration: 0.2 });
            gsap.to(ring, { x: centerX, y: centerY, duration: 0.3 });
          }
        });
        
        if (!snapped) {
           isHovering = false;
           gsap.to(ring, { scale: 1, opacity: 0 });
        }
      }
    };

    const targetEls = document.querySelectorAll('[data-magnetic]');
    
    // Add magnetic triggers dynamically
    const applyMagnetic = () => {
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          isHovering = true;
          gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
          gsap.to(cursor, { scale: 0.5, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
          isHovering = false;
          gsap.to(ring, { scale: 0.5, opacity: 0, duration: 0.3 });
          gsap.to(cursor, { scale: 1, duration: 0.2 });
        });
      });
    }

    applyMagnetic();
    // Re-apply occasionally if DOM changes, though React makes this tricky.
    // For a cleaner approach, a MutationObserver would be ideal.

    const observer = new MutationObserver(applyMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });

    const onClick = () => {
      gsap.fromTo(ring, 
        { scale: 1, opacity: 1 },
        { scale: 2, opacity: 0, duration: 0.4, ease: 'power2.out' }
      );
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      observer.disconnect();
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[var(--signal)] rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-[var(--signal)] rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2 opacity-0 scale-50"
      />
    </>
  );
}

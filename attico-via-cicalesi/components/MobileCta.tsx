'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** Barra CTA fissa su mobile: compare dopo l'hero e sparisce quando il form è visibile. */
export function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const form = document.getElementById('prenota');
    let formVisible = false;
    const io = new IntersectionObserver(([e]) => {
      formVisible = e.isIntersecting;
      update();
    });
    if (form) io.observe(form);
    const update = () => setShow(window.scrollY > window.innerHeight * 0.8 && !formVisible);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-stone/60 bg-ivory/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 leading-tight">
              <p className="font-display text-lg">€ 330.000</p>
              <p className="text-xs text-mute">Open Day · Sab 21 Nov</p>
            </div>
            <a href="#prenota" className="btn-primary !px-5 !py-3.5">Prenota visita</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

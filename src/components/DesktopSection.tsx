import { useEffect, useRef, useState } from 'react';
import DesktopEnvironment from './desktop/DesktopEnvironment';

export const DesktopSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="desktop-section"
      id="desktop"
      style={{ padding: 'var(--section-gap) 0' }}
    >
      <div className="container">
        <div className="section-head" data-reveal>
          <div className="section-eyebrow">INTERACTIVE</div>
          <h2 className="section-title">My Desktop</h2>
        </div>

        <div
          data-reveal
          style={{
            marginTop: '48px',
            position: isFullscreen ? 'fixed' : 'relative',
            inset: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 9999 : 1,
            width: isFullscreen ? '100vw' : '100%',
            height: isFullscreen ? '100vh' : '680px',
            borderRadius: isFullscreen ? 0 : '14px',
            overflow: 'hidden',
            border: isFullscreen ? 'none' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: isFullscreen ? 'none' : '0 8px 64px rgba(0,0,0,0.6)',
            background: '#0a0a12',
          }}
        >
          {visible && <DesktopEnvironment />}

          <button
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            style={{
              position: 'absolute',
              bottom: '64px',
              right: '12px',
              zIndex: 10000,
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              padding: '5px 8px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '13px',
              backdropFilter: 'blur(4px)',
              lineHeight: 1,
            }}
          >
            {isFullscreen ? '⊠' : '⛶'}
          </button>
        </div>

        <p
          data-reveal
          style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--muted)',
          }}
        >
          A fully interactive desktop — try the terminal, file manager, and apps.
        </p>
      </div>
    </section>
  );
};

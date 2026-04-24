import { useLayoutEffect, useRef, useState } from 'react';

/**
 * HydLogo
 * -------
 * Place CineFonts-Taruni.ttf in /public/fonts/
 * Add this to your src/index.css:
 *
 *   @font-face {
 *     font-family: 'Taruni';
 *     src: url('/fonts/CineFonts-Taruni.ttf') format('truetype');
 *   }
 */

type HydLogoProps = {
  width?: number;
};

export default function HydLogo({ width = 240 }: HydLogoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [designWidth, setDesignWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const measured = wrapperRef.current.offsetWidth;
    if (measured > 0) setDesignWidth(measured);
  }, []);

  useLayoutEffect(() => {
    const scale = () => {
      if (!wrapperRef.current || designWidth === 0) return;
      const s = Math.min(width / designWidth, 1);
      wrapperRef.current.style.transform = `scale(${s})`;
    };

    scale();
    window.addEventListener('resize', scale);
    return () => window.removeEventListener('resize', scale);
  }, [designWidth, width]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width,
        maxWidth: '100%',
      }}
    >
      {/* Intrinsic design width — scaled down proportionally when needed */}
      <div
        ref={wrapperRef}
        style={{
          display: 'inline-block',
          transformOrigin: 'left center',
          fontFamily: "'Taruni', sans-serif",
        }}
      >
        {/* ── Overpass: shrink-wraps to text width ── */}
        <div style={{ position: 'relative', display: 'inline-block' }}>

          {/* Main title — black fill, blue stroke */}
          <div
            style={{
              fontFamily: "'Taruni', sans-serif",
              fontSize: 120,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              letterSpacing: -1,
              color: '#0a0a1a',
              WebkitTextStroke: '2px #0071e3',
              // @ts-expect-error: paintOrder not in React SVG types
              paintOrder: 'stroke fill',
              position: 'relative',
              zIndex: 2,
            }}
          >
            హైదరాబాద్
          </div>

          {/* Ghost outline — visible below road */}
          <div
            style={{
              fontFamily: "'Taruni', sans-serif",
              fontSize: 120,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              letterSpacing: -1,
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(0,113,227,0.25)',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              clipPath: 'polygon(0 65%, 100% 65%, 100% 100%, 0 100%)',
            }}
          >
            హైదరాబాద్
          </div>

          {/* ── Road ── */}
          <div
            style={{
              position: 'absolute',
              top: '69%',
              left: 68,
              right: -8,
              height: 24,
              background: '#181820',
              borderTop: '1px solid rgba(0,0,0,0.18)',
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              overflow: 'hidden',
              zIndex: 3,
              boxShadow: '0 -2px 12px rgba(0,0,0,0.12), 0 2px 12px rgba(0,0,0,0.1)',
            }}
          >
            <RoadDash />
            <Vehicle color="#FF3B30" width={18} trailWidth={28} trailColor="rgba(255,59,48,0.4)"  duration={4.2} top="50%" dir="right" delay={0}   />
            <Vehicle color="#FF9500" width={12} trailWidth={20} trailColor="rgba(255,149,0,0.35)" duration={6.0} top="50%" dir="right" delay={-2.1} />
            <Vehicle color="rgba(255,255,255,0.65)" width={16} trailWidth={24} trailColor="rgba(255,255,255,0.18)" duration={5.0} top="50%" dir="right" delay={-3.7} />
            <Vehicle color="#0071e3" width={14} trailWidth={20} trailColor="rgba(0,113,227,0.35)" duration={7.0} top="30%" dir="left"  delay={-1}   />
            <Vehicle color="rgba(255,255,255,0.38)" width={10} trailWidth={14} trailColor="rgba(255,255,255,0.12)" duration={5.5} top="30%" dir="left" delay={-4} />
          </div>
        </div>

        {/* ── Subtitle row ──
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginLeft: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              border: '1px solid rgba(255,59,48,0.35)',
              borderRadius: 20,
              padding: '4px 10px 4px 7px',
              background: 'rgba(255,59,48,0.05)',
              flexShrink: 0,
            }}
          >
            <LiveDot />
            <span
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 2,
                color: 'rgba(255,59,48,0.85)',
                textTransform: 'uppercase',
              }}
            >
              Live
            </span>
          </div>

          <span
            style={{
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.28)',
            }}
          >
            Cyberabad Traffic Intelligence
          </span>
        </div>
        */}
      </div>

      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes dashScroll { to { background-position: 50px 0; } }
        @keyframes driveRight { from { left: -40px; } to { left: calc(100% + 40px); } }
        @keyframes driveLeft  { from { left: calc(100% + 40px); } to { left: -40px; } }
        @keyframes livePulse  {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,59,48,0.5); }
          50%      { opacity: 0.7; box-shadow: 0 0 0 4px rgba(255,59,48,0); }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function RoadDash() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        height: 2,
        width: '100%',
        transform: 'translateY(-50%)',
        backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 24px, transparent 24px, transparent 50px)',
        animation: 'dashScroll 0.9s linear infinite',
      }}
    />
  );
}

interface VehicleProps {
  color: string;
  width: number;
  trailWidth: number;
  trailColor: string;
  duration: number;
  top: string;
  dir: 'left' | 'right';
  delay: number;
}

function Vehicle({ color, width, trailWidth, trailColor, duration, top, dir, delay }: VehicleProps) {
  const animName = dir === 'right' ? 'driveRight' : 'driveLeft';
  return (
    <div
      style={{
        position: 'absolute',
        height: 3,
        borderRadius: 3,
        top,
        transform: 'translateY(-50%)',
        width,
        background: color,
        animation: `${animName} ${duration}s linear ${delay}s infinite`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          ...(dir === 'right' ? { right: '100%' } : { left: '100%' }),
          top: '50%',
          transform: 'translateY(-50%)',
          height: 3,
          width: trailWidth,
          borderRadius: 1,
          background: trailColor,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}


import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { currentCamera, hero } from '../content';
import { usePrefersReducedMotion } from '../hooks';
import DecryptedText from './reactbits/DecryptedText';
import EntranceProgress from './EntranceProgress';
import { photoDisplays } from '../imageAssets';
const landscape = photoDisplays.XJ1;
const mountains = photoDisplays.XJ4;
const meadow = photoDisplays.XJ3;
import './site-entrance.css';

const READY_HOLD = 650;
const EXIT_DURATION = 500;
type EntranceState = 'playing' | 'exiting' | 'done';

const stages = ['film.load()', 'frame.develop()', 'portfolio.ready()'];

/** A brief first-visit title sequence. Asset failures never prevent entering the site. */
export default function SiteEntrance({ children, play }: { children: ReactNode; play: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [state, setState] = useState<EntranceState>(() => play && !reduced ? 'playing' : 'done');
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const active = state !== 'done';
  const leave = useCallback(() => setState(current => current === 'playing' ? 'exiting' : current), []);
  const markReady = useCallback(() => { setStage(2); setReady(true); }, []);

  useEffect(() => {
    if (!active) return;
    if (reduced) setState('done');
  }, [active, reduced]);

  useEffect(() => {
    if (state !== 'playing') return;
    const timer = window.setTimeout(() => setStage(1), 650);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    if (state !== 'playing' || !ready) return;
    const timer = window.setTimeout(leave, READY_HOLD);
    return () => window.clearTimeout(timer);
  }, [state, ready, leave]);

  useEffect(() => {
    if (state !== 'exiting') return;
    const timer = window.setTimeout(() => setState('done'), EXIT_DURATION);
    return () => window.clearTimeout(timer);
  }, [state]);

  useLayoutEffect(() => {
    if (!active) {
      // Run after React removes inert; browsers reject focus while the page is inert.
      if (restoreFocus.current) {
        restoreFocus.current = false;
        const destination = contentRef.current?.querySelector<HTMLElement>('h1')
          ?? contentRef.current?.querySelector<HTMLElement>('main');
        if (destination) {
          const previousTabIndex = destination.getAttribute('tabindex');
          destination.setAttribute('tabindex', '-1');
          destination.focus({ preventScroll: true });
          // Safari drops focus if tabindex is removed while the heading is focused.
          const restoreTabIndex = () => {
            if (previousTabIndex === null) destination.removeAttribute('tabindex');
            else destination.setAttribute('tabindex', previousTabIndex);
          };
          destination.addEventListener('blur', restoreTabIndex, { once: true });
          return () => {
            destination.removeEventListener('blur', restoreTabIndex);
            restoreTabIndex();
          };
        }
      }
      return;
    }
    const entrance = entranceRef.current;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    if (scrollbar) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    entrance?.focus({ preventScroll: true });
    return () => {
      restoreFocus.current = Boolean(entrance?.contains(document.activeElement) || document.activeElement === document.body);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);

  return (
    <>
      <div ref={contentRef} className="entrance-page" data-state={state} inert={active} aria-hidden={active || undefined}>
        {children}
      </div>
      {active && (
        <div
          ref={entranceRef}
          className="site-entrance"
          data-state={state}
          data-stage={stage}
          style={{ '--entrance-exit': `${EXIT_DURATION}ms` } as CSSProperties}
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-label="Welcome to Yuzhuo Jia’s portfolio"
          onKeyDown={event => {
            if (event.key === 'Escape') { event.preventDefault(); leave(); }
            if (event.key === 'Tab') { event.preventDefault(); skipRef.current?.focus(); }
          }}
        >
          <div className="entrance-grain" aria-hidden="true" />
          <div className="entrance-topline entrance-furniture" aria-hidden="true">
            <span className="entrance-wordmark">YZ_J<span className="entrance-caret">_</span></span>
            <span>RESEARCH &amp; PHOTOGRAPHY</span>
          </div>

          <div className="entrance-scene">
            <div className="entrance-caption" aria-hidden="true">
              <span><i /> A NEW FRAME</span>
              <span>{currentCamera.brand} {currentCamera.model} / DIGITAL</span>
            </div>
            <div className="entrance-film-window" aria-hidden="true">
              <div className="entrance-film-track">
                <div className="entrance-rail entrance-rail-top" />
                <div className="entrance-frames">
                  <div className="entrance-frame entrance-frame-neighbor">
                    <img src={mountains.src} srcSet={mountains.srcSet} sizes="(max-width: 767px) 85vw, 544px" decoding="async" alt="" width="600" height="400" />
                    <span className="entrance-frame-index">00</span>
                  </div>
                  <div className="entrance-frame entrance-frame-title">
                    <img src={landscape.src} srcSet={landscape.srcSet} sizes="(max-width: 767px) 85vw, 544px" fetchPriority="high" decoding="async" alt="" width="600" height="400" />
                    <div className="entrance-frame-shade" />
                    <span className="entrance-frame-index">01 <span>▹</span></span>
                    <div className="entrance-identity">
                      <span className="entrance-code-comment">// a work in progress</span>
                      <p className="entrance-name">
                        {stage > 0 ? <DecryptedText text={hero.name} speed={48} /> : <span className="entrance-name-placeholder">{hero.name}</span>}
                      </p>
                      <span className="entrance-identity-rule" />
                      <span className="entrance-identity-caption">IDEAS, PEOPLE, AND THE FRAMES BETWEEN.</span>
                    </div>
                    <span className="entrance-scan" />
                  </div>
                  <div className="entrance-frame entrance-frame-neighbor">
                    <img src={meadow.src} srcSet={meadow.srcSet} sizes="(max-width: 767px) 85vw, 544px" decoding="async" alt="" width="600" height="400" />
                    <span className="entrance-frame-index">02</span>
                  </div>
                </div>
                <div className="entrance-rail entrance-rail-bottom" />
              </div>
              <span className="entrance-frame-corner entrance-frame-corner-tl" />
              <span className="entrance-frame-corner entrance-frame-corner-tr" />
              <span className="entrance-frame-corner entrance-frame-corner-bl" />
              <span className="entrance-frame-corner entrance-frame-corner-br" />
            </div>
            <div className="entrance-console" aria-hidden="true">
              <span className="entrance-console-prompt">&gt;</span>
              <code key={stage}>{stages[stage]}<span className="entrance-code-punctuation">;</span></code>
              <span className="entrance-stage-index">0{stage + 1}<span> / 03</span></span>
            </div>
            <EntranceProgress running={state === 'playing'} onComplete={markReady} />
          </div>

          <div className="entrance-bottomline entrance-furniture">
            <span aria-hidden="true">FROM THOUGHT TO FRAME.</span>
            <button ref={skipRef} type="button" data-cursor onClick={leave} className="entrance-skip" aria-label="Skip intro">
              SKIP INTRO <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

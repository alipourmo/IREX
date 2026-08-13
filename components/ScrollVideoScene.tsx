'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpecularButton from './SpecularButton';

gsap.registerPlugin(ScrollTrigger);

type Scene = { id:string; eyebrow:string; title:string; body:string; startFrame:string; endFrame:string; video:string; align:'left'|'right' };

export default function ScrollVideoScene({ scene, onApply, hero = false }: { scene: Scene; onApply?: () => void; hero?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null); const videoRef = useRef<HTMLVideoElement>(null); const [ready, setReady] = useState(false); const [activate, setActivate] = useState(hero);
  useEffect(() => {
    const section = sectionRef.current; const video = videoRef.current; if (!section || !video) return;
    const preloader = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActivate(true); }, { rootMargin: '1400px 0px', threshold: 0 }); preloader.observe(section);
    return () => preloader.disconnect();
  }, []);
  useEffect(() => { const v = videoRef.current; if (activate && v) { v.preload = 'auto'; v.load(); } }, [activate]);
  useEffect(() => {
    const section = sectionRef.current; const video = videoRef.current; if (!section || !video) return;
    let target = 0, raf = 0;
    const seek = () => {
      if (ready && video.readyState >= 2 && Number.isFinite(video.duration)) {
        const wanted = target * video.duration; const delta = wanted - video.currentTime;
        if (Math.abs(delta) > .02) video.currentTime = wanted;
      }
      raf = requestAnimationFrame(seek);
    }; raf = requestAnimationFrame(seek);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: section, start: 'top top', end: '+=180%', pin: true, scrub: 1, anticipatePin: 1, onUpdate: (self) => { target = self.progress; } });
      gsap.fromTo(section.querySelector('.scene-copy'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .7, scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' } });
    }, section);
    return () => { cancelAnimationFrame(raf); ctx.revert(); };
  }, [ready]);
  return (
    <section id={scene.id} ref={sectionRef} className={`video-scene video-scene--${scene.align}`}>
      <div className="scene-media" aria-hidden="true">
        <Image src={scene.startFrame} alt="" fill priority={hero} sizes="100vw" className="scene-poster" />
        <video ref={videoRef} src={scene.video} muted playsInline preload={hero ? 'auto' : 'metadata'} poster={scene.startFrame} onLoadedData={() => setReady(true)} onCanPlayThrough={() => setReady(true)} className={ready ? 'is-ready' : ''} />
        {!ready && <Image src={scene.endFrame} alt="" fill sizes="100vw" className="scene-end-fallback" />}
        <div className="scene-vignette" />
      </div>
      <div className="scene-copy">
        <span className="eyebrow">{scene.eyebrow}</span><h1>{scene.title}</h1><p>{scene.body}</p>
        {hero && onApply && <div className="hero-actions"><SpecularButton onClick={onApply}>Apply to Join <span aria-hidden="true">↗</span></SpecularButton><span className="microcopy">Limited Early Adopter Program</span></div>}
      </div>
    </section>
  );
}

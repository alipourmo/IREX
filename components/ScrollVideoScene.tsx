'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { VideoScene } from '@/lib/content';
import SpecularButton from './SpecularButton';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoScene({
  scene,
  onApply,
  hero = false,
}: {
  scene: VideoScene;
  onApply?: () => void;
  hero?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [activate, setActivate] = useState(hero);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const preloader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActivate(true);
      },
      { rootMargin: '1400px 0px', threshold: 0 },
    );

    preloader.observe(section);
    return () => preloader.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!activate || !video) return;

    video.preload = 'auto';
    video.load();
  }, [activate]);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let targetProgress = 0;
    let raf = 0;

    const scrubToScroll = () => {
      if (readyRef.current && video.readyState >= 2 && Number.isFinite(video.duration)) {
        const targetTime = gsap.utils.clamp(0, video.duration, targetProgress * video.duration);
        if (Math.abs(targetTime - video.currentTime) > 0.018) {
          video.currentTime = targetTime;
        }
      }

      raf = requestAnimationFrame(scrubToScroll);
    };

    raf = requestAnimationFrame(scrubToScroll);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

      gsap.fromTo(
        section.querySelector('.scene-copy'),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, section);

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section id={scene.id} ref={sectionRef} className={`video-scene video-scene--${scene.contentPosition}`}>
      <div className="scene-media" aria-hidden="true">
        <video
          ref={videoRef}
          src={activate ? scene.video : undefined}
          muted
          playsInline
          preload={hero ? 'auto' : 'metadata'}
          onLoadedMetadata={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          onCanPlayThrough={() => setReady(true)}
          className={ready ? 'is-ready' : ''}
        />
        <div className="scene-vignette" />
      </div>
      <div className="scene-copy">
        <span className="eyebrow">{scene.eyebrow}</span>
        <span className="scroll-range">{scene.scrollRange}</span>
        <h1>{scene.title}</h1>
        <p>{scene.body}</p>
        {hero && onApply && (
          <div className="hero-actions">
            <SpecularButton onClick={onApply}>
              Apply to Join <span aria-hidden="true">-&gt;</span>
            </SpecularButton>
            <span className="microcopy">Limited Early Adopter Program</span>
          </div>
        )}
      </div>
    </section>
  );
}

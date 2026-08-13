'use client';

import { useCallback, useState } from 'react';
import { videoScenes } from '@/lib/content';
import Header from './Header';
import LineSidebar from './LineSidebar';
import ApplyModal from './ApplyModal';
import ScrollVideoScene from './ScrollVideoScene';
import TextPressure from './TextPressure';
import SpotlightCard from './SpotlightCard';
import ShapeBlur from './ShapeBlur';
import Topography from './Topography';
import SpecularButton from './SpecularButton';

const auditItems = [
  ['01', 'TRACEABLE REASONING', 'Traceable reasoning behind every result'],
  ['02', 'EXPLICIT LINKS', 'Explicit links between data and conclusions'],
  ['03', 'JUSTIFIED DECISIONS', 'Clear justification for accepted and rejected hypotheses'],
  ['04', 'REPRODUCIBLE OUTCOMES', 'Consistent, reproducible outcomes'],
];

const controlItems = [
  ['01', 'INFRASTRUCTURE', 'Fully deployable within your infrastructure'],
  ['02', 'DATA OWNERSHIP', 'No sensitive data leaves your environment'],
  ['03', 'INDEPENDENCE', 'Personalised AI without external dependencies'],
  ['04', 'DETERMINISTIC', 'Deterministic, reproducible execution'],
  ['05', 'EXPERT CONTROL', 'Expert-in-the-loop control with override capability'],
  ['06', 'DOMAIN KNOWLEDGE', 'Domain expertise explicitly encoded into system reasoning'],
];

export default function LandingPage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const openApply = useCallback(() => setApplyOpen(true), []);
  const closeApply = useCallback(() => setApplyOpen(false), []);

  return (
    <main>
      <Header onApply={openApply} />
      <LineSidebar />
      {videoScenes.map((scene, i) => <ScrollVideoScene key={scene.id} scene={scene} hero={i === 0} onApply={i === 0 ? openApply : undefined} />)}

      <section className="reasoning-section" aria-labelledby="reasoning-title">
        <div className="section-shell">
          <span className="eyebrow">04B / REASONING PROCESS</span>
          <h2 id="reasoning-title" className="section-title">At scale, before drilling decisions are made.</h2>
          <div className="reasoning-list">
            <article><TextPressure text="GENERATE" color="#00B8C4" /><p>Construct multiple geological hypotheses using structured data and representations of mineral system topology.</p></article>
            <article><TextPressure text="TEST" color="#C97A32" /><p>Evaluate each hypothesis against available evidence and system constraints.</p></article>
            <article><TextPressure text="REJECT" color="#FF5860" /><p>Eliminate interpretations that fail to satisfy invariant relationships.</p></article>
          </div>
          <p className="section-note">This process is automated, enabling rapid and systematic evaluation of competing geological explanations.</p>
        </div>
      </section>

      <section id="principle" className="manifesto-section">
        <div className="section-shell manifesto-shell">
          <span className="eyebrow">05 / CORE PRINCIPLE</span>
          <h2 className="manifesto-title">Every Deposit Is Individual —<br />Systems Have Invariants.</h2>
          <div className="contrast-pair">
            <div className="contrast contrast--noise"><span>DEPOSIT FOOTPRINTS</span><strong>ARE NOISY.</strong></div>
            <div className="contrast contrast--system"><span>MINERAL SYSTEMS</span><strong>ARE NOT.</strong></div>
          </div>
          <p className="manifesto-copy">While observations vary, the underlying geological processes follow invariant relationships. IREX identifies and reasons over these invariants — treating each target as a system to be understood, not a pattern to be matched.</p>
          <p className="manifesto-final">Exploration is not prediction — <em>It is reasoning under uncertainty.</em></p>
        </div>
      </section>

      <section id="transparency" className="cards-section">
        <div className="section-shell">
          <span className="eyebrow">06 / TRANSPARENCY</span><h2 className="section-title">Designed for Auditability</h2>
          <div className="card-grid card-grid--2">{auditItems.map(([n,t,d]) => <SpotlightCard key={n}><span className="card-index">{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>)}</div>
          <p className="closing-line">Every decision can be inspected and challenged.<br />Every outcome can be examined and verified.</p>
        </div>
      </section>

      <section id="control" className="cards-section cards-section--control">
        <div className="section-shell">
          <span className="eyebrow">07 / CONTROL</span><h2 className="section-title">Built for Control</h2>
          <p className="lead">Designed for environments where control, reliability, and data ownership are non-negotiable.</p>
          <div className="card-grid card-grid--3">{controlItems.map(([n,t,d]) => <SpotlightCard key={n} spotlightColor="rgba(201,122,50,.16)"><span className="card-index">{n}</span><h3>{t}</h3><p>{d}</p></SpotlightCard>)}</div>
          <p className="closing-line">The system operates fully within your control — technically, operationally, and decisively.</p>
        </div>
      </section>

      <section id="value" className="value-section">
        <div className="section-shell">
          <span className="eyebrow">08 / VALUE</span><h2 className="section-title">Reduce Risk Before It Becomes Capital</h2>
          <div className="value-grid">
            <article><span>01</span><strong>GENERATE</strong><p>Multiple geological scenarios rapidly</p></article>
            <article><span>02</span><strong>TEST</strong><p>Interpretations before committing to drilling</p></article>
            <article><span>03</span><strong className="coral">REJECT</strong><p>Weak targets early</p></article>
            <article><span>04</span><strong>REDUCE</strong><p>False positives</p></article>
          </div>
          <div className="value-outcome"><p>Fewer costly errors.</p><p>Capital deployed with discipline.</p></div>
        </div>
      </section>

      <section id="positioning" className="positioning-section">
        <div className="positioning-card">
          <ShapeBlur className="positioning-card__effect" />
          <div className="positioning-card__content">
            <span className="eyebrow">09 / POSITIONING</span><h2>Not Another AI Tool</h2>
            <p className="positioning-lead">IREX is not a prediction model.</p>
            <p>It is a reasoning system designed to identify invariants within noisy data — enabling decisions grounded in system understanding, not statistical patterns.</p>
          </div>
        </div>
      </section>

      <section id="apply" className="cta-section">
        <Topography />
        <div className="cta-overlay" />
        <div className="cta-content">
          <span className="eyebrow">10 / EARLY ADOPTER PROGRAM</span><h2>Deploy IREX in a live exploration environment.</h2>
          <p>We are selecting a small number of partners to test, validate, and refine a new approach to exploration — based on reasoning, not prediction.</p>
          <SpecularButton onClick={openApply}>Apply to Join <span aria-hidden="true">↗</span></SpecularButton>
          <span className="microcopy">We work with a small number of selected partners.</span>
        </div>
      </section>

      <footer className="site-footer">
        <a href="#hero" className="footer-logo" aria-label="IREX home"><img src="/brand/irex-logo-dark.png" alt="IREX" /></a>
        <a href="https://www.linkedin.com/company/irex-pty-ltd/" target="_blank" rel="noreferrer" className="linkedin-link" aria-label="IREX on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.4H3.2V21h3.3V8.4ZM4.85 3A1.95 1.95 0 1 0 4.85 6.9 1.95 1.95 0 0 0 4.85 3ZM21 13.8c0-3.8-2-5.6-4.7-5.6-2.17 0-3.14 1.2-3.68 2.04V8.4H9.3V21h3.32v-6.24c0-1.65.31-3.25 2.36-3.25 2.02 0 2.04 1.89 2.04 3.36V21H21v-7.2Z"/></svg></a>
        <p>All rights reserved for IREX Pty Ltd.</p>
      </footer>

      <ApplyModal open={applyOpen} onClose={closeApply} />
    </main>
  );
}

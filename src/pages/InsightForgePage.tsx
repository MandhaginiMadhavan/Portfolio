import { useEffect, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, BrainCircuit, Database, ExternalLink, FileCheck2, FileText, Github, ShieldCheck, Workflow } from 'lucide-react'
import { BrainBackdrop } from '../components/BrainBackdrop'
import { Reveal } from '../components/Reveal'
import { returnToPortfolioHome } from '../projectNavigation'

const featureHighlights = [
  ['Investigate mixed evidence', 'Analyse a business question against bounded CSV, XLSX, PDF, and internal knowledge sources.'],
  ['Keep findings traceable', 'Return evidence-grounded findings with source provenance, confidence, validation, and next-step guidance.'],
  ['Retrieve internal knowledge', 'Use local lexical retrieval, with optional OpenAI embeddings for hybrid ranking when configured.'],
  ['Add research deliberately', 'Run optional public-web research only when it is explicitly selected and enabled.'],
  ['Review uncertain findings', 'Escalate defined evidence problems for human review without treating every low-confidence result as a failure.'],
  ['Reopen and export results', 'Store privacy-minimised investigation snapshots and create PDF or Excel reports without rerunning providers.'],
]

const workflow = [
  ['Submit Question & Evidence', 'Enter a business question and optionally attach a CSV, XLSX, or PDF or select available research sources.'],
  ['Analyse Information', 'The prototype examines the supplied data and documents within controlled processing limits.'],
  ['Collect Evidence', 'Relevant material is assembled while keeping uploaded, internal, and public sources distinguishable.'],
  ['Validate Findings', 'Evidence references and claims are checked before unresolved evidence problems are flagged for review.'],
  ['Present Results', 'The user receives traceable findings with confidence, validation, and practical next-step guidance.'],
]

const technologies = [
  'React', 'TypeScript', 'Vite', 'FastAPI', 'Python 3.11', 'Pydantic', 'OpenAI API · optional',
  'RAG', 'SQLite', 'SQLAlchemy', 'Alembic', 'pypdf', 'openpyxl', 'ReportLab', 'Docker', 'Nginx',
]

function SectionTitle({ eyebrow, children, copy }: { eyebrow: string; children: ReactNode; copy?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="insightforge-eyebrow">{eyebrow}</p>
      <h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{children}</h2>
      {copy && <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">{copy}</p>}
    </div>
  )
}

function FlowConnector() {
  return <div className="insightforge-flow-connector" aria-hidden="true"><span /></div>
}

function InlineArrow() {
  return <span className="insightforge-inline-arrow" aria-hidden="true"><ArrowRight size={19} /></span>
}

function FlowNode({ children, tone = 'violet', label }: { children: ReactNode; tone?: 'violet' | 'gold' | 'optional'; label?: string }) {
  return (
    <div className={`insightforge-flow-node is-${tone}`}>
      {label && <span className="insightforge-flow-label">{label}</span>}
      <span>{children}</span>
    </div>
  )
}

export function InsightForgePage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'InsightForge Case Study | Mandhagini Madhavan'
    window.scrollTo(0, 0)
    return () => { document.title = previousTitle }
  }, [])

  return (
    <div className="insightforge-page relative min-h-screen overflow-x-hidden bg-ink text-white">
      <BrainBackdrop />
      <a href="#case-study" className="sr-only z-[100] bg-white px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to case study</a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-ink/80 backdrop-blur-xl">
        <div className="page-shell flex h-20 items-center justify-between">
          <a href="/" className="insightforge-heading text-sm font-semibold tracking-[0.22em] text-white" aria-label="Return to portfolio homepage">MM.</a>
          <a href="/" onClick={(event) => { event.preventDefault(); returnToPortfolioHome() }} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-violet/25 bg-violet/[0.06] px-4 text-sm text-white/72 transition hover:border-violet/55 hover:text-white"><ArrowLeft size={16} aria-hidden="true" /> Back to portfolio</a>
        </div>
      </header>

      <main id="case-study" className="relative z-10">
        <section className="relative flex min-h-[82vh] items-center pb-24 pt-36">
          <div className="pointer-events-none absolute left-[60%] top-1/3 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet/[0.1] blur-[150px]" />
          <div className="page-shell">
            <Reveal className="max-w-5xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-gold/35 bg-gold/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.19em] text-gold">Working prototype</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/38">AI engineering case study · 2026</span>
              </div>
              <h1 className="insightforge-heading mt-8 text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.2rem]">Insight<span className="text-gold">Forge</span></h1>
              <p className="mt-8 max-w-4xl text-lg leading-8 text-white/66 sm:text-xl sm:leading-9">A business investigation workspace that turns structured data, documents, internal knowledge, and optional web research into traceable, evidence-grounded findings.</p>
              <p className="mt-6 flex items-center gap-3 text-sm font-medium text-white/62"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_10px_rgba(214,182,111,.55)]" aria-hidden="true" /> Independently designed and developed as a full-stack AI engineering project.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="https://insightforge-frontend-xtfp.onrender.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-gold">View live demo <ExternalLink size={16} aria-hidden="true" /></a>
                <a href="https://github.com/MandhaginiMadhavan/InsightForge" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-violet/55 hover:bg-violet/[0.09]"><Github size={17} aria-hidden="true" /> View GitHub</a>
              </div>
              <p className="mt-7 max-w-3xl border-l border-violet/40 pl-4 text-xs leading-6 text-white/43"><span className="font-semibold uppercase tracking-[0.12em] text-violet/80">Prototype scope</span> — Built to explore reliable, evidence-grounded AI investigation workflows; it is not yet an enterprise-ready, multi-tenant product.</p>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/55 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="The challenge">The Problem &amp; Solution</SectionTitle></Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal className="border-t border-white/[0.1] pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">The problem</p>
                <p className="mt-4 text-base leading-8 text-white/62">Business investigations often require evidence from spreadsheets, documents, internal knowledge, and public sources. Bringing those inputs together while preserving provenance and checking whether each conclusion is supported can become fragmented and difficult to review.</p>
              </Reveal>
              <Reveal delay={0.06} className="border-t border-gold/25 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">The solution</p>
                <p className="mt-4 text-base leading-8 text-white/62">InsightForge provides one bounded workflow for analysing that evidence and producing traceable findings. Deterministic services control calculations, extraction, retrieval boundaries, validation, escalation, and exports; optional LLM capabilities assist with planning, synthesis, and critique only when configured.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Prototype capabilities" copy="The experience is designed around useful investigation outcomes rather than exposing the complexity of the underlying services.">What I Built</SectionTitle></Reveal>
            <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
              {featureHighlights.map(([title, description], index) => (
                <Reveal key={title} delay={(index % 2) * 0.05} className="border-t border-white/[0.09] py-7">
                  <article className="grid grid-cols-[2.25rem_1fr] gap-4">
                    <span className="insightforge-feature-number">{String(index + 1).padStart(2, '0')}</span>
                    <div><h3 className="insightforge-heading text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-white/56">{description}</p></div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/60 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="System design" copy="A bounded, observable architecture keeps evidence and deterministic controls at the centre while allowing configured AI assistance.">System Architecture</SectionTitle></Reveal>
            <Reveal delay={0.04} className="insightforge-architecture-legend mt-7">
              <span><i className="is-core" aria-hidden="true" /> Core deterministic flow</span>
              <span><i className="is-optional" aria-hidden="true" /> Optional or configuration-dependent</span>
              <span><i className="is-supporting" aria-hidden="true" /> Conditional or supporting capability</span>
            </Reveal>
            <Reveal delay={0.08} className="mt-12">
              <div className="insightforge-architecture" role="img" aria-label="InsightForge system architecture. React and TypeScript connect to FastAPI validation, which invokes a Supervisor. The Supervisor coordinates data analysis, document analysis, internal knowledge retrieval, and optional external web research. Outputs merge into a typed evidence ledger, then pass to evidence-grounded synthesis and deterministic validation to produce findings. Optional LLM assistance, conditional human review, SQLite history, and PDF or Excel exports are clearly marked as supporting capabilities rather than required stages.">
                <div className="insightforge-core-row">
                  <FlowNode><span className="inline-flex items-center justify-center gap-2"><Workflow size={17} aria-hidden="true" /> React + TypeScript</span></FlowNode>
                  <InlineArrow />
                  <FlowNode><span className="inline-flex items-center justify-center gap-2"><FileCheck2 size={17} aria-hidden="true" /> FastAPI validation</span></FlowNode>
                  <InlineArrow />
                  <FlowNode tone="gold"><span className="inline-flex items-center justify-center gap-2"><BrainCircuit size={17} aria-hidden="true" /> Supervisor</span></FlowNode>
                </div>
                <FlowConnector />
                <div className="insightforge-specialist-network">
                  <div className="insightforge-specialist-grid">
                    <FlowNode label="Deterministic">Data analysis</FlowNode>
                    <FlowNode label="Deterministic">Document analysis</FlowNode>
                    <FlowNode label="Local retrieval">Internal knowledge</FlowNode>
                    <FlowNode tone="optional" label="Optional · configured">External web research</FlowNode>
                  </div>
                </div>
                <FlowConnector />
                <FlowNode tone="gold"><span className="inline-flex items-center justify-center gap-2"><Database size={17} aria-hidden="true" /> Typed evidence ledger with distinct provenance</span></FlowNode>
                <FlowConnector />
                <div className="insightforge-core-row is-two-stage">
                  <FlowNode label="Optional LLM assistance when configured">Evidence-grounded synthesis</FlowNode>
                  <InlineArrow />
                  <FlowNode label="Application-controlled">Deterministic validation</FlowNode>
                </div>
                <FlowConnector />
                <FlowNode tone="gold"><span className="inline-flex items-center justify-center gap-2"><ShieldCheck size={17} aria-hidden="true" /> Traceable findings + next-step guidance</span></FlowNode>
                <div className="insightforge-supporting-capabilities">
                  <p>Supporting capabilities — available when relevant, not mandatory processing stages</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <FlowNode tone="optional" label="Conditional">Human-review escalation</FlowNode>
                    <FlowNode label="Supporting"><span className="inline-flex items-center justify-center gap-2"><Database size={16} aria-hidden="true" /> SQLite history</span></FlowNode>
                    <FlowNode label="Supporting"><span className="inline-flex items-center justify-center gap-2"><FileText size={16} aria-hidden="true" /> PDF + Excel exports</span></FlowNode>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="User journey" copy="The internal orchestration stays behind the interface, leaving a clear five-step investigation experience.">Investigation Workflow</SectionTitle></Reveal>
            <ol className="insightforge-journey mt-12">
              {workflow.map(([title, description], index) => (
                <Reveal key={title} delay={index * 0.045} className="insightforge-journey-step">
                  <li><span className="insightforge-journey-number">{String(index + 1).padStart(2, '0')}</span><h3 className="insightforge-heading mt-5 text-base font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{description}</p></li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-white/[0.07] bg-surface/65 py-20 sm:py-24">
          <div className="page-shell grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <Reveal><SectionTitle eyebrow="Technology">Technologies</SectionTitle></Reveal>
              <Reveal delay={0.05}>
                <ul className="mt-9 flex flex-wrap gap-2.5" aria-label="InsightForge technologies">{technologies.map((technology) => <li key={technology} className="rounded-full border border-violet/22 bg-violet/[0.055] px-3.5 py-2 text-xs text-white/65">{technology}</li>)}</ul>
                <p className="mt-6 text-xs leading-6 text-white/38">Provider-backed interpretation, embeddings, and web research remain optional and configuration-dependent.</p>
              </Reveal>
            </div>
            <Reveal delay={0.08}>
              <p className="insightforge-eyebrow">Key learning</p>
              <h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Reliable AI needs boundaries</h2>
              <p className="mt-7 text-base leading-8 text-white/62">Building InsightForge reinforced that reliable AI systems depend as much on deterministic boundaries as on model capability. The prototype developed practical experience in bounded agent orchestration, RAG and hybrid retrieval, evidence provenance, fallback design, human escalation, and connecting those concerns to full-stack APIs, persistence, testing, exports, and deployment trade-offs.</p>
              <p className="mt-5 text-sm leading-7 text-white/45">InsightForge remains a working prototype rather than an enterprise-ready, multi-tenant product. Deeper implementation documentation is available in the GitHub repository.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://insightforge-frontend-xtfp.onrender.com" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-ink transition hover:bg-white">Open live demo <ExternalLink size={16} aria-hidden="true" /></a>
                <a href="https://github.com/MandhaginiMadhavan/InsightForge" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-violet/35 px-6 text-sm font-semibold text-white transition hover:border-violet hover:bg-violet/[0.08]"><Github size={17} aria-hidden="true" /> Read the README</a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07] bg-ink/60 py-9">
        <div className="page-shell flex flex-col gap-4 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Mandhagini Madhavan</p>
          <a href="/#projects" className="inline-flex items-center gap-2 text-white/58 transition hover:text-white"><ArrowLeft size={15} aria-hidden="true" /> Back to selected projects</a>
        </div>
      </footer>
    </div>
  )
}

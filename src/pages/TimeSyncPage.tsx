import { useEffect, type ReactNode } from 'react'
import { ArrowLeft, AudioWaveform, CircleCheck, ExternalLink, FileText, Github, Scissors, ShieldCheck, Video } from 'lucide-react'
import { BrainBackdrop } from '../components/BrainBackdrop'
import { Reveal } from '../components/Reveal'
import { returnToPortfolioHome } from '../projectNavigation'

const highlights = [
  ['Local speech transcription', 'Uses OpenAI Whisper locally to produce speech-derived word timestamps from the uploaded video.'],
  ['Timestamp alignment', 'Aligns caption metadata with recognised speech so corresponding boundaries can be compared.'],
  ['Deterministic resolution', 'Applies explainable Python rules to resolve conflicts without using an LLM agent.'],
  ['Independent Critic', 'Separately validates Resolver decisions and approves or withholds each boundary.'],
  ['Human review', 'Surfaces uncertain boundaries for review while preserving the original automated decision trail.'],
  ['Clips and audit reports', 'Uses FFmpeg for eligible clips and provides downloadable reports describing decisions and outcomes.'],
]

const workflow = [
  ['Upload Video & Captions', 'Provide the source video and its caption timestamp metadata.'],
  ['Transcribe & Align', 'Whisper transcribes speech and the application aligns recognised words with the captions.'],
  ['Compare Timestamps', 'Caption and speech boundaries are compared to identify meaningful disagreements.'],
  ['Validate Boundaries', 'The deterministic Resolver proposes a boundary and the independent Critic checks it.'],
  ['Generate Eligible Clips & Reports', 'Only intervals with two approved endpoints are cut, while decisions are retained in audit reports.'],
]

const technologies = ['Python', 'OpenAI Whisper', 'PyTorch', 'Streamlit', 'FFmpeg', 'ffprobe', 'pytest', 'Docker']

function SectionTitle({ eyebrow, children, copy }: { eyebrow: string; children: ReactNode; copy?: string }) {
  return <div className="max-w-3xl"><p className="insightforge-eyebrow">{eyebrow}</p><h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{children}</h2>{copy && <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">{copy}</p>}</div>
}

function FlowNode({ children, tone = 'violet', label }: { children: ReactNode; tone?: 'violet' | 'gold' | 'optional'; label?: string }) {
  return <div className={`insightforge-flow-node is-${tone}`}>{label && <span className="insightforge-flow-label">{label}</span>}<span>{children}</span></div>
}

function FlowConnector() {
  return <div className="insightforge-flow-connector" aria-hidden="true"><span /></div>
}

export function TimeSyncPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'TimeSync AI Case Study | Mandhagini Madhavan'
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
          <div className="pointer-events-none absolute left-[58%] top-1/3 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-violet/[0.11] blur-[150px]" />
          <div className="page-shell">
            <Reveal className="max-w-5xl">
              <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-gold/35 bg-gold/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.19em] text-gold">Assessment Prototype</span><span className="text-xs uppercase tracking-[0.2em] text-white/38">Speech AI · Video Processing · 2026</span></div>
              <h1 className="insightforge-heading mt-8 text-5xl font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-7xl lg:text-[6.2rem]">TimeSync <span className="text-gold">AI</span></h1>
              <p className="mt-8 max-w-4xl text-lg leading-8 text-white/66 sm:text-xl sm:leading-9">TimeSync AI compares caption timestamps with AI-generated speech timestamps, detects inconsistencies and creates video clips only when their boundaries pass independent validation.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="https://timesync-ai-production.up.railway.app" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-gold">View live demo <ExternalLink size={16} aria-hidden="true" /></a>
                <a href="https://github.com/MandhaginiMadhavan/timesync-ai" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-violet/55 hover:bg-violet/[0.09]"><Github size={17} aria-hidden="true" /> View GitHub</a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/55 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="The challenge">The Problem &amp; Solution</SectionTitle></Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal className="border-t border-white/[0.1] pt-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">The problem</p><p className="mt-4 text-base leading-8 text-white/62">Caption timestamps do not always match the moment spoken words occur in a video. If those timestamps are used directly, generated clips can begin or end too early and cut speech incorrectly.</p></Reveal>
              <Reveal delay={0.06} className="border-t border-gold/25 pt-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">The solution</p><p className="mt-4 text-base leading-8 text-white/62">TimeSync AI compares caption boundaries with timestamps produced by Whisper, resolves disagreements with deterministic rules, and independently validates each decision before any eligible interval is cut.</p></Reveal>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Core capabilities" copy="The prototype combines speech recognition with explicit decision and safety controls.">What I Built</SectionTitle></Reveal>
            <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
              {highlights.map(([title, description], index) => <Reveal key={title} delay={(index % 2) * 0.05} className="border-t border-white/[0.09] py-7"><article className="grid grid-cols-[2.25rem_1fr] gap-4"><span className="insightforge-feature-number">{String(index + 1).padStart(2, '0')}</span><div><h3 className="insightforge-heading text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-white/56">{description}</p></div></article></Reveal>)}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/60 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="System design" copy="Whisper supplies the machine-learning timestamps; every resolution and approval decision remains deterministic Python logic.">System Architecture</SectionTitle></Reveal>
            <Reveal delay={0.08} className="mt-12">
              <div className="insightforge-architecture timesync-architecture" role="img" aria-label="TimeSync AI architecture. Video and caption metadata are parsed while local Whisper transcribes speech. The application aligns words, detects conflicts, and sends them through a deterministic Resolver and independent deterministic Critic. Critic-approved consecutive boundary pairs can be cut with FFmpeg. Uncertain boundaries are withheld for human review and reviewed boundaries do not automatically become executable. Audit reporting records decisions and outcomes alongside the pipeline.">
                <FlowNode tone="gold"><span className="inline-flex items-center justify-center gap-2"><Video size={17} aria-hidden="true" /> Video + Caption Metadata</span></FlowNode><FlowConnector />
                <FlowNode><span className="inline-flex items-center justify-center gap-2"><AudioWaveform size={17} aria-hidden="true" /> Caption Parsing + Local Whisper Transcription</span></FlowNode><FlowConnector />
                <FlowNode>Word Alignment + Conflict Detection</FlowNode><FlowConnector />
                <FlowNode label="Deterministic Python logic">Resolver</FlowNode><FlowConnector />
                <FlowNode label="Independent deterministic validation"><span className="inline-flex items-center justify-center gap-2"><ShieldCheck size={17} aria-hidden="true" /> Critic</span></FlowNode><FlowConnector />

                <div className="timesync-branch-stage">
                  <p>Conditional outcomes</p>
                  <div className="timesync-branch-grid">
                    <FlowNode tone="gold" label="Both endpoints Critic-approved"><span className="inline-flex items-center justify-center gap-2"><Scissors size={16} aria-hidden="true" /> FFmpeg clip generation</span></FlowNode>
                    <FlowNode tone="optional" label="Uncertain boundary">Withheld for human review</FlowNode>
                  </div>
                </div>
                <div className="timesync-safety-note"><CircleCheck size={16} aria-hidden="true" /><span>A video interval is cut only when <strong>both</strong> endpoint boundaries are Critic-approved. Human-reviewed boundaries do not automatically become executable in the current application.</span></div>
                <div className="insightforge-supporting-capabilities">
                  <p>Supporting capability — records the pipeline rather than controlling its decisions</p>
                  <FlowNode label="Decision and execution record"><span className="inline-flex items-center justify-center gap-2"><FileText size={16} aria-hidden="true" /> Downloadable audit reporting</span></FlowNode>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="User journey" copy="A five-step flow turns source media into validated clips and an inspectable decision record.">Application Workflow</SectionTitle></Reveal>
            <ol className="insightforge-journey mt-12">{workflow.map(([title, description], index) => <Reveal key={title} delay={index * 0.045} className="insightforge-journey-step"><li><span className="insightforge-journey-number">{String(index + 1).padStart(2, '0')}</span><h3 className="insightforge-heading mt-5 text-base font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{description}</p></li></Reveal>)}</ol>
          </div>
        </section>

        <section className="border-t border-white/[0.07] bg-surface/65 py-20 sm:py-24">
          <div className="page-shell grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div><Reveal><SectionTitle eyebrow="Technology">Technologies</SectionTitle></Reveal><Reveal delay={0.05}><ul className="mt-9 flex flex-wrap gap-2.5" aria-label="TimeSync AI technologies">{technologies.map((technology) => <li key={technology} className="rounded-full border border-violet/22 bg-violet/[0.055] px-3.5 py-2 text-xs text-white/65">{technology}</li>)}</ul></Reveal></div>
            <Reveal delay={0.08}><p className="insightforge-eyebrow">Key learning</p><h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Machine learning needs reliable decision boundaries</h2><p className="mt-7 text-base leading-8 text-white/62">Building TimeSync AI developed practical experience in combining machine-learning output with deterministic validation, representing uncertainty explicitly, and designing media-processing workflows that avoid unsafe execution. It reinforced that a model prediction is one source of evidence—not permission to perform an irreversible action.</p></Reveal>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07] bg-ink/60 py-9"><div className="page-shell flex flex-col gap-4 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Mandhagini Madhavan</p><a href="/#projects" className="inline-flex items-center gap-2 text-white/58 transition hover:text-white"><ArrowLeft size={15} aria-hidden="true" /> Back to selected projects</a></div></footer>
    </div>
  )
}

import { useEffect, type ReactNode } from 'react'
import { ArrowLeft, BrainCircuit, ExternalLink, Github, SlidersHorizontal, UserRound, Workflow } from 'lucide-react'
import { BrainBackdrop } from '../components/BrainBackdrop'
import { Reveal } from '../components/Reveal'
import { returnToPortfolioHome } from '../projectNavigation'

const highlights = [
  ['Three communication styles', 'Generates three distinct recruiter-facing messages so the user can compare tone and positioning.'],
  ['OpenAI or Gemini', 'Lets the user choose GPT-4o Mini or Gemini 2.5 Flash for each generation rather than calling both providers.'],
  ['Candidate-context personalisation', 'Combines the source content with candidate information to make each message relevant to its intended audience.'],
  ['Interactive result comparison', 'Keeps all three outputs together in the Streamlit interface for clear side-by-side review.'],
]

const workflow = [
  ['Enter Content', 'Provide the source story or information that should be adapted.'],
  ['Add Candidate Profile', 'Supply the candidate context used to personalise the recruiter messages.'],
  ['Select Model', 'Choose either OpenAI GPT-4o Mini or Gemini 2.5 Flash for the generation.'],
  ['Generate Messages', 'Send one structured request that returns all three communication styles.'],
  ['Compare Results', 'Review the persona outputs together and choose the most suitable approach.'],
]

const technologies = ['Python', 'Streamlit', 'OpenAI GPT-4o Mini', 'Gemini 2.5 Flash', 'Prompt Engineering', 'Structured Response Parsing', 'Session State']

function SectionTitle({ eyebrow, children, copy }: { eyebrow: string; children: ReactNode; copy?: string }) {
  return (
    <div className="max-w-3xl">
      <p className="insightforge-eyebrow">{eyebrow}</p>
      <h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{children}</h2>
      {copy && <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">{copy}</p>}
    </div>
  )
}

function FlowNode({ children, tone = 'violet', label }: { children: ReactNode; tone?: 'violet' | 'gold' | 'optional'; label?: string }) {
  return (
    <div className={`insightforge-flow-node is-${tone}`}>
      {label && <span className="insightforge-flow-label">{label}</span>}
      <span>{children}</span>
    </div>
  )
}

function FlowConnector() {
  return <div className="insightforge-flow-connector" aria-hidden="true"><span /></div>
}

export function PersonaMultiplierPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Persona Multiplier AI Case Study | Mandhagini Madhavan'
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Multi-LLM Application · Prompt Engineering · 2026</p>
              <h1 className="insightforge-heading mt-8 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.7rem]">Persona <span className="text-gold">Multiplier AI</span></h1>
              <p className="mt-8 max-w-4xl text-lg leading-8 text-white/66 sm:text-xl sm:leading-9">A Streamlit application that transforms source content and candidate information into three personalised recruiter outreach styles using a selected AI provider.</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="https://persona-multiplier-ai-3xfrbejgpsvabv2bmafzoc.streamlit.app/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-gold">View live demo <ExternalLink size={16} aria-hidden="true" /></a>
                <a href="https://github.com/MandhaginiMadhavan/persona-multiplier-ai" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-violet/55 hover:bg-violet/[0.09]"><Github size={17} aria-hidden="true" /> View GitHub</a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/55 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="The challenge">The Problem &amp; Solution</SectionTitle></Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal className="border-t border-white/[0.1] pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">The problem</p>
                <p className="mt-4 text-base leading-8 text-white/62">Turning one source story into relevant recruiter outreach takes more than changing a few words. Each message needs to reflect the candidate&apos;s background while offering a communication style appropriate for a different recruiter audience.</p>
              </Reveal>
              <Reveal delay={0.06} className="border-t border-gold/25 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">The solution</p>
                <p className="mt-4 text-base leading-8 text-white/62">Persona Multiplier AI combines the source content, candidate profile, selected model, and structured prompt instructions to generate three tailored messages in one request. The results remain together in the interface so their tone and positioning can be compared easily.</p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Core experience" copy="Four focused capabilities support a clear, repeatable recruiter-message workflow.">What I Built</SectionTitle></Reveal>
            <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
              {highlights.map(([title, description], index) => (
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
            <Reveal><SectionTitle eyebrow="System design" copy="One selected provider handles each generation, producing all three persona messages in a single structured request.">System Architecture</SectionTitle></Reveal>
            <Reveal delay={0.08} className="mt-12">
              <div className="insightforge-architecture persona-architecture" role="img" aria-label="Persona Multiplier AI architecture. The Streamlit interface sends validated input and a constructed prompt to one selected provider: either OpenAI GPT-4o Mini or Gemini 2.5 Flash. One request generates all three messages. The response is parsed and stored in Streamlit session state before the three persona outputs are displayed.">
                <FlowNode tone="gold"><span className="inline-flex items-center justify-center gap-2"><Workflow size={17} aria-hidden="true" /> Streamlit Interface</span></FlowNode>
                <FlowConnector />
                <FlowNode><span className="inline-flex items-center justify-center gap-2"><SlidersHorizontal size={17} aria-hidden="true" /> Input Validation &amp; Prompt Construction</span></FlowNode>
                <FlowConnector />
                <div className="persona-provider-stage">
                  <p>One provider selected per generation</p>
                  <div className="persona-provider-options">
                    <FlowNode label="Option A">OpenAI GPT-4o Mini</FlowNode>
                    <span className="persona-or" aria-hidden="true">OR</span>
                    <FlowNode label="Option B">Gemini 2.5 Flash</FlowNode>
                  </div>
                  <span className="persona-request-note">One request generates all three persona messages</span>
                </div>
                <FlowConnector />
                <FlowNode><span className="inline-flex items-center justify-center gap-2"><BrainCircuit size={17} aria-hidden="true" /> Response Parsing &amp; Streamlit Session State</span></FlowNode>
                <FlowConnector />
                <div className="persona-output-stage">
                  <p>Three persona outputs</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <FlowNode><span className="inline-flex items-center justify-center gap-2"><UserRound size={16} aria-hidden="true" /> Communication style 01</span></FlowNode>
                    <FlowNode><span className="inline-flex items-center justify-center gap-2"><UserRound size={16} aria-hidden="true" /> Communication style 02</span></FlowNode>
                    <FlowNode><span className="inline-flex items-center justify-center gap-2"><UserRound size={16} aria-hidden="true" /> Communication style 03</span></FlowNode>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="User journey" copy="A simple five-step flow keeps model and prompt complexity behind an approachable interface.">Application Workflow</SectionTitle></Reveal>
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
              <Reveal delay={0.05}><ul className="mt-9 flex flex-wrap gap-2.5" aria-label="Persona Multiplier AI technologies">{technologies.map((technology) => <li key={technology} className="rounded-full border border-violet/22 bg-violet/[0.055] px-3.5 py-2 text-xs text-white/65">{technology}</li>)}</ul></Reveal>
            </div>
            <Reveal delay={0.08}>
              <p className="insightforge-eyebrow">Key learning</p>
              <h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Designing consistent experiences across models</h2>
              <p className="mt-7 text-base leading-8 text-white/62">Building Persona Multiplier AI developed practical experience in multi-provider LLM integration, prompt engineering, and parsing structured responses into a consistent interface. It also reinforced the importance of keeping provider selection explicit while shaping one request to return several useful variations for comparison.</p>
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

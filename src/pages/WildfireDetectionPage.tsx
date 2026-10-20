import { useEffect, type ReactNode } from 'react'
import { ArrowLeft, BrainCircuit, Cloud, Github, Image, MessageSquareText, Network, ShieldAlert } from 'lucide-react'
import { BrainBackdrop } from '../components/BrainBackdrop'
import { Reveal } from '../components/Reveal'
import { returnToPortfolioHome } from '../projectNavigation'

const approaches = [
  ['Satellite image classification', 'Compared a Custom CNN, MobileNetV2, ResNet50 and an Attention CNN for binary fire/no-fire classification.'],
  ['Social-media sentiment', 'Used TF-IDF features with Logistic Regression to classify entered tweet text as negative/fire-related or positive/non-fire-related.'],
  ['Multimodal fusion', 'Combined the two predictions with an explicit rule: an alert is triggered only when the image indicates fire and the text is negative/fire-related.'],
  ['Federated learning', 'Explored privacy-aware distributed training with Flower, five simulated clients and federated averaging.'],
]

const workflow = [
  ['Collect inputs', 'Provide a satellite image and, for the fusion experiment, locally entered social-media text.'],
  ['Prepare data', 'Resize and normalise imagery; transform text with the fitted TF-IDF vectorizer.'],
  ['Run models', 'Apply the selected CNN and the Logistic Regression sentiment classifier.'],
  ['Fuse evidence', 'Use the verified rule to combine the image and sentiment labels.'],
  ['Present findings', 'Show predictions as research outputs, not as an emergency warning.'],
]

const modelResults = [
  ['Custom CNN', '96.88%', '0.20'],
  ['MobileNetV2', '99.53%', '0.02'],
  ['Attention CNN', '95.38%', '0.11'],
  ['ResNet50', '81.39%', '0.45'],
]

const technologies = ['Python', 'TensorFlow', 'Keras', 'scikit-learn', 'TF-IDF', 'Logistic Regression', 'Flower', 'FedAvg', 'Streamlit', 'NumPy', 'pandas', 'Pillow']

function SectionTitle({ eyebrow, children, copy }: { eyebrow: string; children: ReactNode; copy?: string }) {
  return <div className="max-w-3xl"><p className="insightforge-eyebrow">{eyebrow}</p><h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{children}</h2>{copy && <p className="mt-5 max-w-2xl text-base leading-8 text-white/58">{copy}</p>}</div>
}

function FlowNode({ children, tone = 'violet', label }: { children: ReactNode; tone?: 'violet' | 'gold' | 'optional'; label?: string }) {
  return <div className={`insightforge-flow-node is-${tone}`}>{label && <span className="insightforge-flow-label">{label}</span>}<span>{children}</span></div>
}

function FlowConnector() {
  return <div className="insightforge-flow-connector" aria-hidden="true"><span /></div>
}

export function WildfireDetectionPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Wildfire Detection Research | Mandhagini Madhavan'
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
            <Reveal className="max-w-6xl">
              <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-gold/35 bg-gold/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.19em] text-gold">Experimental research prototype</span><span className="text-xs uppercase tracking-[0.2em] text-white/38">MSc Artificial Intelligence · 2025</span></div>
              <h1 className="insightforge-heading mt-8 max-w-6xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.5rem]">Enhancing Wildfire Detection with <span className="text-gold">Satellite Images</span> and Social Media</h1>
              <p className="mt-8 max-w-4xl text-lg leading-8 text-white/66 sm:text-xl sm:leading-9">An MSc research project investigating whether computer vision, text sentiment and federated learning can contribute complementary evidence for earlier wildfire detection.</p>
              <div className="mt-8 flex flex-wrap gap-2.5" aria-label="Core technologies"><span className="skill-tag">Computer Vision</span><span className="skill-tag">NLP</span><span className="skill-tag">Multimodal Fusion</span><span className="skill-tag">Federated Learning</span></div>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="https://github.com/MandhaginiMadhavan/Enhancing-Wildfire-Detection-with-Data-from-Satellite-Images-and-Social-Media" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-violet/55 hover:bg-violet/[0.09]"><Github size={17} aria-hidden="true" /> View GitHub</a>
                <a href="https://ybesmanvdzs8u3rpqyhknj.streamlit.app/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition hover:bg-gold"><Cloud size={17} aria-hidden="true" /> View live demo</a>
              </div>
              <p className="mt-6 max-w-3xl border-l border-violet/40 pl-4 text-xs leading-6 text-white/43"><span className="font-semibold uppercase tracking-[0.12em] text-violet/80">Prototype scope</span> — This project supports research exploration only. It is not a production wildfire-monitoring or emergency-alert system.</p>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/55 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Research problem">Why early detection is difficult</SectionTitle></Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
              <Reveal className="border-t border-white/[0.1] pt-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet">The challenge</p><p className="mt-4 text-base leading-8 text-white/62">Wildfire scenes vary in scale, terrain, smoke, lighting and image quality. A model that performs strongly on validation data can still misread unfamiliar or visually ambiguous scenes, while social posts can be noisy, incomplete or unrelated.</p></Reveal>
              <Reveal delay={0.06} className="border-t border-gold/25 pt-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Research objective</p><p className="mt-4 text-base leading-8 text-white/62">The study compared image architectures, evaluated a lightweight sentiment pipeline, combined both modalities through transparent decision logic, and examined federated learning as a way to train across distributed clients.</p></Reveal>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Research approach" copy="Four connected experiments examined image evidence, text evidence, explicit fusion and distributed learning.">What I Investigated</SectionTitle></Reveal>
            <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
              {approaches.map(([title, description], index) => <Reveal key={title} delay={(index % 2) * 0.05} className="border-t border-white/[0.09] py-7"><article className="grid grid-cols-[2.25rem_1fr] gap-4"><span className="insightforge-feature-number">{String(index + 1).padStart(2, '0')}</span><div><h3 className="insightforge-heading text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-white/56">{description}</p></div></article></Reveal>)}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/60 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="System design" copy="The public demonstration performs local, user-initiated inference. It does not retrieve live tweets or send email alerts.">Architecture &amp; Fusion Workflow</SectionTitle></Reveal>
            <Reveal delay={0.08} className="mt-12">
              <div className="insightforge-architecture" role="img" aria-label="Wildfire research workflow. A satellite image passes through preprocessing and a selected CNN to produce a fire or no-fire prediction. Entered tweet text passes through TF-IDF and Logistic Regression to produce a negative fire-related or positive non-fire-related classification. A rule-based fusion stage triggers a research alert only when the image predicts fire and the text is negative and fire-related.">
                <FlowNode tone="gold"><span className="inline-flex items-center justify-center gap-2"><Image size={17} aria-hidden="true" /> Satellite image + locally entered tweet text</span></FlowNode><FlowConnector />
                <div className="timesync-branch-stage">
                  <p>Parallel evidence pipelines</p>
                  <div className="timesync-branch-grid">
                    <FlowNode label="Image branch"><span className="inline-flex items-center justify-center gap-2"><BrainCircuit size={16} aria-hidden="true" /> Resize + normalise → selected CNN</span></FlowNode>
                    <FlowNode label="Text branch"><span className="inline-flex items-center justify-center gap-2"><MessageSquareText size={16} aria-hidden="true" /> TF-IDF → Logistic Regression</span></FlowNode>
                  </div>
                </div>
                <FlowConnector /><FlowNode label="Transparent decision logic">Rule-based multimodal fusion</FlowNode><FlowConnector />
                <FlowNode tone="optional" label="Research alert condition"><span className="inline-flex items-center justify-center gap-2"><ShieldAlert size={16} aria-hidden="true" /> Image = fire AND text = negative/fire-related</span></FlowNode>
                <div className="insightforge-supporting-capabilities"><p>Public demo boundaries</p><FlowNode label="User-controlled prototype">No live Twitter retrieval · no email sending · no emergency dispatch</FlowNode></div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Application workflow" copy="A clear five-stage path keeps model outputs and fusion decisions inspectable.">From Input to Research Output</SectionTitle></Reveal>
            <ol className="insightforge-journey mt-12">{workflow.map(([title, description], index) => <Reveal key={title} delay={index * 0.045} className="insightforge-journey-step"><li><span className="insightforge-journey-number">{String(index + 1).padStart(2, '0')}</span><h3 className="insightforge-heading mt-5 text-base font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{description}</p></li></Reveal>)}</ol>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/60 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Model comparison" copy="These figures are validation results reported in the dissertation's consolidated model comparison; they are not independent test-set accuracy.">Image Classification Results</SectionTitle></Reveal>
            <Reveal delay={0.06} className="mt-12 overflow-hidden rounded-2xl border border-violet/20 bg-ink/45">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <caption className="sr-only">Validation accuracy and validation loss for four wildfire image-classification models</caption>
                  <thead className="border-b border-white/[0.09] bg-violet/[0.055] text-[0.68rem] uppercase tracking-[0.17em] text-white/44"><tr><th className="px-6 py-4 font-semibold">Architecture</th><th className="px-6 py-4 font-semibold">Validation accuracy</th><th className="px-6 py-4 font-semibold">Validation loss</th></tr></thead>
                  <tbody>{modelResults.map(([model, accuracy, loss]) => <tr key={model} className="border-b border-white/[0.07] last:border-0"><th scope="row" className="px-6 py-5 font-medium text-white/82">{model}</th><td className="px-6 py-5 text-gold">{accuracy}</td><td className="px-6 py-5 text-white/58">{loss}</td></tr>)}</tbody>
                </table>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="border-l border-gold/35 pl-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Validation</p><p className="mt-3 text-sm leading-7 text-white/56">MobileNetV2 produced the strongest recorded validation result in the consolidated comparison. This reflects performance on the study&apos;s validation split only.</p></div>
              <div className="border-l border-violet/35 pl-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet">Independent images</p><p className="mt-3 text-sm leading-7 text-white/56">The research also inspected individual external images qualitatively, but did not record an independently labelled aggregate test-set accuracy. Those examples therefore remain observations, not a second benchmark.</p></div>
            </Reveal>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="page-shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal><SectionTitle eyebrow="Federated learning" copy="A historical Flower experiment tested distributed training; the portfolio and Streamlit demo do not start a live federation.">Five Clients, One Shared Model</SectionTitle><div className="mt-9 inline-flex items-center gap-3 rounded-full border border-gold/25 bg-gold/[0.055] px-4 py-2 text-xs text-gold"><Network size={16} aria-hidden="true" /> 5 clients · 5 rounds · 3 local epochs · FedAvg</div></Reveal>
            <Reveal delay={0.08} className="space-y-5 text-base leading-8 text-white/62"><p>Each simulated client trained locally before sending model updates to a central Flower server. FedAvg aggregated all five client updates in every round and returned the shared parameters for the next round.</p><p>The dissertation&apos;s historical summary reports 85% global validation accuracy and 0.63 validation loss at the end of the experiment. These values describe that recorded research run; they are not live metrics and are not reproduced by this portfolio page.</p><p className="border-l border-violet/40 pl-4 text-sm text-white/48">Configuration: participation fraction 1.0, minimum five fit clients and minimum five available clients.</p></Reveal>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-surface/55 py-20 sm:py-24">
          <div className="page-shell">
            <Reveal><SectionTitle eyebrow="Reflection" copy="The project&apos;s most useful outcome was understanding where strong experimental scores stop being sufficient.">Challenges, Limitations &amp; Lessons</SectionTitle></Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Reveal className="border-t border-white/[0.1] pt-6"><h3 className="insightforge-heading text-base font-semibold text-white">Generalisation matters</h3><p className="mt-3 text-sm leading-7 text-white/56">High validation accuracy did not guarantee reliable behaviour on unfamiliar scenes. Dataset diversity, independent testing and calibration are essential before real-world use.</p></Reveal>
              <Reveal delay={0.05} className="border-t border-white/[0.1] pt-6"><h3 className="insightforge-heading text-base font-semibold text-white">Fusion is deliberately simple</h3><p className="mt-3 text-sm leading-7 text-white/56">The AND rule is transparent and reproducible, but does not model location, time, source credibility, uncertainty or changing wildfire language.</p></Reveal>
              <Reveal delay={0.1} className="border-t border-white/[0.1] pt-6"><h3 className="insightforge-heading text-base font-semibold text-white">Research is not operations</h3><p className="mt-3 text-sm leading-7 text-white/56">Operational detection would require continuously validated data, geospatial context, monitoring, human oversight and integration with authoritative emergency services.</p></Reveal>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.07] bg-surface/65 py-20 sm:py-24">
          <div className="page-shell grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div><Reveal><SectionTitle eyebrow="Technology">Technology Stack</SectionTitle></Reveal><Reveal delay={0.05}><ul className="mt-9 flex flex-wrap gap-2.5" aria-label="Wildfire research technologies">{technologies.map((technology) => <li key={technology} className="rounded-full border border-violet/22 bg-violet/[0.055] px-3.5 py-2 text-xs text-white/65">{technology}</li>)}</ul></Reveal></div>
            <Reveal delay={0.08}><p className="insightforge-eyebrow">Research takeaway</p><h2 className="insightforge-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Good metrics need good context</h2><p className="mt-7 text-base leading-8 text-white/62">This project strengthened my practical understanding of computer vision, classical NLP, multimodal decision logic and federated learning. More importantly, it showed why validation performance, independent generalisation and deployment readiness must be communicated as separate claims.</p></Reveal>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07] bg-ink/60 py-9"><div className="page-shell flex flex-col gap-4 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Mandhagini Madhavan</p><a href="/#projects" className="inline-flex items-center gap-2 text-white/58 transition hover:text-white"><ArrowLeft size={15} aria-hidden="true" /> Back to selected projects</a></div></footer>
    </div>
  )
}

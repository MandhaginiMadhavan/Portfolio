import { ArrowDown, ArrowRight, BarChart3, Bot, Download, Eye, Github, Layers3, Linkedin, Mail, MessageSquareText, Network } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { BrainBackdrop } from './components/BrainBackdrop'
import { openPortfolioAssistantEvent, PortfolioAssistant } from './components/PortfolioAssistant'
import { CinematicIntro, useCinematicIntro } from './components/CinematicIntro'
import { Reveal } from './components/Reveal'
import { SectionHeading } from './components/SectionHeading'
import { projects, skillGroups } from './data'
import { InsightForgePage } from './pages/InsightForgePage'
import { PersonaMultiplierPage } from './pages/PersonaMultiplierPage'
import { TimeSyncPage } from './pages/TimeSyncPage'
import { WildfireDetectionPage } from './pages/WildfireDetectionPage'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

function SkillProjectionNetwork() {
  const networkRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [paths, setPaths] = useState<string[]>([])

  useLayoutEffect(() => {
    const network = networkRef.current
    const svg = svgRef.current
    const stage = network?.parentElement
    if (!network || !svg || !stage) return

    let measurementFrame = 0
    let animationFrame = 0
    let cancelled = false

    const updatePaths = () => {
      const laptop = stage.querySelector<HTMLImageElement>('[data-laptop-anchor]')
      const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-skill-anchor]'))
      if (!laptop || cards.length !== 6) return

      const screenMatrix = svg.getScreenCTM()
      if (!screenMatrix) return
      const inverseMatrix = screenMatrix.inverse()
      const toSvgPoint = (x: number, y: number) => {
        const point = svg.createSVGPoint()
        point.x = x
        point.y = y
        return point.matrixTransform(inverseMatrix)
      }

      const laptopRect = laptop.getBoundingClientRect()
      const origin = toSvgPoint(
        laptopRect.left + laptopRect.width * 0.72,
        laptopRect.top + laptopRect.height * 0.67,
      )

      setPaths(cards.map((card, index) => {
        const cardRect = card.getBoundingClientRect()
        const topLeft = toSvgPoint(cardRect.left, cardRect.top)
        const bottomRight = toSvgPoint(cardRect.right, cardRect.bottom)
        const box = {
          left: topLeft.x,
          top: topLeft.y,
          width: bottomRight.x - topLeft.x,
          height: bottomRight.y - topLeft.y,
        }
        const center = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
        const dx = center.x - origin.x
        const dy = center.y - origin.y

        // Meet the card on the edge facing the laptop, not underneath its text.
        const scaleX = Math.abs(dx) > 0 ? (box.width / 2) / Math.abs(dx) : Number.POSITIVE_INFINITY
        const scaleY = Math.abs(dy) > 0 ? (box.height / 2) / Math.abs(dy) : Number.POSITIVE_INFINITY
        const edgeScale = Math.min(scaleX, scaleY)
        const end = index === 5
          ? { x: center.x, y: box.top + box.height - 5 }
          : { x: center.x - dx * edgeScale, y: center.y - dy * edgeScale }

        const pathDx = end.x - origin.x
        const pathDy = end.y - origin.y
        const distance = Math.max(Math.hypot(pathDx, pathDy), 1)
        const bend = Math.min(48, distance * 0.12) * (index % 2 === 0 ? -1 : 1)
        const normal = { x: -pathDy / distance, y: pathDx / distance }
        const isLowerConnection = index >= 4
        const outwardDirection = end.x < origin.x ? -1 : 1
        const firstControl = isLowerConnection
          ? {
              x: origin.x + pathDx * 0.18 + outwardDirection * 100,
              y: origin.y + pathDy * 0.18,
            }
          : {
              x: origin.x + pathDx * 0.3 + normal.x * bend,
              y: origin.y + pathDy * 0.3 + normal.y * bend,
            }
        const secondControl = isLowerConnection
          ? {
              x: end.x - pathDx * 0.18 + outwardDirection * 36,
              y: end.y - pathDy * 0.18,
            }
          : {
              x: origin.x + pathDx * 0.72 + normal.x * bend,
              y: origin.y + pathDy * 0.72 + normal.y * bend,
            }

        return `M ${origin.x} ${origin.y} C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${end.x} ${end.y}`
      }))
    }

    const scheduleMeasurement = () => {
      cancelAnimationFrame(measurementFrame)
      measurementFrame = requestAnimationFrame(updatePaths)
    }

    // Track the opening transforms until every card reaches its final position.
    const animationStart = performance.now()
    const trackEntranceLayout = (now: number) => {
      updatePaths()
      if (!cancelled && now - animationStart < 1800) {
        animationFrame = requestAnimationFrame(trackEntranceLayout)
      }
    }
    animationFrame = requestAnimationFrame(trackEntranceLayout)

    const resizeObserver = new ResizeObserver(scheduleMeasurement)
    resizeObserver.observe(stage)
    stage.querySelectorAll<HTMLElement>('[data-laptop-anchor], [data-skill-anchor]').forEach((element) => resizeObserver.observe(element))

    const visualViewport = window.visualViewport
    window.addEventListener('resize', scheduleMeasurement)
    window.addEventListener('scroll', scheduleMeasurement, { passive: true })
    visualViewport?.addEventListener('resize', scheduleMeasurement)
    visualViewport?.addEventListener('scroll', scheduleMeasurement)
    stage.addEventListener('animationend', scheduleMeasurement)

    const laptop = stage.querySelector<HTMLImageElement>('[data-laptop-anchor]')
    laptop?.addEventListener('load', scheduleMeasurement)
    if (laptop?.complete) laptop.decode().then(scheduleMeasurement).catch(scheduleMeasurement)

    document.fonts?.ready.then(() => {
      if (!cancelled) scheduleMeasurement()
    })
    document.fonts?.addEventListener('loadingdone', scheduleMeasurement)

    return () => {
      cancelled = true
      cancelAnimationFrame(measurementFrame)
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', scheduleMeasurement)
      window.removeEventListener('scroll', scheduleMeasurement)
      visualViewport?.removeEventListener('resize', scheduleMeasurement)
      visualViewport?.removeEventListener('scroll', scheduleMeasurement)
      stage.removeEventListener('animationend', scheduleMeasurement)
      laptop?.removeEventListener('load', scheduleMeasurement)
      document.fonts?.removeEventListener('loadingdone', scheduleMeasurement)
    }
  }, [])

  const renderPaths = () => paths.map((path, index) => {
    const color = index % 3 === 2 ? '#d6b66f' : index % 2 ? '#7185ff' : '#aa8dff'
    return (
    <g key={index}>
      <path d={path} className="skill-projection-halo" vectorEffect="non-scaling-stroke" />
      <path d={path} className="skill-projection-path" vectorEffect="non-scaling-stroke" />
      {[0, 1].map((particleIndex) => (
        <g className="skill-projection-particle" key={particleIndex}>
          <circle r="5" fill={color} opacity=".16" />
          <circle r="2.4" fill={color} />
          <animateMotion path={path} dur={`${4.4 + index * 0.28}s`} begin={`${-(particleIndex * 2.2 + index * 0.41)}s`} repeatCount="indefinite" calcMode="paced" />
        </g>
      ))}
    </g>
    )
  })

  return (
    <div ref={networkRef} className="skill-projection-network pointer-events-none absolute inset-0 z-[5] overflow-visible" aria-hidden="true">
      <svg ref={svgRef} className="h-full w-full overflow-visible" width="100%" height="100%" fill="none">
        {renderPaths()}
      </svg>
    </div>
  )
}

function Hero() {
  const heroSkills = [
    { label: 'Generative AI', icon: Eye, position: '2xl:-left-32 2xl:top-6', delay: '-1.2s', desktopX: '396px', desktopY: '309px', mobileX: '100px', mobileY: '-120px' },
    { label: 'Python & APIs', icon: MessageSquareText, position: '2xl:-right-32 2xl:top-10', delay: '-3.8s', desktopX: '-284px', desktopY: '297px', mobileX: '-100px', mobileY: '-120px' },
    { label: 'RAG Systems', icon: Bot, position: '2xl:-left-32 2xl:top-[52%]', delay: '-2.5s', desktopX: '396px', desktopY: '65px', mobileX: '100px', mobileY: '-180px' },
    { label: 'Machine Learning', icon: BarChart3, position: '2xl:-right-32 2xl:top-[calc(47%_-_46px)]', delay: '-4.6s', desktopX: '-284px', desktopY: '93px', mobileX: '-100px', mobileY: '-180px' },
    { label: 'Agentic AI', icon: Network, position: '2xl:-left-32 2xl:top-[78%]', delay: '-5.4s', desktopX: '396px', desktopY: '-65px', mobileX: '100px', mobileY: '-240px' },
    { label: 'Full-Stack AI', icon: Layers3, position: '2xl:-right-32 2xl:top-[calc(69%_-_40px)]', delay: '-0.7s', desktopX: '-284px', desktopY: '-24px', mobileX: '-100px', mobileY: '-240px' },
  ]

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="page-shell relative z-10 pb-24 pt-20 sm:pb-28 sm:pt-24">
        <div className="grid min-h-[calc(100vh-10rem)] items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <div>
            <Reveal>
              <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-gold sm:text-sm">
                <span className="h-px w-10 bg-gold/70" /> AI Engineer
              </p>
              <h1 className="max-w-3xl overflow-visible font-display text-[clamp(2.596rem,5.764vw,6.028rem)] font-semibold leading-[1.12] tracking-[-0.055em] text-white">
                <span className="block">Hey, I'm</span>
                <span className="block overflow-visible bg-gradient-to-r from-white via-violet to-indigo bg-clip-text pb-[0.14em] text-transparent">Mandhagini</span>
                <span className="block">Madhavan</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl text-lg leading-8 text-white/70 sm:text-xl">Building practical AI applications with LLMs, RAG and intelligent workflows.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#projects" className="group inline-flex min-h-12 items-center gap-3 bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-violet hover:text-white">
                  View Projects <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
                <a href="/resume.pdf" download="Mandhagini-Madhavan-AI-Engineer-CV.pdf" className="group inline-flex min-h-12 items-center gap-3 border border-violet/35 bg-violet/[0.045] px-6 py-3 text-sm font-semibold text-white/75 transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-gold/65 hover:bg-violet/[0.1] hover:text-white hover:shadow-[0_0_24px_rgba(155,135,245,0.15)]" aria-label="Download Mandhagini Madhavan's AI Engineer CV as a PDF">
                  Download Resume <Download size={17} className="text-gold transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal className="relative mx-auto w-full max-w-[38rem] lg:mr-0" delay={0.16}>
            <div className="relative 2xl:min-h-[34rem]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-3xl" />
              <div className="pointer-events-none absolute bottom-8 left-1/2 h-20 w-72 -translate-x-1/2 rounded-full bg-indigo/15 blur-2xl" />
              <SkillProjectionNetwork />

              <div className="relative z-10 mx-auto flex h-[23rem] w-full items-end justify-center sm:h-[26rem] 2xl:absolute 2xl:inset-0 2xl:h-auto">
                <img
                  src="/assets/hero-working-avatar.png"
                  alt="Mandhagini Madhavan working on a laptop"
                  data-laptop-anchor
                  className="h-auto w-[min(24rem,92vw)] object-contain object-bottom drop-shadow-[0_22px_45px_rgba(0,0,0,0.45)] lg:w-[24rem]"
                />
              </div>

              <ul className="relative z-20 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:-translate-x-44 2xl:absolute 2xl:inset-0 2xl:mt-0 2xl:block 2xl:translate-x-0" aria-label="AI engineering skills">
                {heroSkills.map((skill, index) => {
                  const Icon = skill.icon
                  return (
                    <li
                      key={skill.label}
                      data-skill-anchor
                      className={`hero-skill-anchor ${skill.position} 2xl:absolute 2xl:min-w-[11.5rem]`}
                      style={{
                        '--emerge-delay': `${0.2 + index * 0.12}s`,
                        '--desktop-x': skill.desktopX,
                        '--desktop-y': skill.desktopY,
                        '--mobile-x': skill.mobileX,
                        '--mobile-y': skill.mobileY,
                      } as CSSProperties}
                    >
                      <div
                        className="hero-skill-card flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl border border-violet/30 bg-[#0b0919]/80 px-4 py-3 text-center text-xs font-medium tracking-wide text-white/80 shadow-[0_14px_38px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl transition-[border-color,box-shadow,color] duration-300 hover:border-violet/65 hover:text-white hover:shadow-[0_0_32px_rgba(155,135,245,0.27)] sm:text-sm"
                        style={{ animationDelay: skill.delay }}
                      >
                        <Icon size={16} strokeWidth={1.6} className="shrink-0 text-violet" aria-hidden="true" />
                        {skill.label}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={0.22}>
            <div className="flex items-end justify-between border-t border-white/10 pt-7">
              <p className="max-w-2xl font-handwritten text-sm font-normal italic leading-relaxed tracking-[0.18em] text-white/60 sm:text-base">Where human curiosity meets artificial intelligence.</p>
              <a href="#about" className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-gold sm:flex">Discover <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/*
 * The remaining sections intentionally keep their phase-one implementation.
 * BrainBackdrop is isolated so the exact visual language can be reused later.
 */

function About() {
  return (
    <section id="about" className="section-space border-t border-white/[0.07]">
      <div className="page-shell">
        <Reveal className="grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-2 -z-10 rounded-[1.75rem] bg-violet/10 blur-xl" aria-hidden="true" />
            <div className="overflow-hidden rounded-[1.5rem] border border-violet/25 shadow-[0_22px_70px_rgba(7,7,17,0.42),0_0_28px_rgba(155,135,245,0.1)]">
              <img
                src="/assets/about-portrait.jpg"
                alt="Mandhagini Madhavan"
                className="h-auto w-full scale-[1.06] object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="relative isolate max-w-[45rem]">
            <div className="pointer-events-none absolute -inset-x-6 -inset-y-5 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(7,7,17,0.38),rgba(7,7,17,0.14)_58%,transparent_78%)] blur-sm" aria-hidden="true" />
            <p className="eyebrow">Behind the Code</p>
            <h2 className="about-heading text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">About Me</h2>
            <div className="about-copy mt-10 max-w-[45rem] space-y-6 text-[0.9375rem] leading-7 text-white/65 sm:text-base sm:leading-8">
              <p>Hi, I&apos;m Mandhagini, an MSc Artificial Intelligence graduate with a passion for understanding how intelligent systems work and turning ideas into real applications.</p>
              <p>My journey in AI has taken me from researching wildfire detection through deep learning to developing applications involving large language models and full-stack technologies. Along the way, I&apos;ve discovered that what I enjoy most isn&apos;t just building something that works, but understanding why it works and how it can be improved.</p>
              <p>I enjoy exploring different approaches, solving technical challenges and learning through hands-on development. Every project has been an opportunity to push my knowledge further and become a better engineer.</p>
              <p>
                Feel free to explore my <a href="#projects" className="about-inline-link">projects</a> to learn more about what I&apos;ve built. Curious about something? <button type="button" className="about-inline-link" aria-controls="portfolio-assistant-panel" onClick={() => window.dispatchEvent(new Event(openPortfolioAssistantEvent))}>Ask my AI assistant</button> anything about my work, projects or experience! And if you&apos;d like to get in touch, I&apos;d be happy to <a href="#contact" className="about-inline-link">connect</a>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects" className="section-space overflow-hidden bg-surface/55">
      <div className="page-shell">
        <Reveal>
          <SectionHeading eyebrow="Selected Projects" title="The Evolution of My Ideas" description="An interactive journey through my AI projects" />
        </Reveal>

        <div className="-mx-5 mt-16 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12" role="region" aria-label="Projects timeline" tabIndex={0}>
        <div className="min-w-[70rem]">
          <div className="grid grid-cols-4 gap-5">
          {projects.map((project, index) => (
            <Reveal key={project.title} className="h-full" delay={index * 0.06}>
              <article className={`project-timeline-card group relative flex h-full min-h-[19rem] flex-col rounded-[1.15rem] border p-6 ${project.title === 'InsightForge' ? 'project-timeline-card-featured border-gold/40' : 'border-violet/25'}`}>
                {project.title === 'InsightForge' && <span className="project-featured-sparkle" aria-hidden="true">✦</span>}
                <div className="project-card-meta">
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/45">{project.year}</p>
                  <p className={`mt-2 text-[0.62rem] uppercase tracking-[0.18em] ${project.title === 'InsightForge' ? 'text-gold/80' : 'text-violet/80'}`}>{project.category}</p>
                </div>
                <h3 className="project-card-title mt-7 whitespace-nowrap text-[1.375rem] font-semibold tracking-[-0.01em] text-white">{project.title}</h3>
                <p className="project-card-description mt-4 whitespace-pre-line text-sm leading-6 text-white/60">{project.description}</p>
                {['insightforge', 'persona-multiplier-ai', 'timesync-ai', 'wildfire-detection'].includes(project.slug) ? (
                  <a
                    href={`/projects/${project.slug}`}
                    data-project={project.slug}
                    className="project-card-action mt-auto inline-flex w-fit items-center gap-2 pt-7 text-xs text-white/72 transition-colors group-hover:text-gold"
                    aria-label={`Explore the ${project.title} project case study`}
                  >
                    Explore project <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    aria-label={`Explore ${project.title} — project details coming in a future phase`}
                    title="Project details will be added in a future phase"
                    data-project={project.slug}
                    className="project-card-action mt-auto inline-flex w-fit items-center gap-2 pt-7 text-xs text-white/72 transition-colors group-hover:text-violet disabled:cursor-not-allowed disabled:opacity-90"
                  >
                    Explore project <span aria-hidden="true">↗</span>
                  </button>
                )}
              </article>
            </Reveal>
          ))}
          </div>

          <div className="project-timeline relative mt-10" aria-label="Project timeline, newest to oldest">
            <div className="project-timeline-line" aria-hidden="true" />
            <div className="project-timeline-runner" aria-hidden="true"><span /></div>
            <ol className="relative grid grid-cols-4 gap-5">
              {projects.map((project) => (
                <li key={project.slug} className="text-center">
                  <span className={`project-milestone-dot ${project.title === 'InsightForge' ? 'is-featured' : ''}`} aria-hidden="true" />
                  <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/45">{project.milestone}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

function Career() {
  const experience = [
    {
      dates: '2025–2026',
      title: 'Independent AI & Software Developer',
      organisation: 'Personal Technical Projects · United Kingdom',
      description: 'Designed and developed AI-powered applications, including InsightForge, TimeSync AI and Persona Multiplier AI. Built practical solutions using Python, React, TypeScript, FastAPI and LLM APIs, focusing on AI integration, evidence-grounded workflows, testing and reliable software development.',
      featured: true,
    },
    {
      dates: 'May–Aug 2024',
      title: 'Clerical Marker',
      organisation: 'Cambridge University Press & Assessment · United Kingdom',
      description: 'Reviewed and validated assessment information while maintaining accuracy, consistency and adherence to quality standards. Worked within strict deadlines, demonstrating attention to detail, time management and effective collaboration.',
      featured: false,
    },
    {
      dates: 'Jan–Aug 2023',
      title: 'Freelance AI & Data Science Developer',
      organisation: 'Independent Freelance Work · India',
      description: 'Developed Python-based machine learning and data analysis projects, including data preprocessing, exploratory data analysis, model development and performance evaluation. Applied analytical and problem-solving skills to practical technical tasks.',
      featured: false,
    },
  ]

  return (
    <section id="career" className="section-space">
      <div className="page-shell">
        <Reveal className="experience-panel rounded-2xl border border-white/[0.07] bg-surface/75 p-7 sm:p-10 lg:p-12">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.025em] text-white">Experience</h2>
          <div className="experience-timeline relative mt-9" role="list">
            {experience.map((entry, index) => (
              <Reveal key={`${entry.dates}-${entry.title}`} className={`experience-entry relative pl-9 ${index < experience.length - 1 ? 'pb-10' : ''}`} delay={index * 0.08}>
                <article role="listitem">
                  <span className={`experience-dot ${entry.featured ? 'is-featured' : ''}`} aria-hidden="true" />
                  <p className="experience-date text-sm font-medium tracking-[0.04em] text-violet">{entry.dates}</p>
                  <h3 className="experience-title mt-3 text-xl font-semibold leading-snug text-white">{entry.title}</h3>
                  <p className="experience-organisation mt-2 text-base font-medium text-white/72">{entry.organisation}</p>
                  <p className="experience-description mt-3 max-w-4xl text-[0.9375rem] font-normal leading-7 text-white/58">{entry.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Education() {
  const education = [
    {
      year: '2025',
      degree: 'MSc Artificial Intelligence',
      university: 'Anglia Ruskin University',
      country: 'United Kingdom',
      featured: true,
    },
    {
      year: '2023',
      degree: 'Bachelor of Computer Applications',
      university: 'Bishop Heber College',
      country: 'India',
      featured: false,
    },
  ]

  return (
    <section id="education" className="section-space border-y border-white/[0.07] bg-surface/35">
      <div className="page-shell">
        <Reveal>
          <SectionHeading eyebrow="Academic Background" title="Education" description="The foundation of my technical journey." />
        </Reveal>
        <div className="education-timeline relative mt-14 max-w-4xl" role="list">
          {education.map((entry, index) => (
            <Reveal key={`${entry.year}-${entry.degree}`} className={`education-entry relative pl-9 ${index < education.length - 1 ? 'pb-12' : ''}`} delay={index * 0.1}>
              <article role="listitem">
                <span className={`education-dot ${entry.featured ? 'is-featured' : ''}`} aria-hidden="true" />
                <p className="education-year text-sm text-violet">{entry.year}</p>
                <h3 className="education-degree mt-3 text-[1.375rem] leading-snug text-white">{entry.degree}</h3>
                <p className="education-university mt-2 text-base text-white/72">{entry.university}</p>
                <p className="education-country mt-1 text-[0.9375rem] text-white/50">{entry.country}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills" className="section-space border-y border-white/[0.07] bg-surface/55">
      <div className="page-shell">
        <Reveal><SectionHeading eyebrow="Technical Expertise" title="Skills & Technologies" description="The tools and technologies behind my work." /></Reveal>
        <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
          {skillGroups.map((group, index) => (
            <Reveal key={group.label} className="skills-category border-t border-white/[0.09] pt-6" delay={index * 0.06}>
              <h3 className={`skills-category-title text-lg ${index === 0 ? 'text-gold' : 'text-white'}`}>{group.label}</h3>
              <ul className="mt-5 flex flex-wrap gap-2.5" aria-label={`${group.label} skills`}>
                {group.skills.map((skill) => (
                  <li key={skill} className="skill-tag">{skill}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section-space relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/[0.09] blur-[130px]" />
      <Reveal className="page-shell text-center">
        <p className="mx-auto mb-5 w-fit text-xs font-semibold uppercase tracking-[0.28em] text-gold">Let&apos;s Connect</p>
        <h2 className="contact-heading mx-auto text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:whitespace-nowrap lg:text-[2.5rem] xl:text-5xl">
          Let&apos;s build something <span className="text-gold">intelligent</span> together
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
          I&apos;m open to opportunities in AI engineering, machine learning and software development. Whether you have an opportunity, an idea or simply want to connect, I&apos;d love to hear from you.
        </p>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-sans">
          <a
            href="mailto:mandhagini23@gmail.com"
            className="contact-link inline-flex items-center gap-2.5 text-sm text-white/70"
            aria-label="Email Mandhagini Madhavan at mandhagini23@gmail.com"
          >
            <Mail size={17} className="shrink-0" aria-hidden="true" /> mandhagini23@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/mandhagini-madhavan-40ba01230/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link inline-flex items-center gap-2.5 text-sm text-white/70"
            aria-label="Visit Mandhagini Madhavan's LinkedIn profile in a new tab"
          >
            <Linkedin size={17} className="shrink-0" aria-hidden="true" /> linkedin.com/in/mandhagini-madhavan-40ba01230
          </a>
          <a
            href="https://github.com/MandhaginiMadhavan"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link inline-flex items-center gap-2.5 text-sm text-white/70"
            aria-label="Visit Mandhagini Madhavan's GitHub profile in a new tab"
          >
            <Github size={17} className="shrink-0" aria-hidden="true" /> github.com/MandhaginiMadhavan
          </a>
        </div>
      </Reveal>
    </section>
  )
}

function PortfolioHome() {
  const { showIntro, completeIntro } = useCinematicIntro()
  const [introReady, setIntroReady] = useState(false)
  const handleIntroReady = useCallback(() => setIntroReady(true), [])

  return (
    <div className={`portfolio-site relative min-h-screen overflow-x-hidden ${showIntro ? 'intro-active' : ''} ${showIntro && introReady ? 'intro-revealing' : ''}`}>
      {showIntro && <CinematicIntro onComplete={completeIntro} onReady={handleIntroReady} />}
      <BrainBackdrop />
      <a href="#main" className="sr-only z-[100] bg-white px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Navbar />
      <main id="main" className="relative z-10"><Hero /><About /><Projects /><Career /><Education /><Skills /><Contact /></main>
      <PortfolioAssistant />
      <footer className="relative z-10 border-t border-white/[0.07] bg-ink/45 py-10 backdrop-blur-sm">
        <div className="page-shell text-center font-sans text-sm text-white/35">
          <p>© 2026 Mandhagini Madhavan. Built with curiosity and code.</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/projects/insightforge') return <InsightForgePage />
  if (path === '/projects/persona-multiplier-ai') return <PersonaMultiplierPage />
  if (path === '/projects/timesync-ai') return <TimeSyncPage />
  if (path === '/projects/wildfire-detection') return <WildfireDetectionPage />
  return <PortfolioHome />
}

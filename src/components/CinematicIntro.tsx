import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Group, Material, Mesh, Object3D, WebGLRenderer } from 'three'
import { shouldShowCinematicIntro } from '../introPolicy'
import { clearPendingPortfolioReturn, hasPendingPortfolioReturn } from '../projectNavigation'

const INTRO_DURATION = 5000

type CinematicIntroProps = {
  onComplete: () => void
  onReady: () => void
}

function BrainModel({ onReady, onError }: { onReady: () => void; onError: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: WebGLRenderer | undefined
    let model: Group | undefined
    let frame = 0
    let disposed = false
    let startTime = 0
    let resizeObserver: ResizeObserver | undefined

    const initialise = async () => {
      try {
        const THREE = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        if (disposed) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
        camera.position.set(0, 0.05, 5.2)

        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.05

        scene.add(new THREE.HemisphereLight(0x8f83bd, 0x090611, 1.45))
        const keyLight = new THREE.DirectionalLight(0xffc6a1, 4.1)
        keyLight.position.set(3.5, 3, 4)
        scene.add(keyLight)
        const rimLight = new THREE.DirectionalLight(0x7a5cff, 4.8)
        rimLight.position.set(-4, 1, -2)
        scene.add(rimLight)

        const neuralImageReady = new Promise<void>((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve()
          image.onerror = () => reject(new Error('Unable to preload neural brain image'))
          image.src = '/assets/neon-neural-brain.png'
        })
        const [gltf] = await Promise.all([
          new GLTFLoader().loadAsync('/assets/human-brain.glb'),
          neuralImageReady,
        ])
        if (disposed) return

        const brain = gltf.scene
        const brainMaterial = new THREE.MeshPhysicalMaterial({
          color: 0x9d626f,
          roughness: 0.58,
          metalness: 0.02,
          clearcoat: 0.28,
          clearcoatRoughness: 0.62,
        })
        brain.traverse((child: Object3D) => {
          const mesh = child as Mesh
          if (mesh.isMesh) mesh.material = brainMaterial
        })

        const bounds = new THREE.Box3().setFromObject(brain)
        const size = bounds.getSize(new THREE.Vector3())
        const centre = bounds.getCenter(new THREE.Vector3())
        const modelScale = 3.2 / Math.max(size.x, size.y, size.z)
        // Rotate a centred parent rather than the imported scene itself. This
        // keeps the real-world GLB coordinates centred throughout the full turn.
        brain.position.copy(centre).multiplyScalar(-1)
        model = new THREE.Group()
        model.add(brain)
        model.scale.setScalar(modelScale)
        model.rotation.set(-0.08, -Math.PI / 2, -0.04)
        scene.add(model)

        const resize = () => {
          if (!renderer) return
          const { width, height } = canvas.getBoundingClientRect()
          renderer.setSize(width, height, false)
          camera.aspect = width / Math.max(height, 1)
          camera.updateProjectionMatrix()
        }
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(canvas)
        resize()

        startTime = performance.now()
        onReady()
        const render = (now: number) => {
          if (disposed || !renderer || !model) return
          const progress = Math.min((now - startTime) / INTRO_DURATION, 1)
          const eased = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2
          model.rotation.y = -Math.PI / 2 + Math.PI * eased
          model.rotation.x = -0.08 + Math.sin(progress * Math.PI) * 0.045
          renderer.render(scene, camera)
          frame = requestAnimationFrame(render)
        }
        frame = requestAnimationFrame(render)
      } catch {
        onError()
      }
    }

    void initialise()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      model?.traverse((child: Object3D) => {
        const mesh = child as Mesh
        if (!mesh.isMesh) return
        mesh.geometry?.dispose()
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        materials.forEach((material: Material) => material.dispose())
      })
      renderer?.dispose()
    }
  }, [onError, onReady])

  return <canvas ref={canvasRef} className="intro-brain-canvas" aria-hidden="true" />
}

const neuralPaths = [
  'M110 260 C220 155 345 175 470 250 S715 345 900 225',
  'M95 330 C245 250 330 360 480 300 S720 180 915 315',
  'M160 180 C300 275 390 145 530 215 S725 295 850 150',
  'M165 405 C290 320 410 430 545 350 S735 380 850 420',
  'M280 105 C350 205 500 135 620 205 S755 145 825 95',
]

export function CinematicIntro({ onComplete, onReady }: CinematicIntroProps) {
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => {
    setReady(true)
    onReady()
  }, [onReady])
  const handleError = useCallback(() => onComplete(), [onComplete])
  const particles = useMemo(() => Array.from({ length: 72 }, (_, index) => ({
    id: index,
    x: 18 + ((index * 37) % 64),
    y: 18 + ((index * 53) % 58),
    dx: ((index * 71) % 420) - 210,
    dy: ((index * 47) % 300) - 150,
    delay: (index % 12) * 0.035,
    gold: index % 7 === 0,
  })), [])

  useEffect(() => {
    if (!ready) return
    const timer = window.setTimeout(onComplete, INTRO_DURATION + 80)
    return () => window.clearTimeout(timer)
  }, [onComplete, ready])

  return (
    <div className={`cinematic-intro ${ready ? 'intro-ready' : ''}`} role="dialog" aria-label="Portfolio opening animation" aria-modal="true">
      <div className="intro-vignette" />
      <BrainModel onReady={handleReady} onError={handleError} />

      <div className="intro-neural-scene" aria-hidden="true">
        <img src="/assets/neon-neural-brain.png" alt="" className="intro-neural-image" />
        <svg className="intro-neural-flow" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet">
          {neuralPaths.map((path, index) => (
            <g key={path}>
              <path d={path} className="intro-neural-path" />
              <circle r="3" fill={index % 2 ? '#d8b66e' : '#a58aff'} className="intro-neural-signal">
                <animateMotion path={path} dur={`${2.2 + index * 0.16}s`} begin={`${index * -0.38}s`} repeatCount="indefinite" calcMode="paced" />
              </circle>
            </g>
          ))}
        </svg>
      </div>

      <div className="intro-neural-split" aria-hidden="true">
        <div className="intro-neural-half is-left">
          <img src="/assets/neon-neural-brain.png" alt="" />
        </div>
        <div className="intro-neural-half is-right">
          <img src="/assets/neon-neural-brain.png" alt="" />
        </div>
      </div>

      <div className="intro-dissolve" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={particle.gold ? 'intro-dissolve-particle is-gold' : 'intro-dissolve-particle'}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              '--particle-x': `${particle.dx}px`,
              '--particle-y': `${particle.dy}px`,
              '--particle-delay': `${particle.delay}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="intro-captions" aria-hidden="true">
        <p className="intro-caption intro-caption-human">Curiosity begins the journey.</p>
        <p className="intro-caption intro-caption-neural">Intelligence transforms possibility.</p>
      </div>

      {!ready && <p className="intro-loading">Initialising neural sequence…</p>}
      <button type="button" className="intro-skip" onClick={onComplete}>Skip Intro</button>
      <a className="intro-credit" href="https://3d.nih.gov/entries/20960?version=1" target="_blank" rel="noreferrer">3D brain: NIH 3D / HRA · CC BY 4.0</a>
    </div>
  )
}

export function useCinematicIntro() {
  const [isPortfolioReturn] = useState(() => {
    if (typeof window === 'undefined') return false
    return hasPendingPortfolioReturn()
  })
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    if (isPortfolioReturn) return false
    return shouldShowCinematicIntro(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  })

  useLayoutEffect(() => {
    if (!isPortfolioReturn) return
    clearPendingPortfolioReturn()
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [isPortfolioReturn])

  useEffect(() => {
    if (!showIntro) return
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previousOverflow }
  }, [showIntro])

  const completeIntro = useCallback(() => {
    setShowIntro(false)
  }, [])

  return { showIntro, completeIntro }
}

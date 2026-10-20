type NodeId = keyof typeof nodes

const nodes = {
  inlet: [159, 218],
  leftCortex: [369, 329],
  centre: [678, 335],
  bridge: [852, 421],
  lowerCore: [1055, 553],
  rightCore: [1150, 517],
  rightJunction: [1420, 540],
  outlet: [1520, 478],
  upperCortex: [727, 176],
  crown: [943, 141],
  upperRight: [1034, 410],
  lowerLobe: [930, 524],
  stem: [968, 759],
  lowRight: [1372, 684],
} as const

type Edge = {
  from: NodeId
  to: NodeId
  curve: string
}

const edges = {
  inletLeft: { from: 'inlet', to: 'leftCortex', curve: 'C226 248 301 298 369 329' },
  leftCentre: { from: 'leftCortex', to: 'centre', curve: 'C470 371 578 315 678 335' },
  centreBridge: { from: 'centre', to: 'bridge', curve: 'C738 351 792 403 852 421' },
  bridgeLower: { from: 'bridge', to: 'lowerCore', curve: 'C928 454 992 529 1055 553' },
  lowerRight: { from: 'lowerCore', to: 'rightCore', curve: 'C1086 546 1118 526 1150 517' },
  coreJunction: { from: 'rightCore', to: 'rightJunction', curve: 'C1241 495 1330 520 1420 540' },
  junctionOutlet: { from: 'rightJunction', to: 'outlet', curve: 'C1460 536 1494 501 1520 478' },
  centreUpper: { from: 'centre', to: 'upperCortex', curve: 'C692 276 706 215 727 176' },
  upperCrown: { from: 'upperCortex', to: 'crown', curve: 'C792 139 867 126 943 141' },
  crownUpperRight: { from: 'crown', to: 'upperRight', curve: 'C983 211 1014 314 1034 410' },
  upperRightLower: { from: 'upperRight', to: 'lowerCore', curve: 'C1043 454 1050 505 1055 553' },
  bridgeLobe: { from: 'bridge', to: 'lowerLobe', curve: 'C876 456 902 497 930 524' },
  lobeStem: { from: 'lowerLobe', to: 'stem', curve: 'C950 607 962 689 968 759' },
  bridgeRight: { from: 'bridge', to: 'rightCore', curve: 'C948 442 1051 489 1150 517' },
  coreLowRight: { from: 'rightCore', to: 'lowRight', curve: 'C1238 571 1309 636 1372 684' },
} satisfies Record<string, Edge>

type EdgeId = keyof typeof edges

const journeys: Array<{ edges: EdgeId[]; color: string; delay: string; duration: string; radius: number }> = [
  { edges: ['inletLeft', 'leftCentre', 'centreBridge', 'bridgeLower', 'lowerRight', 'coreJunction', 'junctionOutlet'], color: '#9b87f5', delay: '-2s', duration: '12s', radius: 2.25 },
  { edges: ['inletLeft', 'leftCentre', 'centreUpper', 'upperCrown', 'crownUpperRight', 'upperRightLower', 'lowerRight'], color: '#5980ff', delay: '-7s', duration: '12s', radius: 2 },
  { edges: ['leftCentre', 'centreBridge', 'bridgeLobe', 'lobeStem'], color: '#d6b66f', delay: '-4.5s', duration: '8.5s', radius: 2.5 },
  // These two particles share a route and separate at bridge, producing a visible branch.
  { edges: ['inletLeft', 'leftCentre', 'centreBridge', 'bridgeLower', 'lowerRight', 'coreJunction'], color: '#8a6fff', delay: '-9s', duration: '11s', radius: 2 },
  { edges: ['inletLeft', 'leftCentre', 'centreBridge', 'bridgeRight', 'coreLowRight'], color: '#efb96f', delay: '-9s', duration: '11s', radius: 2 },
  { edges: ['centreUpper', 'upperCrown', 'crownUpperRight', 'upperRightLower', 'lowerRight', 'coreLowRight'], color: '#6e79ff', delay: '-1s', duration: '10s', radius: 2.25 },
]

function buildJourney(edgeIds: EdgeId[]) {
  const first = edges[edgeIds[0]]
  const [startX, startY] = nodes[first.from]
  return `M${startX} ${startY} ${edgeIds.map((edgeId) => edges[edgeId].curve).join(' ')}`
}

export function BrainBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        src="/assets/neon-neural-brain.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.52]"
        fetchPriority="high"
      />
      <svg className="signal-overlay absolute inset-0 h-full w-full opacity-80" viewBox="0 0 1673 941" preserveAspectRatio="xMidYMid slice" fill="none">
        {journeys.map((journey, index) => (
          <circle key={`${journey.color}-${index}`} className="signal-particle" r={journey.radius} fill={journey.color}>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.04;0.94;1" dur={journey.duration} begin={journey.delay} repeatCount="indefinite" />
            <animateMotion path={buildJourney(journey.edges)} dur={journey.duration} begin={journey.delay} repeatCount="indefinite" calcMode="paced" />
          </circle>
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/35" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
    </div>
  )
}

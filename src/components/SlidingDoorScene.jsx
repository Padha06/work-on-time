import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/**
 * Sliding aluminum door model.
 * Pattern notes (from Harkirattttt/ThreeJS-Furniture-Store skim):
 * - "room" setup: soft key + fill lights, ground plane receiving shadow,
 *   camera slightly above eye-level looking at product centre.
 * - Keep polycount light: boxes only, no imported GLTF — safe for mid-range phones.
 */
const PANEL_W = 1.34;
const PANEL_H = 2.6;
const RAIL = 0.09; // slim aluminum profile width
const CLOSED_X = 0.69; // rest position: panels meet at centre with a hairline gap
const TRAVEL = 1.18; // how far each panel slides outward when fully open

/**
 * One sliding aluminum panel, geometry centred on its local origin.
 * The parent group (ref left/right) owns the world position — never both.
 */
function Panel({ side, frameColor, glassOpacity, glassColor }) {
  const hw = PANEL_W / 2;
  const hh = PANEL_H / 2;
  const alu = { color: frameColor, metalness: 0.85, roughness: 0.3 };
  return (
    <group>
      {/* side stiles */}
      {[-hw + RAIL / 2, hw - RAIL / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[RAIL, PANEL_H, 0.07]} />
          <meshStandardMaterial {...alu} />
        </mesh>
      ))}
      {/* top / bottom rails */}
      {[hh - RAIL / 2, -hh + RAIL / 2].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[PANEL_W, RAIL, 0.07]} />
          <meshStandardMaterial {...alu} />
        </mesh>
      ))}
      {/* wide lock rail */}
      <mesh position={[0, -0.35, 0.005]} castShadow>
        <boxGeometry args={[PANEL_W, 0.15, 0.075]} />
        <meshStandardMaterial {...alu} />
      </mesh>
      {/* glass — fills almost the whole panel, like a real aluminum slider */}
      <mesh position={[0, 0.06, -0.01]}>
        <boxGeometry args={[PANEL_W - RAIL, PANEL_H - RAIL - 0.1, 0.02]} />
        <meshPhysicalMaterial
          color={glassColor}
          transparent
          opacity={glassOpacity}
          roughness={0.06}
          metalness={0.1}
        />
      </mesh>
      {/* top rollers riding in the track */}
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[x, hh + 0.07, 0]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.055, 0.055, 0.06, 20]} />
          <meshStandardMaterial color="#8f959b" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      {/* pull handle on the meeting stile */}
      <mesh position={[-side * (hw - 0.17), -0.1, 0.09]}>
        <boxGeometry args={[0.055, 0.6, 0.055]} />
        <meshStandardMaterial color="#eef0f2" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function DoorRig({ progress, frameColor = "#C9CDD2", glassOpacity = 0.3, glassColor = "#cfe3e8", travel = TRAVEL, rigScale = 1 }) {
  const left = useRef();
  const right = useRef();
  const target = useRef(0);

  useFrame((state, dt) => {
    // progress: 0 = closed (panels meet at centre), 1 = open (panels slid apart).
    target.current += ((progress?.current ?? 0) - target.current) * Math.min(1, dt * 3.5);
    const t = Math.min(1, Math.max(0, target.current));
    if (left.current) left.current.position.x = -CLOSED_X - t * travel;
    if (right.current) right.current.position.x = CLOSED_X + t * travel;
  });

  return (
    <group position={[0, 0.15, 0]} scale={rigScale}>
      {/* head track + sill */}
      <mesh position={[0, 1.58, 0]}>
        <boxGeometry args={[4.4, 0.12, 0.24]} />
        <meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, -1.24, 0]}>
        <boxGeometry args={[4.4, 0.08, 0.24]} />
        <meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* fixed outer jambs */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, 0.15, -0.02]}>
          <boxGeometry args={[0.1, 2.95, 0.14]} />
          <meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <group ref={left}>
        <Panel side={-1} frameColor={frameColor} glassOpacity={glassOpacity} glassColor={glassColor} />
      </group>
      <group ref={right}>
        <Panel side={1} frameColor={frameColor} glassOpacity={glassOpacity} glassColor={glassColor} />
      </group>
    </group>
  );
}

function Room({ children, softShadows = true }) {
  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.35, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#2e2e33" roughness={0.9} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 1.2, -1.6]} receiveShadow>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#3a3a40" roughness={0.95} />
      </mesh>
      {/* warm glow strip */}
      <mesh position={[0, 2.2, -1.55]}>
        <planeGeometry args={[6, 0.06]} />
        <meshBasicMaterial color="#c9622c" />
      </mesh>
      {children}
      {/* ContactShadows re-renders the scene — desktop only. */}
      {softShadows && (
        <ContactShadows position={[0, -1.33, 0]} opacity={0.55} scale={10} blur={2.4} far={3} color="#000" />
      )}
    </group>
  );
}

export default function SlidingDoorScene({
  progressRef,
  frameColor,
  glassOpacity,
  glassColor,
  compact = false,
  dpr,
}) {
  return (
    <Canvas
      shadows={!compact}
      dpr={dpr ?? (compact ? [1, 1] : [1, 1.75])}
      camera={{ position: compact ? [0, 0.6, 7.4] : [0, 0.6, 5.2], fov: compact ? 48 : 38 }}
      gl={{ antialias: !compact, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={compact ? 1.1 : 0.75} />
      <directionalLight position={[3.5, 5, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2.5, 3]} intensity={0.45} color="#cdd7ff" />
      <spotLight position={[0, 4, 2.5]} angle={0.6} penumbra={0.8} intensity={0.7} color="#ffd9b8" />
      <Room softShadows={!compact}>
        <DoorRig
          progress={progressRef}
          frameColor={frameColor}
          glassOpacity={glassOpacity}
          glassColor={glassColor}
          travel={compact ? 0.95 : TRAVEL}
          rigScale={compact ? 0.8 : 1}
        />
      </Room>
      {compact ? (
        // Mobile: procedural studio env rendered once locally — no remote
        // HDR download over mobile data, metals still read correctly.
        <Environment resolution={64} frames={1}>
          <Lightformer intensity={2} position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} color="#ffffff" />
          <Lightformer intensity={1} position={[-4, 1, 2]} scale={[6, 2, 1]} color="#dfe8ff" />
          <Lightformer intensity={1.2} position={[4, 1, 2]} scale={[6, 2, 1]} color="#ffe3c4" />
        </Environment>
      ) : (
        <Environment preset="city" />
      )}
    </Canvas>
  );
}

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";

const PANEL_W = 1.4;
const PANEL_H = 2.5;
const RAIL = 0.09;
const CLOSED_X = 0.71;
const TRAVEL = 1.02;

/** One configurator panel, centred on its local origin. */
function ConfigPanel({ side, frameColor, glassColor, glassOpacity, glassRoughness }) {
  const hw = PANEL_W / 2;
  const hh = PANEL_H / 2;
  const alu = { color: frameColor, metalness: 0.7, roughness: 0.35 };
  return (
    <group>
      {[-hw + RAIL / 2, hw - RAIL / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[RAIL, PANEL_H, 0.07]} />
          <meshStandardMaterial {...alu} />
        </mesh>
      ))}
      {[hh - RAIL / 2, -hh + RAIL / 2].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[PANEL_W, RAIL, 0.07]} />
          <meshStandardMaterial {...alu} />
        </mesh>
      ))}
      <mesh position={[0, -0.35, 0.005]} castShadow>
        <boxGeometry args={[PANEL_W, 0.15, 0.075]} />
        <meshStandardMaterial {...alu} />
      </mesh>
      <mesh position={[0, 0.02, -0.01]}>
        <boxGeometry args={[PANEL_W - RAIL, PANEL_H - RAIL - 0.08, 0.02]} />
        <meshPhysicalMaterial
          color={glassColor}
          transparent
          opacity={glassOpacity}
          roughness={glassRoughness}
          metalness={0}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {[-0.45, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.02, 0.012]} rotation-z={0.5}>
          <planeGeometry args={[i === 0 ? 0.24 : 0.09, 2.4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} />
        </mesh>
      ))}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, hh + 0.07, 0]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
          <meshStandardMaterial color="#8f959b" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[-side * (hw - 0.17), -0.1, 0.09]}>
        <boxGeometry args={[0.055, 0.55, 0.055]} />
        <meshStandardMaterial color="#f5f5f4" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function MiniDoor({ frameColor, glassColor, glassOpacity, glassRoughness, openAmount }) {
  const left = useRef();
  const right = useRef();
  const eased = useRef(openAmount);

  useFrame((state, dt) => {
    eased.current += (openAmount - eased.current) * Math.min(1, dt * 6);
    const t = Math.min(1, Math.max(0, eased.current));
    if (left.current) left.current.position.x = -CLOSED_X - t * TRAVEL;
    if (right.current) right.current.position.x = CLOSED_X + t * TRAVEL;
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.3, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#ece9e2" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.1, -1.4]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#f4f2ed" roughness={1} />
      </mesh>
      {/* head track + sill + jambs */}
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[4.2, 0.12, 0.24]} />
        <meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, -1.24, 0]}>
        <boxGeometry args={[4.2, 0.08, 0.24]} />
        <meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} />
      </mesh>
      {[-2.05, 2.05].map((x) => (
        <mesh key={x} position={[x, 0.1, -0.02]}>
          <boxGeometry args={[0.1, 2.85, 0.14]} />
          <meshStandardMaterial color="#3a3d42" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <group ref={left}>
        <ConfigPanel side={-1} frameColor={frameColor} glassColor={glassColor} glassOpacity={glassOpacity} glassRoughness={glassRoughness} />
      </group>
      <group ref={right}>
        <ConfigPanel side={1} frameColor={frameColor} glassColor={glassColor} glassOpacity={glassOpacity} glassRoughness={glassRoughness} />
      </group>
      <ContactShadows position={[0, -1.28, 0]} opacity={0.3} scale={8} blur={2} far={2.5} />
    </group>
  );
}

const FALLBACK_FRAME = { hex: "#1b1b1e" };
const FALLBACK_GLASS = { color: "#cfe3e8", opacity: 0.22, roughness: 0.05 };

export default function DoorStage({ frame = FALLBACK_FRAME, glass = FALLBACK_GLASS, openAmount = 0 }) {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.5, 5], fov: 36 }} gl={{ antialias: true }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} castShadow />
      <MiniDoor
        frameColor={frame.hex}
        glassColor={glass.color}
        glassOpacity={glass.opacity}
        glassRoughness={glass.roughness}
        openAmount={openAmount}
      />
      <Environment preset="city" />
    </Canvas>
  );
}

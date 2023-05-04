import Scene from '@/components/scene';
import { Canvas } from '@react-three/fiber';
import { ARButton, Controllers, XR } from '@react-three/xr';

export default function Home() {
  return (
    <>
      <ARButton />
      <p>Text</p>
      <Canvas
        camera={{
          fov: 70,
          near: 0.01,
          far: 200,
          // position: [0, 0, 0],
        }}
      >
        <XR referenceSpace="local">
          <Scene />
          <Controllers />
        </XR>
        <ambientLight />
      </Canvas>
    </>
  );
}

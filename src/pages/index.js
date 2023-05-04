import Scene from '@/components/scene';
import { Canvas } from '@react-three/fiber';
import { ARButton, Controllers, XR } from '@react-three/xr';

export default function Home() {
  return (
    <>
      <ARButton />
      <Canvas>
        <XR referenceSpace="local">
          <Scene />
          <Controllers />
        </XR>
      </Canvas>
    </>
  );
}

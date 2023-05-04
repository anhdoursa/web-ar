import Scene from '@/components/scene';
import { Canvas } from '@react-three/fiber';
import { ARButton, Controllers, XR } from '@react-three/xr';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('text');
  return (
    <>
      <ARButton />
      <p style={{ color: '#fff', fontSize: '2em', position: 'absolute', top: '10%', left: '45%' }}>{text}</p>
      <Canvas
        camera={{
          fov: 70,
          near: 0.01,
          far: 200,
          // position: [0, 0, 0],
        }}
      >
        <XR referenceSpace="local">
          <Scene setText={setText} />
          <Controllers />
        </XR>
        <ambientLight />
      </Canvas>
    </>
  );
}

import { Interactive, useHitTest } from '@react-three/xr';
import React, { useRef } from 'react';

const Scene = () => {
  const mesh = useRef();
  const reticle = useRef();
  useHitTest((hitMatrix, hit) => {
    if (hit) {
      reticle.current.visible = true;
    } else {
      reticle.current.visible = false;
    }
    // use hitMatrix to position any object on the real life surface
    hitMatrix.decompose(reticle.current.position, reticle.current.quaternion, reticle.current.scale);

    // console.log(hit);
  });

  return (
    <Interactive>
      <mesh ref={mesh}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
      <mesh ref={reticle} visible={false}>
        <ringGeometry args={[0.15, 0.2, 32]} rotateX={-Math.PI / 2} />
        <meshBasicMaterial />
      </mesh>
    </Interactive>
  );
};

export default Scene;

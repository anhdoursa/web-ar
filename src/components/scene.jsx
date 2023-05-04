import { useFrame } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';
import React, { useRef } from 'react';

const Scene = () => {
  let hitTestSource = null;
  let hitTestSourceRequested = false;
  const mesh = useRef();
  const reticle = useRef();

  useFrame((state, delta, xrFrame) => {
    if (xrFrame) {
      const referenceSpace = state.gl.xr.getReferenceSpace();
      const session = state.gl.xr.getSession();

      if (hitTestSourceRequested === false) {
        session.requestReferenceSpace('viewer').then(function (referenceSpace) {
          session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
            hitTestSource = source;
          });
        });

        session.addEventListener('end', function () {
          hitTestSourceRequested = false;
          hitTestSource = null;
        });

        hitTestSourceRequested = true;
      }

      if (hitTestSource) {
        const hitTestResults = xrFrame.getHitTestResults(hitTestSource);
        if (hitTestResults.length) {
          const hit = hitTestResults[0];
          reticle.current.visible = true;
          reticle.current.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
          console.log(reticle.current);
        } else {
          reticle.current.visible = false;
          console.log('false');
        }
      }
    }
  });
  // useHitTest((hitMatrix, hit) => {
  //   if (hit) {
  //     reticle.current.visible = true;
  //   } else {
  //     reticle.current.visible = false;
  //   }
  //   // use hitMatrix to position any object on the real life surface
  //   hitMatrix.decompose(reticle.current.position, reticle.current.quaternion, reticle.current.scale);

  //   // console.log(hit);
  // });

  return (
    <Interactive>
      <mesh ref={mesh}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
      <mesh ref={reticle} visible={false} matrixAutoUpdate={false}>
        <ringGeometry args={[0.15, 0.2, 32]} rotateX={-Math.PI / 2} />
        <meshBasicMaterial />
      </mesh>
    </Interactive>
  );
};

export default Scene;

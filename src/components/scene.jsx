import { useFrame, useThree } from '@react-three/fiber';
import { Interactive, useHitTest } from '@react-three/xr';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
const Scene = () => {
  const [hitTest, setHitTest] = useState(false);
  let hitTestSource = null;
  let hitTestSourceRequested = false;
  const mesh = useRef();
  const { scene } = useThree();
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

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
          reticle.visible = true;
          reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
          setHitTest(true);
        } else {
          reticle.visible = false;
        }
      }
    }
  });

  useEffect(() => {
    if (hitTest) {
      console.log('here is hitTest');
      mesh.current.position.setFromMatrixPosition(reticle.matrix);
      mesh.current.visible = true;
    }
  }, [hitTest]);

  return (
    <Interactive>
      <mesh ref={mesh} visible={false}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 32]} />
        <meshBasicMaterial />
      </mesh>
    </Interactive>
  );
};

export default Scene;

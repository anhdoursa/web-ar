import { Html, Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Interactive, useHitTest } from '@react-three/xr';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

let hitTestSource = null;
let hitTestSourceRequested = false;
let reticle;

const Scene = ({ setText }) => {
  const [hitTest, setHitTest] = useState(false);
  const [hover, setHover] = useState(false);
  const object3D = useRef();
  const { scene } = useThree();

  useMemo(() => {
    reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
  }, []);

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
      object3D.current.position.setFromMatrixPosition(reticle.matrix);
      object3D.current.visible = true;
    }
  }, [hitTest]);

  return (
    <Interactive
      onHover={() => setHover(true)}
      // onBlur={() => setText('onHover')}
      // onSelectStart={() => setText('onSelectStart')}
      onSelectEnd={() => setHover(false)}
      // onSqueeze={() => setText('onSqueeze')}
    >
      <mesh ref={object3D} visible={false}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color={hover ? 'yellow' : 'red'} />
      </mesh>
    </Interactive>
  );
};

export default Scene;

import { Interactive } from "@react-three/xr";
import React from "react";

const Scene = () => {
  return (
    <Interactive>
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </Interactive>
  );
};

export default Scene;

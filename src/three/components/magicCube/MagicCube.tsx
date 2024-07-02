import { FC, useMemo, useRef } from "react";
import {
  AlwaysStencilFunc,
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  EqualStencilFunc,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  ReplaceStencilOp,
  TorusGeometry,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexShader from "../shader/vertex.glsl";
import fragmentShader from "../shader/fragment.glsl";
import { useFrame } from "@react-three/fiber";

interface IProps {
  borderColor?: string;
}

export const MagicCube: FC<IProps> = ({ borderColor = "black" }) => {
  const refList = useRef<Mesh[]>([]);

  const cubeFace = useMemo(
    () => [
      {
        position: [0, 0, 0.5],
        rotation: [0, 0, 0],
        stencilRef: 1,
        geometry: new CylinderGeometry(0.15, 0.15, 0.5),
      },
      {
        position: [0, 0.5, 0],
        rotation: [-Math.PI / 2, 0, 0],
        stencilRef: 2,
        geometry: new OctahedronGeometry(0.25),
      },
      {
        position: [0, -0.5, 0],
        rotation: [Math.PI / 2, 0, 0],
        stencilRef: 3,
        geometry: new TorusGeometry(0.25, 0.1),
      },
      {
        position: [0, 0, -0.5],
        rotation: [Math.PI, 0, 0],
        stencilRef: 4,
        geometry: new ConeGeometry(0.25, 0.5),
      },
      {
        position: [-0.5, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        stencilRef: 5,
        geometry: new ConeGeometry(0.25, 0.5, 4),
      },
      {
        position: [0.5, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        stencilRef: 6,
        geometry: new BoxGeometry(0.5, 0.5, 0.5),
      },
    ],
    []
  );

  useFrame((state, delta) => {
    delta %= 1;
    refList.current.forEach((el) => {
      if (el === null) return;
      el.rotation.x += Math.random() * delta * 0.5;
      el.rotation.y += Math.random() * delta * 0.5;
    });
  });

  return (
    <>
      {cubeFace.map((item, index) => {
        return (
          <group key={index}>
            <mesh
              name="stencilPlane"
              key={index}
              position={item.position as [number, number, number]}
              rotation={item.rotation as [number, number, number]}
              scale={0.9}
            >
              <planeGeometry></planeGeometry>
              <meshBasicMaterial
                depthWrite={false}
                stencilWrite
                stencilRef={item.stencilRef}
                stencilFunc={AlwaysStencilFunc}
                stencilZPass={ReplaceStencilOp}
                colorWrite={false}
              ></meshBasicMaterial>
            </mesh>
            <mesh
              name="showModel"
              geometry={item.geometry}
              ref={(el) => (refList.current[index] = el as Mesh)}
            >
              <meshStandardMaterial
                color={new Color().fromArray([
                  Math.random(),
                  Math.random(),
                  Math.random(),
                ])}
                stencilWrite
                stencilRef={item.stencilRef}
                stencilFunc={EqualStencilFunc}
              ></meshStandardMaterial>
            </mesh>
          </group>
        );
      })}
      <mesh>
        <boxGeometry></boxGeometry>
        <meshPhysicalMaterial
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          color="black"
          stencilWrite
          stencilFunc={EqualStencilFunc}
        ></meshPhysicalMaterial>
      </mesh>
    </>
  );
};

import { Environment, OrbitControls, Sky } from "@react-three/drei";
import { useInteractStore, useLoadedStore } from "@utils/Store";
import { useEffect, useRef } from "react";
import { MagicCube } from "../magicCube/MagicCube";



const Sketch = () => {
  const controlDom = useInteractStore((state) => state.controlDom);

  useEffect(() => {
    useLoadedStore.setState({ ready: true });
  }, []);

  return (
    <>
      <OrbitControls domElement={controlDom} />
      <color attach={"background"} args={["ivory"]} />
      <Sky
        sunPosition={[0, 0, -1]}
        distance={50000}
        turbidity={8}
        rayleigh={6}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <directionalLight position={[10, 10, 0]} intensity={2} />
      <ambientLight intensity={1} />
      <MagicCube />
    </>
  );
};

export default Sketch;

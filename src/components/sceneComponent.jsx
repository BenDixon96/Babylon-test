import { useEffect, useRef, useState } from "react";
import { Engine, Scene, Color3 } from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest }) => {
  const reactCanvas = useRef(null);

  const [position, setPostion] = useState(null)
  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    scene.collisionsEnabled = true;
    scene.fogEnabled = true
    scene.fogDensity = 0.0005
    scene.fogStart = 0
   
    scene.fogColor = {r: 0.6, g: 0.2, b: 0.1 }
    scene.fogMode = Scene.FOGMODE_EXP2;
    scene.clearColor = new Color3(0.6, 0.2, 0.1)
    
    
    console.log(scene)
    if (scene.isReady()) {
      onSceneReady(scene);
      
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return  <div>
   
    <canvas ref={reactCanvas} {...rest} />
    
  </div>
  
};

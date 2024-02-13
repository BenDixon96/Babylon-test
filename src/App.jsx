import React, { useEffect, useState } from "react";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, FlyCamera } from "@babylonjs/core";
import SceneComponent from './components/sceneComponent';
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui/2D";
import "./App.css";

class BabylonScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      box: null,
      camera: null,
      cameraPosition: null,
      fog: 0.0003
      
    };
  }

  onSceneReady = (scene) => {
    const camera = new FlyCamera("camera1", new Vector3(0, 2010, -10), scene);
    camera.checkCollisions = true;
    camera.maxZ = 3000;
    camera.speed = 10

    
    
    camera.setTarget(Vector3.Zero());
    console.log(camera)

    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
    box.position.y = 1010;
    box.position.x = 10;
    box.checkCollisions = true;

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Create a button
    const button = Button.CreateSimpleButton("clickButton", "more speed");
    button.width = "150px";
    button.height = "40px";
    button.color = "white";
    button.background = "red";
    button.horizontalAlignment = Button.HORIZONTAL_ALIGNMENT_LEFT;
    button.verticalAlignment = Button.VERTICAL_ALIGNMENT_TOP;
    button.onPointerUpObservable.add(() => this.click());
    advancedTexture.addControl(button);



    const sightButton = Button.CreateSimpleButton("clickButton", "more sight");
    sightButton.width = "150px";
    sightButton.height = "40px";
    sightButton.color = "white";
    sightButton.background = "red";
    sightButton.horizontalAlignment = Button.HORIZONTAL_ALIGNMENT_RIGHT;
   
    sightButton.onPointerUpObservable.add(() => this.clickAddSight());
    advancedTexture.addControl(sightButton);

    



    const ground = MeshBuilder.CreateGroundFromHeightMap("ground", './heightmap.jpeg', {
      width: 20000,
      height: 20000,
      subdivisions: 350,
      maxHeight: 2000,
      minHeight: 0,
      wireframe: true
    }, scene);
    ground.checkCollisions = true;
    console.log(ground)
    
    
    this.setState({
      box: box,
      camera: camera,
      cameraPosition: camera.position.clone(),
      
    });
  };
  
  
  onRender = (scene) => {
    if (this.state.box && this.state.camera) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();
      // Perform any updates using this.state.box or this.state.camera

      // Update camera position in state
      this.setState({
        cameraPosition: this.state.camera.position.clone(),
      });
    }
  };



  
  handleChange = (event) => {
    if (this.state.cameraPosition) {
      const roundedCameraPosition = {
        x: this.state.cameraPosition.x.toFixed(2),
        y: this.state.cameraPosition.y.toFixed(2),
        z: this.state.cameraPosition.z.toFixed(2),
      };
      console.log(roundedCameraPosition);
    }
  };
  
  click = (event) => {
    this.state.camera.speed += 10
   
  }
  clickAddSight = (event) => {
    this.state.camera.maxZ += 1000
    this.state.fog -= 1
   
  }
 
 


  render() {
    return (
      <div id="scene">
        <p1>hello</p1>
        <div>Camera Position: {this.state.cameraPosition && this.state.cameraPosition.toString()}</div>
        <div>Camera speed: {this.state.camera && this.state.camera.speed.toString()}</div>
        <div>Camera sight: {this.state.camera && this.state.camera.maxZ.toString()}</div>
        <div>fog: {this.state.fog && this.state.fog.toString()}</div>
       
        <SceneComponent antialias onSceneReady={this.onSceneReady} onRender={this.onRender} fog={this.state.fog} id="my-canvas" />
      </div>
    );
  }
}

export default BabylonScene;



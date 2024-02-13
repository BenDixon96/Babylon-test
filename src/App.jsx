import React, { useEffect, useState } from "react";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder, FlyCamera, Texture, StandardMaterial } from "@babylonjs/core";
import SceneComponent from './components/sceneComponent';
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui/2D";

import "./App.css";

class BabylonScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: null,
      cameraPosition: null,
      fog: 0.0004
      
    };
  }

  onSceneReady = (scene) => {
    var camera = new FlyCamera("camera1", new Vector3(0, 2010, -10), scene);
    camera.checkCollisions = true;
    camera.maxZ = 3000;
    camera.minZ = 0
    camera.speed = 10

    
    
    camera.setTarget(Vector3.Zero());
    console.log(camera)

    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    
   
    
    sphere.parent = camera
    // sphere.postion.Z = 10
    sphere.position.z = 5;
    sphere.position.y = - 2
    sphere.scaling.y = 0.1
    sphere.scaling._x = 4.1
    sphere.scaling._z = 1
    const sphereMaterial = new StandardMaterial()
    sphereMaterial.diffuseTexture = new Texture('./carpet.jpeg')
    sphere.material = sphereMaterial

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    console.log("sphere", sphere, "parent", sphere.parent)

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
    sightButton.verticalAlignment = Button.VERTICAL_ALIGNMENT_TOP;
   
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
      camera: camera,
      cameraPosition: camera.position.clone(),
      
    });
  };
  
  
  onRender = (scene) => {
    if (this.state.camera) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();
      // Perform any updates using this.state.sphere or this.state.camera
    //   const distanceInFront = 5;

    // // Calculate the new position based on the camera's direction
    //   const newspherePosition = this.state.camera.getFrontPosition(distanceInFront);


    //   this.state.sphere.position.copyFrom(this.state.camera.position);
    //   this.state.sphere.rotation.copyFrom(this.state.camera.rotation);

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
        
        <div>Camera Position: {this.state.cameraPosition && this.state.cameraPosition.toString()}</div>
        <div>Camera speed: {this.state.camera && this.state.camera.speed.toString()}</div>
        <div>Camera sight: {this.state.camera && this.state.camera.maxZ.toString()}</div>
        <div>fog: {this.state.fog && this.state.fog.toString()}</div>
        <div>sphere: {this.state.sphere && this.state.sphere.position.toString()}</div>
       
        <SceneComponent antialias onSceneReady={this.onSceneReady} onRender={this.onRender} fog={this.state.fog} id="my-canvas" />
      </div>
    );
  }
}

export default BabylonScene;



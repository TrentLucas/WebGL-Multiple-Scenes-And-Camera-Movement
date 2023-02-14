/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!


// Engine stuff
import engine from "../engine/index.js";

// User stuff
import BlueLevel from "./blue_level.js";
import SceneFileParser from "./util/scene_file_parser.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats
        this.mBackgroundAudio = "assets/sounds/Persona.mp3";

        // scene file name
        this.mSceneFile = "assets/scene.json";
        // all squares
        this.mSQSet = [];        // these are the Renderable objects

        // The cameras to view the scene
        this.largeCamera = null;
        this.smallCamera = null;
    }

    load() {
        engine.json.load(this.mSceneFile);
        engine.audio.load(this.mBackgroundAudio);
    }

    init() {

        let sceneParser = new SceneFileParser(engine.json.get(this.mSceneFile));

        // Step A: Read in the large camera
        this.largeCamera = sceneParser.parseCameraJSON();
        this.largeCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        // Step B: Read in the small camera
        this.smallCamera = engine.storage.getCam();

        // Step C: Read all the squares
        sceneParser.parseSquaresJSON(this.mSQSet);

        // now start the Background music ...
        engine.audio.playBackground(this.mBackgroundAudio, 5);
    }

    unload() {
        // stop the background audio
        engine.audio.stopBackground();

        // unload the scene file and loaded resources
        engine.json.unload(this.mSceneFile);
        engine.audio.unload(this.mBackgroundAudio);

    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // draw all squares in largeCamera
        this.largeCamera.setViewAndCameraMatrix();
        let i;
        for (i = 0; i < this.mSQSet.length; i++) {
            this.mSQSet[i].draw(this.largeCamera);
        }

        // draw all squares in smallCamera
        this.smallCamera.setViewAndCameraMatrix();
        let j;
        for (j = 0; j < this.mSQSet.length; j++) {
            this.mSQSet[j].draw(this.smallCamera);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        // Continuous scene movements
        let redXform = this.mSQSet[1].getXform();
        let whiteXform = this.mSQSet[0].getXform();
        redXform.incRotationByDegree(1.4);
        whiteXform.incXPosBy(-0.15);

        if (whiteXform.getXPos() < 10) { // this is the left-bound of the window
            whiteXform.setPosition(30, 60);
        }

        ////////////////////////////////////////////////////////
        // *Key Inputs*
        ////////////////////////////////////////////////////////

        // Q Key: Quit Game
        if (engine.input.isKeyPressed(engine.input.keys.Q))
            this.stop();

        // N Key: Next Scene
        if (engine.input.isKeyPressed(engine.input.keys.N))
            this.next();

        // F Key: Move WC Window Up
        if (engine.input.isKeyPressed(engine.input.keys.F)) {
            this.largeCamera.mWCCenter[1] -= 0.1;
            this.smallCamera.mWCCenter[1] -= 0.1;
        }

        // V Key: Move WC Window Down
        if (engine.input.isKeyPressed(engine.input.keys.V)) {
            this.largeCamera.mWCCenter[1] += 0.1;
            this.smallCamera.mWCCenter[1] += 0.1;
        }

        // C Key: Move WC Window Left
        if (engine.input.isKeyPressed(engine.input.keys.C)) {
            this.largeCamera.mWCCenter[0] += 0.1;
            this.smallCamera.mWCCenter[0] += 0.1;
        }

        // B Key: Move WC Window Right
        if (engine.input.isKeyPressed(engine.input.keys.B)) {
            this.largeCamera.mWCCenter[0] -= 0.1;
            this.smallCamera.mWCCenter[0] -= 0.1;
        }

        // Z Key: Zoom WC Window In
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            this.largeCamera.mWCWidth -= 0.1;
            this.smallCamera.mWCWidth -= 0.1;
        }

        // X Key: Zoom WC Window Out
        if (engine.input.isKeyPressed(engine.input.keys.X)) {
            this.largeCamera.mWCWidth += 0.1;
            this.smallCamera.mWCWidth += 0.1;
        }

        // W Key: Move Viewport Up
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            this.smallCamera.mViewport[1] = this.smallCamera.mViewport[1] + 1.5;
        }

        // A Key: Move Viewport Left
        if (engine.input.isKeyReleased(engine.input.keys.A)) {
            this.smallCamera.mViewport[0] = this.smallCamera.mViewport[0] - 1.5;
        }

        // S Key: Move Viewport Down
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            this.smallCamera.mViewport[1] = this.smallCamera.mViewport[1] - 1.5;
        }

        // D Key: Move Viewport Right
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            this.smallCamera.mViewport[0] = this.smallCamera.mViewport[0] + 1.5;
        }
        
    }

    next() {
        super.next();
        let nextLevel = new BlueLevel();  // load the next level
        engine.storage.loadToMap(this.smallCamera);  // store camera in map
        nextLevel.start();
    }
}

export default MyGame;

window.onload = function () {
    engine.init("GLCanvas");

    // initially create and store camera in map
    this.newCam = new engine.Camera(
        vec2.fromValues(20, 60),   // position of the camera
        20,                        // width of camera
        [0, 350, 100, 100]         // viewport (orgX, orgY, width, height)
    );
    this.newCam.setBackgroundColor([0, 0.8, 0.8, 1]);
    engine.storage.loadToMap(this.newCam); // load the first position of smallCamera to the map

    let myGame = new MyGame();
    myGame.start();
}
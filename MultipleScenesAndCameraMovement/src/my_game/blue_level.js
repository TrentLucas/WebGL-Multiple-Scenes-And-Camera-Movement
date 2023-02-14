/*
 * File: Blue_Level.js 
 * This is the logic of our game. 
 */


// Engine stuff
import engine from "../engine/index.js";

// Local stuff
import MyGame from "./my_game.js";
import SceneFileParser from "./util/scene_file_parser.js";

class BlueLevel extends engine.Scene {
    constructor() {
        super();

        // audio clips: supports both mp3 and wav formats
        this.mBackgroundAudio = "assets/sounds/Persona.mp3";

        // scene file name
        this.mSceneFile = "assets/blue_level.xml";
        // all squares
        this.mSQSet = [];        // these are the Renderable objects

        // The cameras to view the scene
        this.largeCamera = null;
        this.smallCamera = null;
    }


    load() {
        engine.xml.load(this.mSceneFile);
        engine.audio.load(this.mBackgroundAudio);
    }

    init() {
        engine.audio.setBackgroundVolume(0.05);

        let sceneParser = new SceneFileParser(engine.xml.get(this.mSceneFile));

        // Step A: Read in the large camera
        this.largeCamera = sceneParser.parseCameraXML();

        // Step B: Read in the small camera
        this.smallCamera = engine.storage.getCam();

        // Step C: Read all the squares
        sceneParser.parseSquaresXML(this.mSQSet);

        // now start the Background music ...
        engine.audio.playBackground(this.mBackgroundAudio, 5);

    }

    unload() {
        // stop the background audio
        engine.audio.stopBackground();

        // unload the scene flie and loaded resources
        engine.xml.unload(this.mSceneFile);
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
        let nextLevel = new MyGame();  // load the next level
        engine.storage.loadToMap(this.smallCamera);  // store camera in map
        nextLevel.start();
    }
}

export default BlueLevel;
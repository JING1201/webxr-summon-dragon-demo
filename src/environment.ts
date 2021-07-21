import * as BABYLON from "babylonjs";
import * as GUI from 'babylonjs-gui';
import * as helper from "./helper";
import { MagicDragon } from "./magic_dragon";

export class Env {
    scene: BABYLON.Scene;
    camera: BABYLON.ArcRotateCamera;
    light: BABYLON.HemisphericLight;

    skybox?: BABYLON.AbstractMesh;
    ground?: BABYLON.AbstractMesh;

    instruction?: GUI.HolographicButton;

    magicDragon?: MagicDragon;

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
        this.camera = new BABYLON.ArcRotateCamera(
            "camera",
            3 * Math.PI / 2,
            Math.PI / 3,
            8,
            new BABYLON.Vector3(0, 0, 0),
            scene
        );

        this.light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );
        this.light.intensity = 3.5;
    }

    async importMeshes() {
        // Source: https://sketchfab.com/3d-models/dragon-flying-cycle-ae0831702eac462a9969ff4f8bd57710 
        const dragonMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "assets/", "green-dragon.glb", this.scene);
        const dragon = dragonMeshes.meshes[0];
        helper.scaleFromPivot(dragon, new BABYLON.Vector3(0, 0, 0), 0.2, 0.2, 0.2);
        dragon.position.y += 4;

        const magicCircleMeshes = await BABYLON.SceneLoader.ImportMeshAsync("", "https://models.babylonjs.com/TrailMeshSpell/", "spellDisk.glb", this.scene);
        const magicCircle = magicCircleMeshes.meshes[0];
        helper.scaleFromPivot(magicCircle, new BABYLON.Vector3(0, 0, 0), 2, 2, 2);
        magicCircle.position.y += 1;
        magicCircle.position.z -= 1;

        const magicRoot = new BABYLON.TransformNode("magicRoot");
        dragon.parent = magicRoot;
        magicCircle.parent = magicRoot;
        helper.scaleFromPivot(magicRoot, new BABYLON.Vector3(0, 0, 0), 0.3, 0.3, 0.3);

        this.magicDragon = new MagicDragon(dragon, magicCircle, magicRoot);
    }

    createBackground(meshToRender: BABYLON.AbstractMesh) {
        const skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, this.scene, undefined, BABYLON.Mesh.BACKSIDE);
        const skyboxMaterial = new BABYLON.BackgroundMaterial("skyboxMaterial", this.scene);
        var files = [
            "assets/space_left.jpg",
            "assets/space_up.jpg",
            "assets/space_front.jpg",
            "assets/space_right.jpg",
            "assets/space_down.jpg",
            "assets/space_back.jpg",
        ];
        skyboxMaterial.reflectionTexture = BABYLON.CubeTexture.CreateFromImages(files, this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.material = skyboxMaterial;
    
        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 400, height: 400 });
        const groundMaterial = new BABYLON.BackgroundMaterial("groundMaterial", this.scene);
    
        const mirror = new BABYLON.MirrorTexture("mirror", 512, this.scene);
        mirror.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
        mirror.renderList = [meshToRender, ...(meshToRender.getChildMeshes()), skybox];
    
        groundMaterial.reflectionTexture = mirror;
        ground.material = groundMaterial;
    
        this.skybox = skybox;
        this.ground = ground;
    }
}





export async function setup(scene: BABYLON.Scene, canvas: HTMLCanvasElement) : Promise<Env> {
    const env = new Env(scene);

    await env.importMeshes();
    env.createBackground(env.magicDragon!.dragonMesh as BABYLON.AbstractMesh);
    env.instruction = create3DInstructionButton(scene);
    //const instruction = createInstructionText(); //not visible in XR session when I tested on my Mixed Reality Simulator
    env.camera.attachControl(canvas, true);
    return env;
}



export function createInstructionText() {
    const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const panel = new GUI.StackPanel();
    panel.width = "800px";
    panel.top = "100px";
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    adt.addControl(panel);

    const header = new GUI.TextBlock();
    header.text = "Say \"Go Dragon!\"";
    header.fontSize = 60;
    header.fontFamily = "Century Gothic";
    header.height = "200px";
    header.color = "white";
    panel.addControl(header);

    return header;
}

export function create3DInstructionButton(scene: BABYLON.Scene) {
    // Create the 3D UI manager
    const manager = new GUI.GUI3DManager(scene);

    // Create a horizontal stack panel
    const panel = new GUI.StackPanel3D();
    panel.margin = 0.02;
    manager.addControl(panel);
    panel.position.z = -1.5;
    panel.position.y = 2.2;
    panel.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);

    const button = new GUI.HolographicButton("orientation");
    panel.addControl(button);
    button.text = "Say \"Go Dragon!\"";
    button.imageUrl = "./assets/microphone.svg";

    return button;
}
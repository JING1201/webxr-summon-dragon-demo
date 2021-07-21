import * as helper from "./helper";
import * as BABYLON from "babylonjs";


// MagicDragon is a class encapsulating the main visual asset used in this demo.
export class MagicDragon {
    magicMeshes: BABYLON.TransformNode;
    dragonMesh: BABYLON.AbstractMesh;
    circleMesh: BABYLON.AbstractMesh;
    dragonFade: BABYLON.FadeInOutBehavior;
    circleFade: BABYLON.FadeInOutBehavior;
    visible: boolean;

    constructor(dragon: BABYLON.AbstractMesh, circle: BABYLON.AbstractMesh, magicMeshes: BABYLON.TransformNode) {
        this.dragonMesh = dragon;
        this.circleMesh = circle;
        this.magicMeshes = magicMeshes;
        this.dragonFade = new BABYLON.FadeInOutBehavior();
        this.dragonFade.fadeInTime = 500;
        this.visible = false;
        helper.addFadeBehavior(this.dragonMesh, this.dragonFade);

        this.circleFade = new BABYLON.FadeInOutBehavior();
        this.circleFade.fadeInTime = 300;
        helper.addFadeBehavior(this.circleMesh, this.circleFade);
    }

    // add a setter called position to set the root position
    set position(value: BABYLON.Vector3) {
        this.magicMeshes.position = value;
    }

    hide() {
        this.dragonFade.fadeIn(false);
        setTimeout(() => {
            this.circleFade.fadeIn(false);
        }, 500);
        this.visible = false;
    }

    show() {
        this.circleFade!.fadeIn(true);
        setTimeout(() => {
            this.dragonFade!.fadeIn(true);
        }, 500);
        this.visible = true;
    }

    isVisible() : Boolean {
        return this.visible;
    }

    get baseMaterial() : BABYLON.PBRMaterial {
        return this.dragonMesh.getChildMeshes()[0].material as BABYLON.PBRMaterial;
    }

    set material(value: BABYLON.PBRMaterial) {
        this.dragonMesh.getChildMeshes()[0].material = value;
    }

}
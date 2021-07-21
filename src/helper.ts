import * as BABYLON from "babylonjs";

export function scaleFromPivot(mesh: BABYLON.TransformNode, pivotPoint: BABYLON.Vector3, sx: number, sy: number, sz: number) {
    const _sx = sx / mesh.scaling.x;
    const _sy = sy / mesh.scaling.y;
    const _sz = sz / mesh.scaling.z;
    mesh.scaling = new BABYLON.Vector3(sx, sy, sz);
    mesh.position = new BABYLON.Vector3(pivotPoint.x + _sx * (mesh.position.x - pivotPoint.x), pivotPoint.y + _sy * (mesh.position.y - pivotPoint.y), pivotPoint.z + _sz * (mesh.position.z - pivotPoint.z));
}

export function addFadeBehavior(mesh: any, fade: BABYLON.FadeInOutBehavior) {
    if (mesh.getClassName() === "Mesh") {
        mesh.addBehavior(fade);
    }
    const children = mesh.getChildren();
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        addFadeBehavior(child, fade);
    }
}

// export function showHideAnimation(show: boolean, env: Env) {
//     env.magicCircle!.fadeIn(true);
//     setTimeout(() => {
//         env.dragon!.fadeIn(true);
//     }, 500);
// }
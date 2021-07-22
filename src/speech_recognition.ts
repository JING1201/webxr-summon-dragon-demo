import { Env } from "./environment";
import * as BABYLON from "babylonjs";


interface IWindow extends Window {
    webkitSpeechRecognition: any;
    opr: boolean;
    chrome: boolean;
}

const { webkitSpeechRecognition, opr, chrome }: IWindow = <IWindow><unknown>window;


export const browserName = (function (agent) {
    switch (true) {
        case agent.indexOf("edge") > -1: return "Old Edge";
        case agent.indexOf("edg") > -1: return "Edge";
        case agent.indexOf("opr") > -1 && !!opr: return "opera";
        case agent.indexOf("chrome") > -1 && !!chrome: return "chrome";
        case agent.indexOf("trident") > -1: return "Internet Explorer";
        case agent.indexOf("firefox") > -1: return "firefox";
        case agent.indexOf("safari") > -1: return "safari";
        default: return "other";
    }
})(window.navigator.userAgent.toLowerCase());

if (browserName === "firefox") {
    window.alert("This demo isn't supported on firefox, please use Edge, Chrome or Safari");
}


export const speechRecognition = new webkitSpeechRecognition();
speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = 'en-US';
speechRecognition.maxAlternatives = 1;

const spell = "go dragon";


export class spellListener {
    env: Env;
    phrase = { interim: '', final: '' };
    startDragonMaterial: BABYLON.PBRMaterial;
    redDragonMaterial: BABYLON.PBRMaterial;
    blueDragonMaterial: BABYLON.PBRMaterial;

    constructor(env: Env) {
        this.env = env;
        this.startDragonMaterial = this.env.magicDragon!.baseMaterial.clone("defaultDragonMaterial");
        this.redDragonMaterial = this.startDragonMaterial.clone("redDragon");
        this.redDragonMaterial.albedoColor = BABYLON.Color3.FromHexString('#CD2323');
        this.redDragonMaterial.metallic = 0.24;
        this.redDragonMaterial.roughness = 0.949;
        this.redDragonMaterial.indexOfRefraction = 1.0;
        this.redDragonMaterial.metallicReflectanceColor = BABYLON.Color3.FromHexString('#FF0000');
        this.redDragonMaterial.metallicF0Factor = 1.0;
        this.redDragonMaterial.clearCoat.isEnabled = true;
        this.redDragonMaterial.clearCoat.intensity = 0.27;
        this.redDragonMaterial.clearCoat.indexOfRefraction = 1.5;
        this.redDragonMaterial.clearCoat.roughness = 0;
        this.redDragonMaterial.clearCoat.remapF0OnInterfaceChange = true;
        this.redDragonMaterial.clearCoat.useRoughnessFromMainTexture = true;

        this.blueDragonMaterial = this.startDragonMaterial.clone("blueDragon");
        this.blueDragonMaterial.albedoColor = BABYLON.Color3.FromHexString("#1c29c0");
    }

    // we need to pass an xr instance so we can position the dragon
    async start(xr: BABYLON.WebXRDefaultExperience) {
        var ignore_onend = false;
        var start_timestamp = Date.now();

        speechRecognition.onresult = (speech: { results: { [x: string]: any; }; resultIndex: string | number; }) => {
            if (speech.results) {
                const results = speech.results[speech.resultIndex];
                const transcript: string = results[0].transcript;
                console.log("Transcript:", transcript);

                if (results[0].confidence > 0.2 || browserName == "Edge") {
                    if (results.isFinal) {
                        this.phrase = { interim: '', final: transcript };

                        const heardSpell = this.phrase.final.toLowerCase().replace(/[^a-zA-Z0-9]+/g, " ").trim();

                        console.log("phrase detected:" + heardSpell);
                        if (heardSpell === spell || heardSpell === "good dragon") {
                            console.log("dragon spell");
                            if (xr.baseExperience.camera) {
                                const position = xr.baseExperience.camera.getFrontPosition(3);
                                position.y = 0;
                                this.env.magicDragon!.position = position;
                            }
                            
                            if (this.env.instruction) {
                                this.env.instruction!.isVisible = false;
                            }
                            this.env.magicDragon!.show();
                        }

                        // stop everything / clear the scene
                        if (heardSpell === "stop") {
                            console.log("---stop---");
                            this.env.magicDragon!.hide();
                        }

                        // red dragon
                        if (heardSpell === "go red") {
                            console.log("red dragon");
                            if (this.env.magicDragon!.isVisible()) {
                                this.env.magicDragon!.hide();
                                setTimeout(() => {
                                    this.env.magicDragon!.material = this.redDragonMaterial;
                                    this.env.magicDragon!.show();
                                }, 850);
                            }
                        }

                        // blue dragon
                        if (heardSpell === "go blue") {
                            console.log("blue dragon");
                            if (this.env.magicDragon!.isVisible()) {
                                this.env.magicDragon!.hide();
                                setTimeout(() => {
                                    this.env.magicDragon!.material = this.blueDragonMaterial;
                                    this.env.magicDragon!.show();
                                }, 850);
                            }
                        }

                        // green dragon
                        if (heardSpell === "go green") {
                            console.log("green dragon");
                            if (this.env.magicDragon!.isVisible()) {
                                this.env.magicDragon!.hide();
                                setTimeout(() => {
                                    this.env.magicDragon!.material = this.startDragonMaterial;
                                    this.env.magicDragon!.show();
                                }, 850);
                            }
                        }
                    }

                } else {
                    this.phrase = { interim: transcript, final: '' };
                    console.log("low confidence (" + results[0].confidence + ')');
                }
            }
        };

        speechRecognition.onerror = (event: any) => {
            console.log(event);
            if (event.error == 'no-speech') {
                console.log('info_no_speech');
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                console.log('info_no_microphone');
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    console.log('info_blocked');
                } else {
                    console.log('info_denied');
                }
                ignore_onend = true;
            }
        };

        speechRecognition.onend = () => {
            console.log('--completing recognition--');
            if (ignore_onend) {
                console.log("ignore onend and return");
                return;
            }
            // needed for mobile
            console.log("why stop so soon, let's continue doing speech recognition");
            setTimeout(() => {
                speechRecognition.start();
            }, 850);
            return;
        };
        speechRecognition.start();
    }

}

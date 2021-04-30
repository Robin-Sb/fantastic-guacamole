/// <reference path="Definition.ts" />

namespace Malefiz {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  window.addEventListener("load", init);
  export let viewport: ƒ.Viewport = new ƒ.Viewport();
  export let graph: Graph = new Graph();
  export let typeToColorMap: Map<TYPE, COLOR> = new Map([[TYPE.PLAYER_BLUE, COLOR.BLUE], [TYPE.PLAYER_RED, COLOR.RED], [TYPE.PLAYER_GREEN, COLOR.GREEN], [TYPE.PLAYER_YELLOW, COLOR.YELLOW]])
  let players: Player[] = [];

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    addButtonEventListeners();

    let branch: ƒ.Node = new ƒ.Node("Branch");
    let board: ƒ.Node = new ƒ.Node("Board");

    board.addComponent(new ƒ.ComponentTransform());

    let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();
    board.addComponent(new ƒ.ComponentMesh(mesh));

    let material: ƒ.Material = new ƒ.Material("BoardMat", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.8, 0.6, 0.05, 1)));
    let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
    board.addComponent(cmpMaterial);
    board.mtxLocal.scale(new ƒ.Vector3(10, 10, 0));

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    cmpCamera.mtxPivot.translateZ(17); //17
    cmpCamera.mtxPivot.rotateY(180);
    ƒAid.addStandardLightComponents(branch, new ƒ.Color(0.8, 0.8, 0.8));
    branch.addChild(board);
    branch.addChild(new ƒ.Node("PossibleMoves"));

    viewport.initialize("Viewport", branch, cmpCamera, canvas);
    SceneBuilder.buildScene();
    viewport.draw();
  }

  function addButtonEventListeners(): void {
    document.querySelector("#player-red").addEventListener("click", selectRedPlayer);
    document.querySelector("#player-green").addEventListener("click", selectGreenPlayer);
    document.querySelector("#player-yellow").addEventListener("click", selectYellowPlayer);
    document.querySelector("#player-blue").addEventListener("click", selectBluePlayer);

    document.querySelector("#ai-red").addEventListener("click", selectRedAI);
    document.querySelector("#ai-green").addEventListener("click", selectGreenAI);
    document.querySelector("#ai-yellow").addEventListener("click", selectYellowAI);
    document.querySelector("#ai-blue").addEventListener("click", selectBlueAI);

    document.querySelector("#deselect-red").addEventListener("click", deselectRed);
    document.querySelector("#deselect-green").addEventListener("click", deselectGreen);
    document.querySelector("#deselect-yellow").addEventListener("click", deselectYellow);
    document.querySelector("#deselect-blue").addEventListener("click", deselectBlue);


    document.querySelector("#start").addEventListener("click", startGame);
  }

  function startGame(): void {
    if (players.length < 2) 
      return;
    
    let buttons: HTMLCollectionOf<HTMLButtonElement> = <HTMLCollectionOf<HTMLButtonElement>> document.getElementsByClassName("button");
    for (let button of buttons) {
      button.style.display = "none";
    }
    let currentPlayerDisplay: DisplayedField = new DisplayedField("PlayerDisplay", new ƒ.Vector3(3.5, 1, 0.01), players[0].getColor(), "none");
    viewport.getBranch().addChild(currentPlayerDisplay);

    new PlayerController(players);
    viewport.draw();
  }

  function selectRedPlayer(_event: any): void {
    console.log(_event.target.id);
    handlePlayerSelection(TYPE.PLAYER_RED, true);
  }

  function selectGreenPlayer(_event: any): void {
    handlePlayerSelection(TYPE.PLAYER_GREEN, true);
  }

  function selectYellowPlayer(_event: any): void {
    handlePlayerSelection(TYPE.PLAYER_YELLOW, true);
  }

  function selectBluePlayer(_event: any): void {
    handlePlayerSelection(TYPE.PLAYER_BLUE, true);
  }

  function selectRedAI(_event: any): void {
    handlePlayerSelection(TYPE.PLAYER_RED, false);
  }

  function selectGreenAI(_event: any): void {
    handlePlayerSelection(TYPE.PLAYER_GREEN, false);
  }

  function selectYellowAI(_event: any): void {
    handlePlayerSelection(TYPE.PLAYER_YELLOW, false);
  }

  function selectBlueAI(_event: any): void {
    handlePlayerSelection(TYPE.PLAYER_BLUE, false);
  }

  function deselectRed(_event: any): void {
    handlePlayerDeselection(TYPE.PLAYER_RED);
  }

  function deselectGreen(_event: any): void {
    handlePlayerDeselection(TYPE.PLAYER_GREEN);
  }

  function deselectYellow(_event: any): void {
    handlePlayerDeselection(TYPE.PLAYER_YELLOW);
  }

  function deselectBlue(_event: any): void {
    handlePlayerDeselection(TYPE.PLAYER_BLUE);
  }

  function handlePlayerDeselection(_type: TYPE): void {
    let selectId: string;
    switch (_type) {
      case TYPE.PLAYER_RED:
        selectId = "red";
        break;
      case TYPE.PLAYER_GREEN:
        selectId = "green";
        break;
      case TYPE.PLAYER_YELLOW:
        selectId = "yellow";
        break;
      case TYPE.PLAYER_BLUE:
        selectId = "blue";
        break;
    }

    for (let i: number = 0; i < players.length; i++) {
      if (players[i].color === typeToColorMap.get(_type)) {
        players[i].removeTokens();
        players.splice(i, 1);
      }
    }
    document.getElementById("deselect-" + selectId).style.display = "none";
    document.getElementById("player-" + selectId).style.display = "inline-block";
    document.getElementById("ai-" + selectId).style.display = "inline-block";
    viewport.draw();
  }

  function handlePlayerSelection(_type: TYPE, isHuman: boolean): void {
    if (isHuman) {
      players.push(new HumanPlayer(_type, typeToColorMap.get(_type)));
    } else {
      players.push(new AIPlayer(_type, typeToColorMap.get(_type)));
    }

    let selectId: string;
    switch (_type) {
      case TYPE.PLAYER_RED:
        selectId = "red";
        break;
      case TYPE.PLAYER_GREEN:
        selectId = "green";
        break;
      case TYPE.PLAYER_YELLOW:
        selectId = "yellow";
        break;
      case TYPE.PLAYER_BLUE:
        selectId = "blue";
        break;
    }
    document.getElementById("deselect-" + selectId).style.display = "inline-block";
    document.getElementById("player-" + selectId).style.display = "none";
    document.getElementById("ai-" + selectId).style.display = "none";

    viewport.draw();
  }
}
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
    document.querySelector("#select-red").addEventListener("click", selectRed);
    document.querySelector("#select-green").addEventListener("click", selectGreen);
    document.querySelector("#select-yellow").addEventListener("click", selectYellow);
    document.querySelector("#select-blue").addEventListener("click", selectBlue);
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

  function selectRed(): void {
    handlePlayerSelection(TYPE.PLAYER_RED);
  }

  function selectGreen(): void {
    handlePlayerSelection(TYPE.PLAYER_GREEN);
  }

  function selectYellow(): void {
    handlePlayerSelection(TYPE.PLAYER_YELLOW);
  }

  function selectBlue(): void {
    handlePlayerSelection(TYPE.PLAYER_BLUE);
  }

  function handlePlayerSelection(_type: TYPE) {
    let isSelected: boolean = false;
    for (let i: number = 0; i < players.length; i++) {
      if (players[i].color === typeToColorMap.get(_type)) {
        isSelected = true; 
        players[i].removeTokens();
        players.splice(i, 1);
      }
    }
    if (!isSelected) {
      players.push(new Player(_type, typeToColorMap.get(_type)));
    }
    drawScene();
  }

  function drawScene(): void {
    viewport.draw();
  }
}
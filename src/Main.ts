namespace Malefiz {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  window.addEventListener("load", init);
  let branch: ƒ.Node = new ƒ.Node("Branch");
  export let viewport: ƒ.Viewport = new ƒ.Viewport();
  export let graph: Graph = new Graph();
  let players: Player[] = [];

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    addButtonEventListeners();

    let board: ƒ.Node = new ƒ.Node("Board");

    board.addComponent(new ƒ.ComponentTransform());

    let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();
    board.addComponent(new ƒ.ComponentMesh(mesh));

    let material: ƒ.Material = new ƒ.Material("BoardMat", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.8, 0.6, 0.05, 1)));
    let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
    board.addComponent(cmpMaterial);
    board.mtxLocal.scale(new ƒ.Vector3(10, 10, 0));

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    //cmpCamera.clrBackground = new ƒ.Color()
    cmpCamera.mtxPivot.translateZ(17); //17
    cmpCamera.mtxPivot.rotateY(180);
    // cmpCamera.mtxPivot.rotateX(90);
    ƒAid.addStandardLightComponents(branch, new ƒ.Color(0.8, 0.8, 0.8));
    branch.addChild(board);

    // let diceMesh: ƒ.MeshDiceCube = new ƒ.MeshDiceCube();
    // let texture: ƒ.CoatTextured = generateTextureFromId("#dice_text");
    // let dice: ƒ.Node = new ƒAid.Node("Dice", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(5, 0, 0)), new ƒ.Material("DiceMat", ƒ.ShaderTexture, texture), diceMesh);
    // dice.mtxLocal.rotateY(180);
    // dice = new Dice();
    // dice.mtxLocal.translateX(5);
    // dice.mtxLocal.rotateX(90);
    // branch.addChild(dice);

    //fillGraph();
    // let fieldRoot: ƒ.Node = new ƒ.Node("FieldRoot");
    // for (let [label, field] of graph.nodes) {
    //   fieldRoot.addChild(field);
    //   insertEdge(field);
    // }
    // branch.addChild(fieldRoot);
    // insertRemainingEdges();
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
    new PlayerController(players);
  }

  // function executeTurn(_event: ƒ.EventPointer) {
  //   let validTokenIsPicked: boolean = false;
  //   let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
    
  //   for (let pick of picks) {
  //     if (!(pick.node instanceof Token))
  //       continue;
  //     for (let token of players[currentTurn % players.length].tokens.getChildren()) {
  //       if (pick.node === token) {
  //         validTokenIsPicked = true;
  //         pickedToken = <Token> token;  
  //       }
  //     }
  //   }
  //   if (!validTokenIsPicked)
  //     pickedToken = null;

  //   // adjacentFields is global because we need it in the next event listener too
  //   adjacentFields = []; 
  //   if (pickedToken) {
  //     findNodesWithDistanceToNode(graph.nodes.get(pickedToken.field), Math.floor((Math.random() * 6) + 1));
  //   }
  //   drawPossibleMoves(adjacentFields);
  //   viewport.removeEventListener(ƒ.EVENT_POINTER.DOWN, executeTurn);
  //   viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, moveToken);
  //   viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
  // }

  // function findNodesWithDistanceToNode(_node: Field, _distance: number): void {
  //   _distance--;
  //   if (_distance >= 0) {
  //     for (let edge of _node.edgesOfNode) {
  //       for (let i: number = 0; i < edge.endNode.edgesOfNode.length; i++) {
  //         if (edge.endNode.edgesOfNode[i].endNode === _node) {
  //           edge.endNode.edgesOfNode.splice(i, 1);
  //         }  
  //       }
  //       findNodesWithDistanceToNode(edge.endNode, _distance);
  //     }
  //   } else {
  //     adjacentFields.push(_node);
  //   }
  // }

  // function moveToken(_event: ƒ.EventPointer): void {
  //   let tokenIsMovable: boolean = false;
  //   let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
  //   let selectedField: Field;
  //   for (let pick of picks) {
  //     if (!(pick.node instanceof Field)) 
  //       continue;
  
  //     for (let field of adjacentFields) {
  //       if (<Field> pick.node === field) {
  //         tokenIsMovable = true;
  //         selectedField = field;
  //       }
  //     }
  //   }

  //   if (tokenIsMovable) {
  //     currentTurn++;
  //     graph.nodes.get(pickedToken.field).token = null;
  //     pickedToken.field = selectedField.label;
  //     pickedToken.mtxLocal.translation = selectedField.position.toVector3();
  //     viewport.removeEventListener(ƒ.EVENT_POINTER.DOWN, moveToken);
  //   }
  //   viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, executeTurn);
  //   viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);

  //   viewport.draw();
  // }

  // function drawPossibleMoves(adjacentFields: Field[]): void {
  //   let ctx: CanvasRenderingContext2D = viewport.getCanvas().getContext("2d");
  //   for (let field of adjacentFields) {
  //     let position: ƒ.Vector2 = viewport.pointWorldToClient(field.position.toVector3());
  //     ctx.beginPath();
  //     let radius: number = ƒ.Vector2.DIFFERENCE(position, viewport.pointWorldToClient(ƒ.Vector2.SUM(field.position, new ƒ.Vector2(0.2, 0)).toVector3())).magnitude;
  //     ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
  //     ctx.fillStyle = 'yellow';
  //     ctx.fill();
  //   }
  // }

  function selectRed(): void {
    handlePlayerSelection(Color.RED);
  }

  function selectGreen(): void {
    handlePlayerSelection(Color.GREEN);
  }

  function selectYellow(): void {
    handlePlayerSelection(Color.YELLOW);
  }

  function selectBlue(): void {
    handlePlayerSelection(Color.BLUE);
  }

  function handlePlayerSelection(_type: Color) {
    let isSelected: boolean = false;
    for (let i: number = 0; i < players.length; i++) {
      if (players[i].color === _type) {
        isSelected = true; 
        players[i].removeTokens();
        players.splice(i, 1);
      }
    }
    if (!isSelected) {
      players.push(new Player(_type));
    }
    drawScene();
  }

  function drawScene(): void {
    viewport.draw();
  }

  // function fillGraph(): void {
  //   // first row
  //   graph.insertNode("-1|-5", normNodePosition(new ƒ.Vector2(-1, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-2|-5", normNodePosition(new ƒ.Vector2(-2, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-3|-5", normNodePosition(new ƒ.Vector2(-3, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-4|-5", normNodePosition(new ƒ.Vector2(-4, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-5|-5", normNodePosition(new ƒ.Vector2(-5, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-6|-5", normNodePosition(new ƒ.Vector2(-6, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-7|-5", normNodePosition(new ƒ.Vector2(-7, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-8|-5", normNodePosition(new ƒ.Vector2(-8, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|-5", normNodePosition(new ƒ.Vector2( 0, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "1|-5", normNodePosition(new ƒ.Vector2( 1, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|-5", normNodePosition(new ƒ.Vector2( 2, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "3|-5", normNodePosition(new ƒ.Vector2( 3, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|-5", normNodePosition(new ƒ.Vector2( 4, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "5|-5", normNodePosition(new ƒ.Vector2( 5, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "6|-5", normNodePosition(new ƒ.Vector2( 6, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "7|-5", normNodePosition(new ƒ.Vector2( 7, -5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "8|-5", normNodePosition(new ƒ.Vector2( 8, -5)), ƒ.Color.CSS("black"));

  //   // second row (middle row)
  //   graph.insertNode("-8|-4", normNodePosition(new ƒ.Vector2(-8, -4)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-4|-4", normNodePosition(new ƒ.Vector2(-4, -4)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|-4", normNodePosition(new ƒ.Vector2( 0, -4)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|-4", normNodePosition(new ƒ.Vector2( 4, -4)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "8|-4", normNodePosition(new ƒ.Vector2( 8, -4)), ƒ.Color.CSS("black"));

  //   // third row
  //   graph.insertNode("-8|-3", normNodePosition(new ƒ.Vector2(-8, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-7|-3", normNodePosition(new ƒ.Vector2(-7, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-6|-3", normNodePosition(new ƒ.Vector2(-6, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-5|-3", normNodePosition(new ƒ.Vector2(-5, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-4|-3", normNodePosition(new ƒ.Vector2(-4, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-3|-3", normNodePosition(new ƒ.Vector2(-3, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-2|-3", normNodePosition(new ƒ.Vector2(-2, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-1|-3", normNodePosition(new ƒ.Vector2(-1, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|-3", normNodePosition(new ƒ.Vector2( 0, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "1|-3", normNodePosition(new ƒ.Vector2( 1, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|-3", normNodePosition(new ƒ.Vector2( 2, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "3|-3", normNodePosition(new ƒ.Vector2( 3, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|-3", normNodePosition(new ƒ.Vector2( 4, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "5|-3", normNodePosition(new ƒ.Vector2( 5, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "6|-3", normNodePosition(new ƒ.Vector2( 6, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "7|-3", normNodePosition(new ƒ.Vector2( 7, -3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "8|-3", normNodePosition(new ƒ.Vector2( 8, -3)), ƒ.Color.CSS("black"));

  //   // third row (middle row)
  //   graph.insertNode("-6|-2", normNodePosition(new ƒ.Vector2(-6, -2)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-2|-2", normNodePosition(new ƒ.Vector2(-2, -2)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|-2", normNodePosition(new ƒ.Vector2( 2, -2)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "6|-2", normNodePosition(new ƒ.Vector2( 6, -2)), ƒ.Color.CSS("black"));

  //   // forth row
  //   graph.insertNode("-6|-1", normNodePosition(new ƒ.Vector2(-6,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-5|-1", normNodePosition(new ƒ.Vector2(-5,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-4|-1", normNodePosition(new ƒ.Vector2(-4,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-3|-1", normNodePosition(new ƒ.Vector2(-3,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-2|-1", normNodePosition(new ƒ.Vector2(-2,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-1|-1", normNodePosition(new ƒ.Vector2(-1,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|-1", normNodePosition(new ƒ.Vector2( 0,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "1|-1", normNodePosition(new ƒ.Vector2( 1,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|-1", normNodePosition(new ƒ.Vector2( 2,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "3|-1", normNodePosition(new ƒ.Vector2( 3,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|-1", normNodePosition(new ƒ.Vector2( 4,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "5|-1", normNodePosition(new ƒ.Vector2( 5,-1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "6|-1", normNodePosition(new ƒ.Vector2( 6,-1)), ƒ.Color.CSS("black"));-
  //   // fifth row (middle row)
  //   graph.insertNode("-4|0", normNodePosition(new ƒ.Vector2(-4, 0)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|0", normNodePosition(new ƒ.Vector2( 4, 0)), ƒ.Color.CSS("black"));

  //   // sisth row (middle row)
  //   graph.insertNode("-4|1", normNodePosition(new ƒ.Vector2(-4, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-3|1", normNodePosition(new ƒ.Vector2(-3, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-2|1", normNodePosition(new ƒ.Vector2(-2, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-1|1", normNodePosition(new ƒ.Vector2(-1, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|1", normNodePosition(new ƒ.Vector2( 0, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "1|1", normNodePosition(new ƒ.Vector2( 1, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|1", normNodePosition(new ƒ.Vector2( 2, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "3|1", normNodePosition(new ƒ.Vector2( 3, 1)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|1", normNodePosition(new ƒ.Vector2( 4, 1)), ƒ.Color.CSS("black"));
 
  //   // seventh row (middle row)
  //   graph.insertNode("-2|2", normNodePosition(new ƒ.Vector2(-2, 2)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|2", normNodePosition(new ƒ.Vector2( 2, 2)), ƒ.Color.CSS("black"));

  //   // eigth row
  //   graph.insertNode("-2|3", normNodePosition(new ƒ.Vector2(-2, 3)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-1|3", normNodePosition(new ƒ.Vector2(-1, 3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|3", normNodePosition(new ƒ.Vector2( 0, 3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "1|3", normNodePosition(new ƒ.Vector2( 1, 3)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|3", normNodePosition(new ƒ.Vector2( 2, 3)), ƒ.Color.CSS("black"));

  //   // ninth row
  //   graph.insertNode("0|4", normNodePosition(new ƒ.Vector2(0, 4)), ƒ.Color.CSS("black"));

  //   // tenth row
  //   graph.insertNode("-8|5", normNodePosition(new ƒ.Vector2(-8, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-7|5", normNodePosition(new ƒ.Vector2(-7, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-6|5", normNodePosition(new ƒ.Vector2(-6, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-5|5", normNodePosition(new ƒ.Vector2(-5, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-4|5", normNodePosition(new ƒ.Vector2(-4, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-3|5", normNodePosition(new ƒ.Vector2(-3, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-2|5", normNodePosition(new ƒ.Vector2(-2, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-1|5", normNodePosition(new ƒ.Vector2(-1, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|5", normNodePosition(new ƒ.Vector2( 0, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "1|5", normNodePosition(new ƒ.Vector2( 1, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|5", normNodePosition(new ƒ.Vector2( 2, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "3|5", normNodePosition(new ƒ.Vector2( 3, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|5", normNodePosition(new ƒ.Vector2( 4, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "5|5", normNodePosition(new ƒ.Vector2( 5, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "6|5", normNodePosition(new ƒ.Vector2( 6, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "7|5", normNodePosition(new ƒ.Vector2( 7, 5)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "8|5", normNodePosition(new ƒ.Vector2( 8, 5)), ƒ.Color.CSS("black"));

  //   // eleventh row
  //   graph.insertNode("-8|6", normNodePosition(new ƒ.Vector2(-8, 6)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "8|6", normNodePosition(new ƒ.Vector2( 8, 6)), ƒ.Color.CSS("black"));

  //   // twelth row
  //   graph.insertNode("-8|7", normNodePosition(new ƒ.Vector2(-8, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-7|7", normNodePosition(new ƒ.Vector2(-7, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-6|7", normNodePosition(new ƒ.Vector2(-6, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-5|7", normNodePosition(new ƒ.Vector2(-5, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-4|7", normNodePosition(new ƒ.Vector2(-4, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-3|7", normNodePosition(new ƒ.Vector2(-3, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-2|7", normNodePosition(new ƒ.Vector2(-2, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode("-1|7", normNodePosition(new ƒ.Vector2(-1, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "0|7", normNodePosition(new ƒ.Vector2( 0, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "1|7", normNodePosition(new ƒ.Vector2( 1, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "2|7", normNodePosition(new ƒ.Vector2( 2, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "3|7", normNodePosition(new ƒ.Vector2( 3, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "4|7", normNodePosition(new ƒ.Vector2( 4, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "5|7", normNodePosition(new ƒ.Vector2( 5, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "6|7", normNodePosition(new ƒ.Vector2( 6, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "7|7", normNodePosition(new ƒ.Vector2( 7, 7)), ƒ.Color.CSS("black"));
  //   graph.insertNode( "8|7", normNodePosition(new ƒ.Vector2( 8, 7)), ƒ.Color.CSS("black"));

  //   // top, finish line
  //   graph.insertNode("0|8", normNodePosition(new ƒ.Vector2(0, 8)), ƒ.Color.CSS("black"));

  //   graph.insertNode("SR1", normNodePosition(new ƒ.Vector2(-6.5, -6)), ƒ.Color.CSS("DarkRed"));
  //   graph.insertNode("SR2", normNodePosition(new ƒ.Vector2(-5.5, -6)), ƒ.Color.CSS("DarkRed"));
  //   graph.insertNode("SR3", normNodePosition(new ƒ.Vector2(-7 ,  -7)), ƒ.Color.CSS("DarkRed"));
  //   graph.insertNode("SR4", normNodePosition(new ƒ.Vector2(-6 ,  -7)), ƒ.Color.CSS("DarkRed"));
  //   graph.insertNode("SR5", normNodePosition(new ƒ.Vector2(-5 ,  -7)), ƒ.Color.CSS("DarkRed"));

  //   graph.insertNode("SG1", normNodePosition(new ƒ.Vector2(-2.5, -6)), ƒ.Color.CSS("DarkGreen"));
  //   graph.insertNode("SG2", normNodePosition(new ƒ.Vector2(-1.5, -6)), ƒ.Color.CSS("DarkGreen"));
  //   graph.insertNode("SG3", normNodePosition(new ƒ.Vector2(-3,   -7)), ƒ.Color.CSS("DarkGreen"));
  //   graph.insertNode("SG4", normNodePosition(new ƒ.Vector2(-2,   -7)), ƒ.Color.CSS("DarkGreen"));
  //   graph.insertNode("SG5", normNodePosition(new ƒ.Vector2(-1,   -7)), ƒ.Color.CSS("DarkGreen"));

  //   graph.insertNode("SY1", normNodePosition(new ƒ.Vector2(1.5, -6)), new ƒ.Color(0.6, 0.6, 0.1));
  //   graph.insertNode("SY2", normNodePosition(new ƒ.Vector2(2.5, -6)), new ƒ.Color(0.6, 0.6, 0.1));
  //   graph.insertNode("SY3", normNodePosition(new ƒ.Vector2(1,   -7)), new ƒ.Color(0.6, 0.6, 0.1));
  //   graph.insertNode("SY4", normNodePosition(new ƒ.Vector2(2,   -7)), new ƒ.Color(0.6, 0.6, 0.1));
  //   graph.insertNode("SY5", normNodePosition(new ƒ.Vector2(3,   -7)), new ƒ.Color(0.6, 0.6, 0.1));

  //   graph.insertNode("SB1", normNodePosition(new ƒ.Vector2(5.5, -6)), ƒ.Color.CSS("DarkBlue"));
  //   graph.insertNode("SB2", normNodePosition(new ƒ.Vector2(6.5, -6)), ƒ.Color.CSS("DarkBlue"));
  //   graph.insertNode("SB3", normNodePosition(new ƒ.Vector2(5,   -7)), ƒ.Color.CSS("DarkBlue"));
  //   graph.insertNode("SB4", normNodePosition(new ƒ.Vector2(6,   -7)), ƒ.Color.CSS("DarkBlue"));
  //   graph.insertNode("SB5", normNodePosition(new ƒ.Vector2(7,   -7)), ƒ.Color.CSS("DarkBlue"));
  // }

  // function insertEdge(_field: Field): void {
  //   let xDigit: number = _field.position.x * 2;
  //   let yDigit: number = _field.position.y * 2;

  //   if (graph.nodes.has(xDigit.toString() + "|" + (yDigit + 1).toString())) {
  //     graph.insertSingleEdge(_field.label, xDigit.toString() + "|" + (yDigit + 1).toString());
  //   }

  //   if (graph.nodes.has((xDigit + 1).toString() + "|" + yDigit.toString())) {
  //     graph.insertSingleEdge(_field.label, (xDigit + 1).toString() + "|" + yDigit.toString());
  //   }
  //   if (graph.nodes.has((xDigit - 1).toString() + "|" + yDigit.toString())) {
  //     graph.insertSingleEdge(_field.label, (xDigit - 1).toString() + "|" + yDigit.toString());
  //   }

  //   if (graph.nodes.has(xDigit.toString() + "|" + (yDigit - 1).toString())) {
  //     graph.insertSingleEdge(_field.label, xDigit.toString() + "|" + (yDigit - 1).toString());
  //   }
  // }

  // function insertRemainingEdges(): void {
  //   let colorStrings: Map<string, string> = new Map([["R", "-6|-5"], ["G", "-2|-5"], ["Y", "2|-5"], ["B", "6|-5"]]);

  //   for (let [color, startNode] of colorStrings) {
  //     for (let i: number = 1; i <= 5; i++) {
  //       graph.insertSingleEdge("S" + color + i.toString(), startNode);
  //     } 
  //   }
  // }

  // function normNodePosition(_position: ƒ.Vector2): ƒ.Vector2 {
  //   _position.x /= 2;
  //   _position.y /= 2;
  //   return _position
  // } 
}
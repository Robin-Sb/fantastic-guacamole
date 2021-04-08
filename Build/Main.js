"use strict";
var Malefiz;
(function (Malefiz) {
    class Dice extends ƒ.Node {
        constructor() {
            super("Dice");
            this.addComponent(new ƒ.ComponentTransform);
            this.addFaces();
        }
        addFaces() {
            let face1 = this.addFace("dice1");
            face1.mtxLocal.translateZ(0.5);
            let face2 = this.addFace("dice2");
            face2.mtxLocal.rotateY(90);
            face2.mtxLocal.translateX(0.5);
            let face3 = this.addFace("dice3");
            face3.mtxLocal.translateZ(-0.5);
            let face4 = this.addFace("dice4");
            face4.mtxLocal.rotateY(-90);
            face4.mtxLocal.translateX(-0.5);
            let face5 = this.addFace("dice5");
            face5.mtxLocal.translateZ(0.5);
            face5.mtxLocal.rotateX(-90);
            let face6 = this.addFace("dice6");
            face6.mtxLocal.rotateX(90);
            face6.mtxLocal.translateX(0.5);
        }
        addFace(id) {
            let face = new ƒ.Node(id);
            face.addComponent(new ƒ.ComponentTransform);
            face.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad));
            face.addComponent(new ƒ.ComponentMaterial(new ƒ.Material(id + "Mat", ƒ.ShaderTexture, this.generateTextureFromId(id))));
            this.addChild(face);
            return face;
        }
        generateTextureFromId(textureId) {
            let id = "#" + textureId;
            let coatTextured = new ƒ.CoatTextured();
            let img = document.querySelector(id);
            let textureImage = new ƒ.TextureImage();
            textureImage.image = img;
            coatTextured.texture = textureImage;
            return coatTextured;
        }
    }
    Malefiz.Dice = Dice;
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class DisplayedField extends ƒ.Node {
        constructor(_name, _position, _color) {
            super(_name);
            this.addComponent(new ƒ.ComponentMesh(new Malefiz.MeshCircle()));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("FieldMat", ƒ.ShaderFlat, new ƒ.CoatColored(_color))));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.2, 0.2));
        }
    }
    Malefiz.DisplayedField = DisplayedField;
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class Graph {
        constructor() {
            this.nodes = new Map();
        }
        insertEdge(_start, _end) {
            let startNode = this.nodes.get(_start);
            let endNode = this.nodes.get(_end);
            startNode.edgesOfNode.push(new Edge(endNode));
            endNode.edgesOfNode.push(new Edge(startNode));
        }
        insertSingleEdge(_start, _end) {
            let startNode = this.nodes.get(_start);
            let endNode = this.nodes.get(_end);
            startNode.edgesOfNode.push(new Edge(endNode));
        }
        insertNode(_label, _position, _color) {
            let newNode = new Field(_label, _position, _color);
            this.nodes.set(_label, newNode);
        }
    }
    Malefiz.Graph = Graph;
    class Field extends ƒ.Node {
        constructor(_label, _position, _color) {
            super(_label);
            this.edgesOfNode = [];
            this.token = null;
            this.addComponent(new ƒ.ComponentMesh(new Malefiz.MeshCircle()));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("FieldMat", ƒ.ShaderFlat, new ƒ.CoatColored(_color))));
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3())));
            this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.2, 0.2));
            this.label = _label;
            this.position = _position;
            this.color = _color;
        }
    }
    Malefiz.Field = Field;
    class Edge {
        constructor(_endNode) {
            this.#endNode = _endNode;
        }
        #endNode;
        get endNode() {
            return this.#endNode;
        }
    }
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
    let branch = new ƒ.Node("Branch");
    Malefiz.viewport = new ƒ.Viewport();
    Malefiz.graph = new Malefiz.Graph();
    let players = [];
    function init(_event) {
        const canvas = document.querySelector("canvas");
        addButtonEventListeners();
        let board = new ƒ.Node("Board");
        board.addComponent(new ƒ.ComponentTransform());
        let mesh = new ƒ.MeshQuad();
        board.addComponent(new ƒ.ComponentMesh(mesh));
        let material = new ƒ.Material("BoardMat", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.8, 0.6, 0.05, 1)));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        board.addComponent(cmpMaterial);
        board.mtxLocal.scale(new ƒ.Vector3(10, 10, 0));
        let cmpCamera = new ƒ.ComponentCamera();
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
        Malefiz.viewport.initialize("Viewport", branch, cmpCamera, canvas);
        Malefiz.SceneBuilder.buildScene();
        Malefiz.viewport.draw();
    }
    function addButtonEventListeners() {
        document.querySelector("#select-red").addEventListener("click", selectRed);
        document.querySelector("#select-green").addEventListener("click", selectGreen);
        document.querySelector("#select-yellow").addEventListener("click", selectYellow);
        document.querySelector("#select-blue").addEventListener("click", selectBlue);
        document.querySelector("#start").addEventListener("click", startGame);
    }
    function startGame() {
        if (players.length < 2)
            return;
        let buttons = document.getElementsByClassName("button");
        for (let button of buttons) {
            button.style.display = "none";
        }
        new Malefiz.PlayerController(players);
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
    function selectRed() {
        handlePlayerSelection(Malefiz.Color.RED);
    }
    function selectGreen() {
        handlePlayerSelection(Malefiz.Color.GREEN);
    }
    function selectYellow() {
        handlePlayerSelection(Malefiz.Color.YELLOW);
    }
    function selectBlue() {
        handlePlayerSelection(Malefiz.Color.BLUE);
    }
    function handlePlayerSelection(_type) {
        let isSelected = false;
        for (let i = 0; i < players.length; i++) {
            if (players[i].color === _type) {
                isSelected = true;
                players[i].removeTokens();
                players.splice(i, 1);
            }
        }
        if (!isSelected) {
            players.push(new Malefiz.Player(_type));
        }
        drawScene();
    }
    function drawScene() {
        Malefiz.viewport.draw();
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
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class MeshCircle extends ƒ.Mesh {
        constructor(_name = "MeshCircle", _sections = 15) {
            super(_name);
            this.create(_sections);
        }
        create(_sections) {
            this.sections = Math.min(_sections, 128);
            let vertices = [];
            let normals = [];
            let texCoords = [];
            let unitVertices = this.getUnitVertices();
            let valueZ = 1;
            // center point
            vertices.push(0);
            vertices.push(0);
            vertices.push(valueZ);
            normals.push(0);
            normals.push(0);
            normals.push(valueZ);
            texCoords.push(0.5);
            texCoords.push(0.5);
            for (let j = 0, k = 0; j < this.sections; j++, k += 3) {
                let unitX = unitVertices[k];
                let unitY = unitVertices[k + 1];
                // vertex bottom/top with x, y, z
                vertices.push(unitX);
                vertices.push(unitY);
                vertices.push(valueZ);
                //normals bottom/top with x, y, z
                normals.push(0);
                normals.push(0);
                normals.push(valueZ);
                // texCoords bottom/top with u, v
                texCoords.push(-unitX * 0.5 + 0.5);
                texCoords.push(-unitY * 0.5 + 0.5);
            }
            this.ƒvertices = new Float32Array(vertices);
            this.ƒtextureUVs = new Float32Array(texCoords);
            this.ƒnormalsFace = new Float32Array(normals);
            this.ƒindices = this.createIndices();
            this.createRenderBuffers();
        }
        getUnitVertices() {
            let delta = (2 * Math.PI) / this.sections;
            let angle;
            let unitVertices = [];
            for (let i = 0; i < this.sections; i++) {
                angle = delta * i;
                unitVertices.push(Math.cos(angle));
                unitVertices.push(Math.sin(angle));
                unitVertices.push(0);
            }
            return unitVertices;
        }
        createIndices() {
            let baseCenterIndex = 0;
            let indices = [];
            // starting index for bottom/top vertices
            let k = baseCenterIndex + 1;
            for (let i = 0; i < this.sections; i++, k++) {
                if (i < this.sections - 1) {
                    // bottom indices right -> center -> left
                    indices.push(baseCenterIndex);
                    indices.push(k);
                    indices.push(k + 1);
                }
                else {
                    // loops back for the last index
                    indices.push(baseCenterIndex);
                    indices.push(k);
                    indices.push(baseCenterIndex + 1);
                }
            }
            return new Uint16Array(indices);
        }
    }
    Malefiz.MeshCircle = MeshCircle;
})(Malefiz || (Malefiz = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * Generate a simple cube with edges of length 1, each face consisting of two trigons
     * ```plaintext
     *            4____7
     *           0/__3/|
     *            ||5_||6
     *           1|/_2|/
     * ```
     * @authors Jirka Dell'Oro-Friedl, HFU, 2019
     */
    class MeshDiceCube extends FudgeCore.Mesh {
        constructor(_name = "MeshDiceCube") {
            super(_name);
            // this.create();
        }
        createVertices() {
            let vertices = new Float32Array([
                // front
                /*0*/ -1, 1, 1, /*1*/ -1, -1, 1, /*2*/ 1, -1, 1, /*3*/ 1, 1, 1,
                // back
                /*4*/ -1, 1, -1, /* 5*/ -1, -1, -1, /* 6*/ 1, -1, -1, /* 7*/ 1, 1, -1,
                // front
                /*0*/ -1, 1, 1, /*1*/ -1, -1, 1, /*2*/ 1, -1, 1, /*3*/ 1, 1, 1,
                // back
                /*4*/ -1, 1, -1, /* 5*/ -1, -1, -1, /* 6*/ 1, -1, -1, /* 7*/ 1, 1, -1,
                // front
                /*0*/ -1, 1, 1, /*1*/ -1, -1, 1, /*2*/ 1, -1, 1, /*3*/ 1, 1, 1,
                // back
                /*4*/ -1, 1, -1, /* 5*/ -1, -1, -1, /* 6*/ 1, -1, -1, /* 7*/ 1, 1, -1,
            ]);
            // scale down to a length of 1 for all edges
            vertices = vertices.map(_value => _value / 2);
            return vertices;
        }
        createIndices() {
            let indices = new Uint16Array([
                // front 0-5
                1, 2, 0, 2, 3, 0,
                // back 6-11
                6, 5, 7, 5, 4, 7,
                // right 12-17
                2 + 8, 6 + 8, 3 + 8, 6 + 8, 7 + 8, 3 + 8,
                // left 18-23
                5 + 8, 1 + 8, 4 + 8, 1 + 8, 0 + 8, 4 + 8,
                // bottom 24-29
                5 + 16, 6 + 16, 1 + 16, 6 + 16, 2 + 16, 1 + 16,
                // top 30-35
                4 + 16, 0 + 16, 3 + 16, 7 + 16, 4 + 16, 3 + 16
            ]);
            return indices;
        }
        createTextureUVs() {
            let textureUVs = new Float32Array([
                // front
                0, 0.75, 0, 0.5, 0.25, 0.5, 0.25, 0.75,
                // /*0*/ 0, 0, /*1*/ 0, 1,  /*2*/ 1, 1, /*3*/ 1, 0,
                // back
                /*0,8*/ 0.5, 0.25, /*1,9*/ 0.5, 0.5, /*2,10*/ 0.75, 0.25, /*3,11*/ 0.75, 0.5,
                // right / left
                /*0,8*/ 0, 0, /*1,9*/ 0, 1, /*2,10*/ 1, 1, /*3,11*/ 1, 0,
                /*4,12*/ -1, 0, /*5,13*/ -1, 1, /*6,14*/ 2, 1, /*7,15*/ 2, 0,
                // bottom / top
                /*0,16*/ 1, 0, /*1,17*/ 1, 1, /*2,18*/ 1, 2, /*3,19*/ 1, -1,
                /*4,20*/ 0, 0, /*5,21*/ 0, 1, /*6,22*/ 0, 2, /*7,23*/ 0, -1
            ]);
            return textureUVs;
        }
        createFaceNormals() {
            let normals = new Float32Array([
                // front
                /*0*/ 0, 0, 1, /*1*/ 0, 0, 1, /*2*/ 0, 0, 1, /*3*/ 0, 0, 1,
                // back
                /*4*/ 0, 0, -1, /*5*/ 0, 0, -1, /*6*/ 0, 0, -1, /*7*/ 0, 0, -1,
                // right
                /*8*/ -1, 0, 0, /*9*/ -1, 0, 0, /*10*/ 1, 0, 0, /*11*/ 1, 0, 0,
                // left
                /*12*/ -1, 0, 0, /*13*/ -1, 0, 0, /*14*/ 1, 0, 0, /*15*/ 1, 0, 0,
                // bottom
                /*16*/ 0, 1, 0, /*17*/ 0, -1, 0, /*18*/ 0, -1, 0, /*19*/ 0, 1, 0,
                // top 
                /*20*/ 0, 1, 0, /*21*/ 0, -1, 0, /*22*/ 0, -1, 0, /*23*/ 0, 1, 0
            ]);
            return normals;
        }
    }
    MeshDiceCube.iSubclass = FudgeCore.Mesh.registerSubclass(MeshDiceCube);
    FudgeCore.MeshDiceCube = MeshDiceCube;
})(FudgeCore || (FudgeCore = {}));
var Malefiz;
(function (Malefiz) {
    class Player {
        constructor(_type) {
            this.colorToCSSMap = new Map([[Color.RED, ƒ.Color.CSS("red")], [Color.GREEN, ƒ.Color.CSS("LawnGreen")], [Color.YELLOW, ƒ.Color.CSS("yellow")], [Color.BLUE, ƒ.Color.CSS("DeepSkyBlue")]]);
            this.color = _type;
            this.#tokens = new ƒ.Node("Token" + _type);
            Malefiz.viewport.getBranch().addChild(this.#tokens);
            for (let i = 1; i <= 5; i++) {
                let position = Malefiz.graph.nodes.get("S" + _type + i).position;
                let token = new Malefiz.Token(_type + i, this.colorToCSSMap.get(_type), Malefiz.TYPE.PLAYER, Malefiz.graph.nodes.get("S" + _type + i).label, position);
                token.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCylinder("MeshCylinder")));
                this.#tokens.addChild(token);
                Malefiz.graph.nodes.get("S" + _type + i).token = token;
            }
        }
        #tokens;
        get tokens() {
            return this.#tokens;
        }
        removeTokens() {
            for (let token of this.#tokens.getChildren()) {
                Malefiz.viewport.getBranch().removeChild(token);
            }
        }
    }
    Malefiz.Player = Player;
    let Color;
    (function (Color) {
        Color["RED"] = "R";
        Color["GREEN"] = "G";
        Color["BLUE"] = "B";
        Color["YELLOW"] = "Y";
    })(Color = Malefiz.Color || (Malefiz.Color = {}));
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class PlayerController {
        constructor(_players) {
            this.players = _players;
            Malefiz.viewport.addEventListener("\u0192pointerdown" /* DOWN */, this.executeTurn);
            Malefiz.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        }
        executeTurn(_event) {
            switch (this.currentStage) {
                case STAGE.ROLL:
                    this.roll();
                    break;
                case STAGE.PICK_TOKEN:
                    this.pickToken(_event);
                    break;
                case STAGE.MOVE_TOKEN:
                    this.moveToken(_event);
                    break;
            }
        }
        roll() {
            this.diceValue = Math.floor((Math.random() * 6) + 1);
        }
        pickToken(_event) {
            let validTokenIsPicked = false;
            let picks = ƒ.Picker.pickViewport(Malefiz.viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
            for (let pick of picks) {
                if (!(pick.node instanceof Malefiz.Token))
                    continue;
                for (let token of this.players[this.currentTurn % this.players.length].tokens.getChildren()) {
                    if (pick.node === token) {
                        validTokenIsPicked = true;
                        this.pickedToken = token;
                    }
                }
            }
            if (!validTokenIsPicked)
                this.pickedToken = null;
            // adjacentFields is global because we need it in the next event listener too
            this.adjacentFields = [];
            if (this.pickedToken) {
                this.findNodesWithDistanceToNode(Malefiz.graph.nodes.get(this.pickedToken.field), this.diceValue);
            }
            this.drawPossibleMoves(this.adjacentFields);
        }
        moveToken(_event) {
            let tokenIsMovable = false;
            let picks = ƒ.Picker.pickViewport(Malefiz.viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
            let selectedField;
            for (let pick of picks) {
                if (!(pick.node instanceof Malefiz.Field))
                    continue;
                for (let field of this.adjacentFields) {
                    if (pick.node === field) {
                        tokenIsMovable = true;
                        selectedField = field;
                    }
                }
            }
            if (tokenIsMovable) {
                this.currentTurn++;
                Malefiz.graph.nodes.get(this.pickedToken.field).token = null;
                this.pickedToken.field = selectedField.label;
                this.pickedToken.mtxLocal.translation = selectedField.position.toVector3();
                Malefiz.viewport.removeEventListener("\u0192pointerdown" /* DOWN */, this.moveToken);
            }
            Malefiz.viewport.draw();
        }
        findNodesWithDistanceToNode(_node, _distance) {
            _distance--;
            if (_distance >= 0) {
                for (let edge of _node.edgesOfNode) {
                    for (let i = 0; i < edge.endNode.edgesOfNode.length; i++) {
                        if (edge.endNode.edgesOfNode[i].endNode === _node) {
                            edge.endNode.edgesOfNode.splice(i, 1);
                        }
                    }
                    this.findNodesWithDistanceToNode(edge.endNode, _distance);
                }
            }
            else {
                this.adjacentFields.push(_node);
            }
        }
        drawPossibleMoves(adjacentFields) {
            let ctx = Malefiz.viewport.getCanvas().getContext("2d");
            for (let field of adjacentFields) {
                let position = Malefiz.viewport.pointWorldToClient(field.position.toVector3());
                ctx.beginPath();
                let radius = ƒ.Vector2.DIFFERENCE(position, Malefiz.viewport.pointWorldToClient(ƒ.Vector2.SUM(field.position, new ƒ.Vector2(0.2, 0)).toVector3())).magnitude;
                ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'yellow';
                ctx.fill();
            }
        }
    }
    Malefiz.PlayerController = PlayerController;
    let STAGE;
    (function (STAGE) {
        STAGE[STAGE["ROLL"] = 0] = "ROLL";
        STAGE[STAGE["PICK_TOKEN"] = 1] = "PICK_TOKEN";
        STAGE[STAGE["MOVE_TOKEN"] = 2] = "MOVE_TOKEN";
    })(STAGE || (STAGE = {}));
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class SceneBuilder {
        static buildScene() {
            SceneBuilder.addNodes();
            let fieldRoot = new ƒ.Node("FieldRoot");
            for (let [label, field] of Malefiz.graph.nodes) {
                fieldRoot.addChild(field);
                SceneBuilder.insertEdges(field);
            }
            Malefiz.viewport.getBranch().addChild(fieldRoot);
            SceneBuilder.insertRemainingEdges();
        }
        static addNodes() {
            Malefiz.graph.insertNode("-1|-5", normNodePosition(new ƒ.Vector2(-1, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-2|-5", normNodePosition(new ƒ.Vector2(-2, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-3|-5", normNodePosition(new ƒ.Vector2(-3, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-4|-5", normNodePosition(new ƒ.Vector2(-4, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-5|-5", normNodePosition(new ƒ.Vector2(-5, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-6|-5", normNodePosition(new ƒ.Vector2(-6, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-7|-5", normNodePosition(new ƒ.Vector2(-7, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-8|-5", normNodePosition(new ƒ.Vector2(-8, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|-5", normNodePosition(new ƒ.Vector2(0, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("1|-5", normNodePosition(new ƒ.Vector2(1, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|-5", normNodePosition(new ƒ.Vector2(2, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("3|-5", normNodePosition(new ƒ.Vector2(3, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|-5", normNodePosition(new ƒ.Vector2(4, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("5|-5", normNodePosition(new ƒ.Vector2(5, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("6|-5", normNodePosition(new ƒ.Vector2(6, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("7|-5", normNodePosition(new ƒ.Vector2(7, -5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("8|-5", normNodePosition(new ƒ.Vector2(8, -5)), ƒ.Color.CSS("black"));
            // second row (middle row)
            Malefiz.graph.insertNode("-8|-4", normNodePosition(new ƒ.Vector2(-8, -4)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-4|-4", normNodePosition(new ƒ.Vector2(-4, -4)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|-4", normNodePosition(new ƒ.Vector2(0, -4)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|-4", normNodePosition(new ƒ.Vector2(4, -4)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("8|-4", normNodePosition(new ƒ.Vector2(8, -4)), ƒ.Color.CSS("black"));
            // third row
            Malefiz.graph.insertNode("-8|-3", normNodePosition(new ƒ.Vector2(-8, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-7|-3", normNodePosition(new ƒ.Vector2(-7, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-6|-3", normNodePosition(new ƒ.Vector2(-6, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-5|-3", normNodePosition(new ƒ.Vector2(-5, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-4|-3", normNodePosition(new ƒ.Vector2(-4, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-3|-3", normNodePosition(new ƒ.Vector2(-3, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-2|-3", normNodePosition(new ƒ.Vector2(-2, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-1|-3", normNodePosition(new ƒ.Vector2(-1, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|-3", normNodePosition(new ƒ.Vector2(0, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("1|-3", normNodePosition(new ƒ.Vector2(1, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|-3", normNodePosition(new ƒ.Vector2(2, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("3|-3", normNodePosition(new ƒ.Vector2(3, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|-3", normNodePosition(new ƒ.Vector2(4, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("5|-3", normNodePosition(new ƒ.Vector2(5, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("6|-3", normNodePosition(new ƒ.Vector2(6, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("7|-3", normNodePosition(new ƒ.Vector2(7, -3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("8|-3", normNodePosition(new ƒ.Vector2(8, -3)), ƒ.Color.CSS("black"));
            // third row (middle row)
            Malefiz.graph.insertNode("-6|-2", normNodePosition(new ƒ.Vector2(-6, -2)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-2|-2", normNodePosition(new ƒ.Vector2(-2, -2)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|-2", normNodePosition(new ƒ.Vector2(2, -2)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("6|-2", normNodePosition(new ƒ.Vector2(6, -2)), ƒ.Color.CSS("black"));
            // forth row
            Malefiz.graph.insertNode("-6|-1", normNodePosition(new ƒ.Vector2(-6, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-5|-1", normNodePosition(new ƒ.Vector2(-5, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-4|-1", normNodePosition(new ƒ.Vector2(-4, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-3|-1", normNodePosition(new ƒ.Vector2(-3, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-2|-1", normNodePosition(new ƒ.Vector2(-2, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-1|-1", normNodePosition(new ƒ.Vector2(-1, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|-1", normNodePosition(new ƒ.Vector2(0, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("1|-1", normNodePosition(new ƒ.Vector2(1, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|-1", normNodePosition(new ƒ.Vector2(2, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("3|-1", normNodePosition(new ƒ.Vector2(3, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|-1", normNodePosition(new ƒ.Vector2(4, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("5|-1", normNodePosition(new ƒ.Vector2(5, -1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("6|-1", normNodePosition(new ƒ.Vector2(6, -1)), ƒ.Color.CSS("black"));
            -
            // fifth row (middle row)
            Malefiz.graph.insertNode("-4|0", normNodePosition(new ƒ.Vector2(-4, 0)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|0", normNodePosition(new ƒ.Vector2(4, 0)), ƒ.Color.CSS("black"));
            // sisth row (middle row)
            Malefiz.graph.insertNode("-4|1", normNodePosition(new ƒ.Vector2(-4, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-3|1", normNodePosition(new ƒ.Vector2(-3, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-2|1", normNodePosition(new ƒ.Vector2(-2, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-1|1", normNodePosition(new ƒ.Vector2(-1, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|1", normNodePosition(new ƒ.Vector2(0, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("1|1", normNodePosition(new ƒ.Vector2(1, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|1", normNodePosition(new ƒ.Vector2(2, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("3|1", normNodePosition(new ƒ.Vector2(3, 1)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|1", normNodePosition(new ƒ.Vector2(4, 1)), ƒ.Color.CSS("black"));
            // seventh row (middle row)
            Malefiz.graph.insertNode("-2|2", normNodePosition(new ƒ.Vector2(-2, 2)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|2", normNodePosition(new ƒ.Vector2(2, 2)), ƒ.Color.CSS("black"));
            // eigth row
            Malefiz.graph.insertNode("-2|3", normNodePosition(new ƒ.Vector2(-2, 3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-1|3", normNodePosition(new ƒ.Vector2(-1, 3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|3", normNodePosition(new ƒ.Vector2(0, 3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("1|3", normNodePosition(new ƒ.Vector2(1, 3)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|3", normNodePosition(new ƒ.Vector2(2, 3)), ƒ.Color.CSS("black"));
            // ninth row
            Malefiz.graph.insertNode("0|4", normNodePosition(new ƒ.Vector2(0, 4)), ƒ.Color.CSS("black"));
            // tenth row
            Malefiz.graph.insertNode("-8|5", normNodePosition(new ƒ.Vector2(-8, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-7|5", normNodePosition(new ƒ.Vector2(-7, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-6|5", normNodePosition(new ƒ.Vector2(-6, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-5|5", normNodePosition(new ƒ.Vector2(-5, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-4|5", normNodePosition(new ƒ.Vector2(-4, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-3|5", normNodePosition(new ƒ.Vector2(-3, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-2|5", normNodePosition(new ƒ.Vector2(-2, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-1|5", normNodePosition(new ƒ.Vector2(-1, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|5", normNodePosition(new ƒ.Vector2(0, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("1|5", normNodePosition(new ƒ.Vector2(1, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|5", normNodePosition(new ƒ.Vector2(2, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("3|5", normNodePosition(new ƒ.Vector2(3, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|5", normNodePosition(new ƒ.Vector2(4, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("5|5", normNodePosition(new ƒ.Vector2(5, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("6|5", normNodePosition(new ƒ.Vector2(6, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("7|5", normNodePosition(new ƒ.Vector2(7, 5)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("8|5", normNodePosition(new ƒ.Vector2(8, 5)), ƒ.Color.CSS("black"));
            // eleventh row
            Malefiz.graph.insertNode("-8|6", normNodePosition(new ƒ.Vector2(-8, 6)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("8|6", normNodePosition(new ƒ.Vector2(8, 6)), ƒ.Color.CSS("black"));
            // twelth row
            Malefiz.graph.insertNode("-8|7", normNodePosition(new ƒ.Vector2(-8, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-7|7", normNodePosition(new ƒ.Vector2(-7, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-6|7", normNodePosition(new ƒ.Vector2(-6, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-5|7", normNodePosition(new ƒ.Vector2(-5, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-4|7", normNodePosition(new ƒ.Vector2(-4, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-3|7", normNodePosition(new ƒ.Vector2(-3, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-2|7", normNodePosition(new ƒ.Vector2(-2, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("-1|7", normNodePosition(new ƒ.Vector2(-1, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("0|7", normNodePosition(new ƒ.Vector2(0, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("1|7", normNodePosition(new ƒ.Vector2(1, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("2|7", normNodePosition(new ƒ.Vector2(2, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("3|7", normNodePosition(new ƒ.Vector2(3, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|7", normNodePosition(new ƒ.Vector2(4, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("5|7", normNodePosition(new ƒ.Vector2(5, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("6|7", normNodePosition(new ƒ.Vector2(6, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("7|7", normNodePosition(new ƒ.Vector2(7, 7)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("8|7", normNodePosition(new ƒ.Vector2(8, 7)), ƒ.Color.CSS("black"));
            // top, finish line
            Malefiz.graph.insertNode("0|8", normNodePosition(new ƒ.Vector2(0, 8)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("SR1", normNodePosition(new ƒ.Vector2(-6.5, -6)), ƒ.Color.CSS("DarkRed"));
            Malefiz.graph.insertNode("SR2", normNodePosition(new ƒ.Vector2(-5.5, -6)), ƒ.Color.CSS("DarkRed"));
            Malefiz.graph.insertNode("SR3", normNodePosition(new ƒ.Vector2(-7, -7)), ƒ.Color.CSS("DarkRed"));
            Malefiz.graph.insertNode("SR4", normNodePosition(new ƒ.Vector2(-6, -7)), ƒ.Color.CSS("DarkRed"));
            Malefiz.graph.insertNode("SR5", normNodePosition(new ƒ.Vector2(-5, -7)), ƒ.Color.CSS("DarkRed"));
            Malefiz.graph.insertNode("SG1", normNodePosition(new ƒ.Vector2(-2.5, -6)), ƒ.Color.CSS("DarkGreen"));
            Malefiz.graph.insertNode("SG2", normNodePosition(new ƒ.Vector2(-1.5, -6)), ƒ.Color.CSS("DarkGreen"));
            Malefiz.graph.insertNode("SG3", normNodePosition(new ƒ.Vector2(-3, -7)), ƒ.Color.CSS("DarkGreen"));
            Malefiz.graph.insertNode("SG4", normNodePosition(new ƒ.Vector2(-2, -7)), ƒ.Color.CSS("DarkGreen"));
            Malefiz.graph.insertNode("SG5", normNodePosition(new ƒ.Vector2(-1, -7)), ƒ.Color.CSS("DarkGreen"));
            Malefiz.graph.insertNode("SY1", normNodePosition(new ƒ.Vector2(1.5, -6)), new ƒ.Color(0.6, 0.6, 0.1));
            Malefiz.graph.insertNode("SY2", normNodePosition(new ƒ.Vector2(2.5, -6)), new ƒ.Color(0.6, 0.6, 0.1));
            Malefiz.graph.insertNode("SY3", normNodePosition(new ƒ.Vector2(1, -7)), new ƒ.Color(0.6, 0.6, 0.1));
            Malefiz.graph.insertNode("SY4", normNodePosition(new ƒ.Vector2(2, -7)), new ƒ.Color(0.6, 0.6, 0.1));
            Malefiz.graph.insertNode("SY5", normNodePosition(new ƒ.Vector2(3, -7)), new ƒ.Color(0.6, 0.6, 0.1));
            Malefiz.graph.insertNode("SB1", normNodePosition(new ƒ.Vector2(5.5, -6)), ƒ.Color.CSS("DarkBlue"));
            Malefiz.graph.insertNode("SB2", normNodePosition(new ƒ.Vector2(6.5, -6)), ƒ.Color.CSS("DarkBlue"));
            Malefiz.graph.insertNode("SB3", normNodePosition(new ƒ.Vector2(5, -7)), ƒ.Color.CSS("DarkBlue"));
            Malefiz.graph.insertNode("SB4", normNodePosition(new ƒ.Vector2(6, -7)), ƒ.Color.CSS("DarkBlue"));
            Malefiz.graph.insertNode("SB5", normNodePosition(new ƒ.Vector2(7, -7)), ƒ.Color.CSS("DarkBlue"));
        }
        static insertEdges(_field) {
            let xDigit = _field.position.x * 2;
            let yDigit = _field.position.y * 2;
            if (Malefiz.graph.nodes.has(xDigit.toString() + "|" + (yDigit + 1).toString())) {
                Malefiz.graph.insertSingleEdge(_field.label, xDigit.toString() + "|" + (yDigit + 1).toString());
            }
            if (Malefiz.graph.nodes.has((xDigit + 1).toString() + "|" + yDigit.toString())) {
                Malefiz.graph.insertSingleEdge(_field.label, (xDigit + 1).toString() + "|" + yDigit.toString());
            }
            if (Malefiz.graph.nodes.has((xDigit - 1).toString() + "|" + yDigit.toString())) {
                Malefiz.graph.insertSingleEdge(_field.label, (xDigit - 1).toString() + "|" + yDigit.toString());
            }
            if (Malefiz.graph.nodes.has(xDigit.toString() + "|" + (yDigit - 1).toString())) {
                Malefiz.graph.insertSingleEdge(_field.label, xDigit.toString() + "|" + (yDigit - 1).toString());
            }
        }
        static insertRemainingEdges() {
            let colorStrings = new Map([["R", "-6|-5"], ["G", "-2|-5"], ["Y", "2|-5"], ["B", "6|-5"]]);
            for (let [color, startNode] of colorStrings) {
                for (let i = 1; i <= 5; i++) {
                    Malefiz.graph.insertSingleEdge("S" + color + i.toString(), startNode);
                }
            }
        }
    }
    Malefiz.SceneBuilder = SceneBuilder;
    function normNodePosition(_position) {
        _position.x /= 2;
        _position.y /= 2;
        return _position;
    }
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class Token extends ƒ.Node {
        constructor(_name, _color, _type, _field, _position) {
            super(_name);
            this.diameter = 0.15;
            this.type = _type;
            this.color = _color;
            this.field = _field;
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("TokenMat" + _type, ƒ.ShaderFlat, new ƒ.CoatColored(_color))));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translate(new ƒ.Vector3(_position.x, _position.y, 0));
            this.mtxLocal.scale(new ƒ.Vector3(this.diameter, this.diameter, 0.3));
            Malefiz.viewport.getBranch().addChild(this);
        }
    }
    Malefiz.Token = Token;
    let TYPE;
    (function (TYPE) {
        TYPE[TYPE["PLAYER"] = 0] = "PLAYER";
        TYPE[TYPE["BARRIER"] = 1] = "BARRIER";
        TYPE[TYPE["WIN"] = 2] = "WIN";
    })(TYPE = Malefiz.TYPE || (Malefiz.TYPE = {}));
})(Malefiz || (Malefiz = {}));
//# sourceMappingURL=Main.js.map
"use strict";
var Malefiz;
(function (Malefiz) {
    let COLOR;
    (function (COLOR) {
        COLOR["RED"] = "R";
        COLOR["GREEN"] = "G";
        COLOR["BLUE"] = "B";
        COLOR["YELLOW"] = "Y";
    })(COLOR = Malefiz.COLOR || (Malefiz.COLOR = {}));
    let STAGE;
    (function (STAGE) {
        STAGE[STAGE["ROLL"] = 0] = "ROLL";
        STAGE[STAGE["PICK_TOKEN"] = 1] = "PICK_TOKEN";
        STAGE[STAGE["MOVE_TOKEN"] = 2] = "MOVE_TOKEN";
        STAGE[STAGE["MOVE_BARRIER"] = 3] = "MOVE_BARRIER";
    })(STAGE = Malefiz.STAGE || (Malefiz.STAGE = {}));
    let TYPE;
    (function (TYPE) {
        TYPE[TYPE["PLAYER_RED"] = 0] = "PLAYER_RED";
        TYPE[TYPE["PLAYER_GREEN"] = 1] = "PLAYER_GREEN";
        TYPE[TYPE["PLAYER_YELLOW"] = 2] = "PLAYER_YELLOW";
        TYPE[TYPE["PLAYER_BLUE"] = 3] = "PLAYER_BLUE";
        TYPE[TYPE["BARRIER"] = 4] = "BARRIER";
        TYPE[TYPE["WIN"] = 5] = "WIN";
    })(TYPE = Malefiz.TYPE || (Malefiz.TYPE = {}));
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class Dice extends ƒ.Node {
        constructor() {
            super("Dice");
            this.rotations = new Map([
                [1, new ƒ.Vector3(0, 0, 0)],
                [2, new ƒ.Vector3(0, 90, 0)],
                [3, new ƒ.Vector3(-90, 0, 0)],
                [4, new ƒ.Vector3(90, 0, 0)],
                [5, new ƒ.Vector3(0, -90, 0)],
                [6, new ƒ.Vector3(0, 180, 0)]
            ]);
            this.frames = 30;
            this.rotateDice = () => {
                this.diffX += this.newX / this.frames;
                this.diffY += this.newY / this.frames;
                this.mtxLocal.rotation = new ƒ.Vector3(this.oldX + this.diffX, this.oldY + this.diffY, 0);
                Malefiz.viewport.draw();
            };
            this.addComponent(new ƒ.ComponentTransform);
            this.addFaces();
            this.mtxLocal.translation = new ƒ.Vector3(-3, 1, 0);
            this.mtxLocal.scale(new ƒ.Vector3(0.8, 0.8, 0.8));
            Malefiz.viewport.getBranch().addChild(this);
        }
        addFaces() {
            let face1 = this.addFace("dice1");
            face1.mtxLocal.translateZ(0.5);
            let face2 = this.addFace("dice2");
            face2.mtxLocal.translateX(-0.5);
            face2.mtxLocal.rotateY(-90);
            let face3 = this.addFace("dice3");
            face3.mtxLocal.translateY(-0.5);
            face3.mtxLocal.rotateX(90);
            let face4 = this.addFace("dice4");
            face4.mtxLocal.translateY(0.5);
            face4.mtxLocal.rotateX(-90);
            let face5 = this.addFace("dice5");
            face5.mtxLocal.translateX(0.5);
            face5.mtxLocal.rotateY(90);
            let face6 = this.addFace("dice6");
            face6.mtxLocal.translateZ(-0.5);
            face6.mtxLocal.rotateY(180);
        }
        pickDice(_event) {
            let dicePicked = false;
            let picks = ƒ.Picker.pickViewport(Malefiz.viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
            for (let pick of picks) {
                for (let diceQuad of this.getChildren()) {
                    if (pick.node === diceQuad)
                        dicePicked = true;
                }
            }
            return dicePicked;
        }
        rollDice() {
            let value = Math.floor((Math.random() * 6) + 1);
            this.diffX = 0;
            this.diffY = 0;
            this.oldX = this.mtxLocal.rotation.x;
            this.oldY = this.mtxLocal.rotation.y;
            this.newX = this.rotations.get(value).x - this.oldX + 720;
            this.newY = this.rotations.get(value).y - this.oldY + 720;
            new ƒ.Timer(new ƒ.Time(), 30, this.frames, this.rotateDice);
            return value;
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
        constructor(_name, _position, _color, _fieldLabel) {
            super(_name);
            this.addComponent(new ƒ.ComponentMesh(new Malefiz.MeshCircle()));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("FieldMat", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("white")))));
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
            this.correspondingField = _fieldLabel;
            this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.2, 0.2));
        }
        get field() {
            return this.correspondingField;
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
/// <reference path="Definition.ts" />
var Malefiz;
/// <reference path="Definition.ts" />
(function (Malefiz) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", init);
    Malefiz.viewport = new ƒ.Viewport();
    Malefiz.graph = new Malefiz.Graph();
    Malefiz.typeToColorMap = new Map([[Malefiz.TYPE.PLAYER_BLUE, Malefiz.COLOR.BLUE], [Malefiz.TYPE.PLAYER_RED, Malefiz.COLOR.RED], [Malefiz.TYPE.PLAYER_GREEN, Malefiz.COLOR.GREEN], [Malefiz.TYPE.PLAYER_YELLOW, Malefiz.COLOR.YELLOW]]);
    let players = [];
    function init(_event) {
        const canvas = document.querySelector("canvas");
        addButtonEventListeners();
        let branch = new ƒ.Node("Branch");
        let board = new ƒ.Node("Board");
        board.addComponent(new ƒ.ComponentTransform());
        let mesh = new ƒ.MeshQuad();
        board.addComponent(new ƒ.ComponentMesh(mesh));
        let material = new ƒ.Material("BoardMat", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.8, 0.6, 0.05, 1)));
        let cmpMaterial = new ƒ.ComponentMaterial(material);
        board.addComponent(cmpMaterial);
        board.mtxLocal.scale(new ƒ.Vector3(10, 10, 0));
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(17); //17
        cmpCamera.mtxPivot.rotateY(180);
        ƒAid.addStandardLightComponents(branch, new ƒ.Color(0.8, 0.8, 0.8));
        branch.addChild(board);
        branch.addChild(new ƒ.Node("PossibleMoves"));
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
        let currentPlayerDisplay = new Malefiz.DisplayedField("PlayerDisplay", new ƒ.Vector3(3.5, 1, 0.01), players[0].getColor(), "none");
        Malefiz.viewport.getBranch().addChild(currentPlayerDisplay);
        new Malefiz.PlayerController(players);
        Malefiz.viewport.draw();
    }
    function selectRed() {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_RED);
    }
    function selectGreen() {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_GREEN);
    }
    function selectYellow() {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_YELLOW);
    }
    function selectBlue() {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_BLUE);
    }
    function handlePlayerSelection(_type) {
        let isSelected = false;
        for (let i = 0; i < players.length; i++) {
            if (players[i].color === Malefiz.typeToColorMap.get(_type)) {
                isSelected = true;
                players[i].removeTokens();
                players.splice(i, 1);
            }
        }
        if (!isSelected) {
            players.push(new Malefiz.Player(_type, Malefiz.typeToColorMap.get(_type)));
        }
        drawScene();
    }
    function drawScene() {
        Malefiz.viewport.draw();
    }
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
                vertices.push(unitX);
                vertices.push(unitY);
                vertices.push(valueZ);
                normals.push(0);
                normals.push(0);
                normals.push(valueZ);
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
var Malefiz;
(function (Malefiz) {
    class Player {
        constructor(_type, _color) {
            this.colorToCSSMap = new Map([[Malefiz.COLOR.RED, ƒ.Color.CSS("red")], [Malefiz.COLOR.GREEN, ƒ.Color.CSS("LawnGreen")], [Malefiz.COLOR.YELLOW, ƒ.Color.CSS("yellow")], [Malefiz.COLOR.BLUE, ƒ.Color.CSS("DeepSkyBlue")]]);
            this.color = _color;
            this.#tokens = new ƒ.Node("Token" + _color);
            Malefiz.viewport.getBranch().addChild(this.#tokens);
            for (let i = 1; i <= 5; i++) {
                let position = Malefiz.graph.nodes.get("S" + _color + i).position;
                let token = new Malefiz.Token(_color + i, this.colorToCSSMap.get(_color), _type, Malefiz.graph.nodes.get("S" + _color + i).label, position);
                token.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCylinder("MeshCylinder", 15)));
                this.#tokens.addChild(token);
                Malefiz.graph.nodes.get("S" + _color + i).token = token;
            }
        }
        #tokens;
        get tokens() {
            return this.#tokens;
        }
        removeTokens() {
            Malefiz.viewport.getBranch().removeChild(this.#tokens);
            // for (let token of this.#tokens.getChildren()) {
            //   viewport.getBranch().removeChild(token);
            // }
        }
        getColor() {
            return this.colorToCSSMap.get(this.color);
        }
        getName() {
            switch (this.color) {
                case Malefiz.COLOR.BLUE:
                    return "Blue";
                case Malefiz.COLOR.GREEN:
                    return "Green";
                case Malefiz.COLOR.YELLOW:
                    return "Yellow";
                case Malefiz.COLOR.RED:
                    return "Red";
            }
        }
    }
    Malefiz.Player = Player;
})(Malefiz || (Malefiz = {}));
var Malefiz;
(function (Malefiz) {
    class PlayerController {
        //private adjacentFields: Field[];
        //private possibleMoves: DisplayedField[];
        constructor(_players) {
            this.playerTypes = new Set([Malefiz.TYPE.PLAYER_RED, Malefiz.TYPE.PLAYER_GREEN, Malefiz.TYPE.PLAYER_YELLOW, Malefiz.TYPE.PLAYER_BLUE]);
            this.currentTurn = 0;
            this.currentStage = Malefiz.STAGE.ROLL;
            this.executeTurn = (_event) => {
                switch (this.currentStage) {
                    case Malefiz.STAGE.ROLL:
                        if (this.dice.pickDice(_event)) {
                            this.diceValue = this.dice.rollDice();
                            this.currentStage = Malefiz.STAGE.PICK_TOKEN;
                        }
                        break;
                    case Malefiz.STAGE.PICK_TOKEN:
                        if (this.pickToken(_event)) {
                            this.currentStage = Malefiz.STAGE.MOVE_TOKEN;
                        }
                        break;
                    case Malefiz.STAGE.MOVE_TOKEN:
                        let proceedToNextStage = this.moveToken(_event);
                        if (proceedToNextStage) {
                            if (this.moveableBarrier) {
                                this.currentStage = Malefiz.STAGE.MOVE_BARRIER;
                            }
                            else {
                                this.currentStage = Malefiz.STAGE.ROLL;
                                this.updateCurrentPlayerDisplay();
                            }
                        }
                        let pickedTokenInstead = false;
                        if (!proceedToNextStage) {
                            this.pickToken(_event);
                            pickedTokenInstead = true;
                        }
                        if (!pickedTokenInstead && !proceedToNextStage)
                            this.currentStage = Malefiz.STAGE.PICK_TOKEN;
                        break;
                    case Malefiz.STAGE.MOVE_BARRIER:
                        if (this.setBarrier()) {
                            this.currentStage = Malefiz.STAGE.ROLL;
                            Malefiz.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, false);
                            this.updateCurrentPlayerDisplay();
                        }
                        break;
                }
                Malefiz.viewport.draw();
            };
            this.moveBarrier = (_event) => {
                let ray = Malefiz.viewport.getRayFromClient(new ƒ.Vector2(_event.canvasX, _event.canvasY));
                let intersection = ray.intersectPlane(this.moveableBarrier.mtxLocal.translation, new ƒ.Vector3(0, 0, -1));
                this.moveableBarrier.mtxLocal.translation = new ƒ.Vector3(intersection.x, intersection.y, this.moveableBarrier.mtxLocal.translation.z);
                Malefiz.viewport.draw();
            };
            this.setBarrier = () => {
                let x = this.moveableBarrier.mtxLocal.translation.x;
                let y = this.moveableBarrier.mtxLocal.translation.y;
                let convertedFieldLabel = (Math.round(x * 2)).toString() + "|" + (Math.round(y * 2)).toString();
                let barrierWasSet = false;
                if (Malefiz.graph.nodes.has(convertedFieldLabel) && !(Malefiz.graph.nodes.get(convertedFieldLabel).token) && Math.round(y * 2) >= -3) {
                    Malefiz.graph.nodes.get(convertedFieldLabel).token = this.moveableBarrier;
                    this.moveableBarrier.mtxLocal.translation = (Malefiz.graph.nodes.get(convertedFieldLabel).position).toVector3();
                    this.moveableBarrier.field = Malefiz.graph.nodes.get(convertedFieldLabel).label;
                    this.moveableBarrier = null;
                    barrierWasSet = true;
                }
                return barrierWasSet;
            };
            this.players = _players;
            this.dice = new Malefiz.Dice();
            // let diceMesh: ƒ.MeshDiceCube = new ƒ.MeshDiceCube();
            // let texture: ƒ.CoatTextured = generateTextureFromId("#dice_text");
            // let dice: ƒ.Node = new ƒAid.Node("Dice", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(5, 0, 0)), new ƒ.Material("DiceMat", ƒ.ShaderTexture, texture), diceMesh);
            // dice.mtxLocal.rotateY(180);
            // dice = new Dice();
            // dice.mtxLocal.translateX(5);
            // dice.mtxLocal.rotateX(90);
            // viewport.getBranch().addChild(dice);
            Malefiz.viewport.addEventListener("\u0192pointerdown" /* DOWN */, this.executeTurn);
            Malefiz.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
            Malefiz.viewport.addEventListener("\u0192pointermove" /* MOVE */, this.moveBarrier);
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
            let adjacentFields = [];
            if (this.pickedToken) {
                this.findNodesWithDistanceToNode(Malefiz.graph.nodes.get(this.pickedToken.field), this.diceValue, adjacentFields);
            }
            for (let i = 0; i < adjacentFields.length; i++) {
                if (adjacentFields[i].token?.type === this.pickedToken.type) {
                    adjacentFields.splice(i, 1);
                    i--;
                }
            }
            this.drawPossibleMoves(adjacentFields);
            return validTokenIsPicked;
        }
        moveToken(_event) {
            let tokenIsMovable = false;
            let picks = ƒ.Picker.pickViewport(Malefiz.viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
            let selectedField;
            for (let pick of picks) {
                if (!(pick.node instanceof Malefiz.DisplayedField))
                    continue;
                for (let field of Malefiz.viewport.getBranch().getChildrenByName("PossibleMoves")[0].getChildren()) {
                    if (pick.node === field) {
                        tokenIsMovable = true;
                        selectedField = field;
                    }
                }
            }
            if (tokenIsMovable) {
                let fieldOfCorrespondingDisplayedField = Malefiz.graph.nodes.get(selectedField.field);
                if (this.playerTypes.has(fieldOfCorrespondingDisplayedField.token?.type)) {
                    for (let i = 1; i <= 5; i++) {
                        let startField = Malefiz.graph.nodes.get("S" + Malefiz.typeToColorMap.get(fieldOfCorrespondingDisplayedField.token?.type) + i);
                        if (!startField.token) {
                            startField.token = fieldOfCorrespondingDisplayedField.token;
                            fieldOfCorrespondingDisplayedField.token.mtxLocal.translation = startField.position.toVector3();
                            fieldOfCorrespondingDisplayedField.token.field = startField.label;
                            break;
                        }
                    }
                }
                else if (fieldOfCorrespondingDisplayedField.token?.type === Malefiz.TYPE.BARRIER) {
                    this.moveableBarrier = fieldOfCorrespondingDisplayedField.token;
                    Malefiz.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
                }
                if (Malefiz.graph.nodes.get(selectedField.field).token?.type === Malefiz.TYPE.WIN) {
                    let currentPlayer = this.players[this.currentTurn % this.players.length];
                    alert(currentPlayer.getName() + " won!");
                    currentPlayer.removeTokens();
                    this.players.splice(this.currentTurn % this.players.length, 1);
                }
                this.currentTurn++;
                Malefiz.graph.nodes.get(this.pickedToken.field).token = null;
                this.pickedToken.field = selectedField.field;
                Malefiz.graph.nodes.get(selectedField.field).token = this.pickedToken;
                this.pickedToken.mtxLocal.translation = selectedField.mtxLocal.translation;
            }
            Malefiz.viewport.getBranch().getChildrenByName("PossibleMoves")[0].removeAllChildren();
            return tokenIsMovable;
        }
        findNodesWithDistanceToNode(_node, _distance, adjacentFields, previousFields = []) {
            _distance--;
            previousFields.push(_node);
            if (_distance >= 0) {
                for (let edge of _node.edgesOfNode) {
                    if (edge.endNode.token?.type === Malefiz.TYPE.BARRIER && _distance != 0)
                        continue;
                    let fieldAlreadyPassed = false;
                    for (let previousField of previousFields) {
                        if (edge.endNode === previousField)
                            fieldAlreadyPassed = true;
                    }
                    if (!fieldAlreadyPassed)
                        this.findNodesWithDistanceToNode(edge.endNode, _distance, adjacentFields, previousFields);
                }
            }
            else {
                adjacentFields.push(_node);
            }
        }
        updateCurrentPlayerDisplay() {
            Malefiz.viewport.getBranch().getChildrenByName("PlayerDisplay")[0].getComponent(ƒ.ComponentMaterial).clrPrimary = this.players[this.currentTurn % this.players.length].getColor();
        }
        drawPossibleMoves(adjacentFields) {
            for (let field of adjacentFields) {
                Malefiz.viewport.getBranch().getChildrenByName("PossibleMoves")[0].addChild(new Malefiz.DisplayedField("MoveField", new ƒ.Vector3(field.position.x, field.position.y, 0.01), ƒ.Color.CSS("yellow"), field.label));
            }
        }
    }
    Malefiz.PlayerController = PlayerController;
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
            SceneBuilder.addStandardTokens();
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
        static addStandardTokens() {
            SceneBuilder.addBarrier(-8, -3);
            SceneBuilder.addBarrier(-4, -3);
            SceneBuilder.addBarrier(0, -3);
            SceneBuilder.addBarrier(4, -3);
            SceneBuilder.addBarrier(8, -3);
            SceneBuilder.addBarrier(-2, 1);
            SceneBuilder.addBarrier(2, 1);
            SceneBuilder.addBarrier(0, 3);
            SceneBuilder.addBarrier(0, 4);
            SceneBuilder.addBarrier(0, 5);
            SceneBuilder.addBarrier(0, 7);
            Malefiz.graph.nodes.get("0|8").token = new Malefiz.Token("Finish", ƒ.Color.CSS("black"), Malefiz.TYPE.WIN, "0|8", normNodePosition(new ƒ.Vector2(0, 8)));
        }
        static addBarrier(_x, _y) {
            let barrier = new Malefiz.Token("B" + _x + "|" + _y, ƒ.Color.CSS("white"), Malefiz.TYPE.BARRIER, _x + "|" + _y, normNodePosition(new ƒ.Vector2(_x, _y)));
            barrier.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCylinder("MeshCylinder", 15)));
            Malefiz.graph.nodes.get(_x + "|" + _y).token = barrier;
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
})(Malefiz || (Malefiz = {}));
//# sourceMappingURL=Main.js.map
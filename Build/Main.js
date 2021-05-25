"use strict";
var Malefiz;
(function (Malefiz) {
    class Player {
        constructor(_type, _color) {
            this.colorToCSSMap = new Map([[Malefiz.COLOR.RED, ƒ.Color.CSS("red")], [Malefiz.COLOR.GREEN, ƒ.Color.CSS("LawnGreen")], [Malefiz.COLOR.YELLOW, ƒ.Color.CSS("yellow")], [Malefiz.COLOR.BLUE, ƒ.Color.CSS("DeepSkyBlue")]]);
            this.selectedToken = null;
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
        placeSelectedTokenAtField(fieldToPlace) {
            Malefiz.graph.nodes.get(this.selectedToken.field).token = null;
            this.selectedToken.field = fieldToPlace.label;
            fieldToPlace.token = this.selectedToken;
            this.selectedToken.mtxLocal.translation = fieldToPlace.mtxLocal.translation;
        }
    }
    Malefiz.Player = Player;
})(Malefiz || (Malefiz = {}));
/// <reference path="Player.ts" />
var Malefiz;
/// <reference path="Player.ts" />
(function (Malefiz) {
    class AIPlayer extends Malefiz.Player {
        setBarrier() {
            return true;
        }
        moveToken(_event) {
            this.placeSelectedTokenAtField(this.newField);
            return Malefiz.INSTRUCTION.NEXT_TURN;
        }
        pickToken(_event, diceValue) {
            for (let token of this.tokens.getChildren()) {
                let adjacentFields = [];
                Malefiz.Graph.findNodesWithDistanceToNode(Malefiz.graph.nodes.get(token.field), diceValue, adjacentFields);
                if (adjacentFields) {
                    this.selectedToken = token;
                    this.newField = adjacentFields[0];
                }
            }
            return true;
        }
        moveBarrier(_event) { }
    }
    Malefiz.AIPlayer = AIPlayer;
})(Malefiz || (Malefiz = {}));
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
        STAGE[STAGE["SET_BARRIER"] = 3] = "SET_BARRIER";
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
    let INSTRUCTION;
    (function (INSTRUCTION) {
        INSTRUCTION[INSTRUCTION["NEXT_TURN"] = 0] = "NEXT_TURN";
        INSTRUCTION[INSTRUCTION["PICK_TOKEN"] = 1] = "PICK_TOKEN";
        INSTRUCTION[INSTRUCTION["MOVE_BARRIER"] = 2] = "MOVE_BARRIER";
        INSTRUCTION[INSTRUCTION["FINISH_GAME"] = 3] = "FINISH_GAME";
    })(INSTRUCTION = Malefiz.INSTRUCTION || (Malefiz.INSTRUCTION = {}));
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
            // roll of event has no mouseclick (and thus no event), but should also roll
            if (_event === null)
                return true;
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
            endNode.reverseEdgesOfNode.push(new Edge(startNode));
        }
        insertNode(_label, _position, _color) {
            let newNode = new Field(_label, _position, _color);
            this.nodes.set(_label, newNode);
        }
        dijkstraFrom(startNode) {
            let fields = this.initialize(startNode);
            this.nodes.get(startNode).distanceToFinal = 0;
            //Graph.sortFields(fields);
            while (fields.size != 0) {
                let startField = Graph.findNodeWithShortestDistance(fields);
                let startFieldWithDistance = fields.get(startField);
                fields.delete(startField);
                for (let edge of startField.reverseEdgesOfNode) {
                    if (fields.has(edge.endNode)) {
                        let altDistance = startFieldWithDistance.distance + 1;
                        if (altDistance < fields.get(edge.endNode).distance) {
                            fields.get(edge.endNode).distance = altDistance;
                            edge.endNode.distanceToFinal = altDistance;
                        }
                    }
                }
            }
            // for (let [field, fieldWithDistance] of fields) {
            //   field.distanceToFinal = fieldWithDistance.distance;
            // }
        }
        static findNodeWithShortestDistance(fields) {
            let shortestDistance = Number.MAX_VALUE;
            let fieldWithShortestDistance;
            for (let [field, fieldWithDistance] of fields) {
                if (shortestDistance >= fieldWithDistance.distance) {
                    shortestDistance = fieldWithDistance.distance;
                    fieldWithShortestDistance = field;
                }
            }
            return fieldWithShortestDistance;
        }
        initialize(startNode) {
            let nodesWithDistance = new Map();
            for (let [label, field] of this.nodes) {
                let fieldWithDistance = new FieldWithDistance(field);
                if (label == startNode) {
                    fieldWithDistance.distance = 0;
                }
                nodesWithDistance.set(field, fieldWithDistance);
            }
            return nodesWithDistance;
        }
        static findNodesWithDistanceToNode(_node, _distance, adjacentFields, previousFields = []) {
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
    }
    Malefiz.Graph = Graph;
    class Field extends ƒ.Node {
        constructor(_label, _position, _color) {
            super(_label);
            this.edgesOfNode = [];
            this.token = null;
            this.reverseEdgesOfNode = [];
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
    class FieldWithDistance {
        constructor(_field) {
            this.#field = _field;
            this.#distance = Number.MAX_VALUE;
            this.#predecessor = null;
        }
        #field;
        #distance;
        #predecessor;
        get field() {
            return this.#field;
        }
        get distance() {
            return this.#distance;
        }
        set distance(_distance) {
            this.#distance = _distance;
        }
        get predecessor() {
            return this.#predecessor;
        }
        set predecessor(_predecessor) {
            this.#predecessor = _predecessor;
        }
    }
})(Malefiz || (Malefiz = {}));
/// <reference path="Player.ts" />
var Malefiz;
/// <reference path="Player.ts" />
(function (Malefiz) {
    class HumanPlayer extends Malefiz.Player {
        constructor(_type, _color) {
            super(_type, _color);
            this.moveableBarrier = null;
            this.moveBarrier = (_event) => {
                let ray = Malefiz.viewport.getRayFromClient(new ƒ.Vector2(_event.canvasX, _event.canvasY));
                let intersection = ray.intersectPlane(this.moveableBarrier.mtxLocal.translation, new ƒ.Vector3(0, 0, -1));
                this.moveableBarrier.mtxLocal.translation = new ƒ.Vector3(intersection.x, intersection.y, this.moveableBarrier.mtxLocal.translation.z);
                Malefiz.viewport.draw();
            };
        }
        pickToken(_event, diceValue) {
            let validTokenIsPicked = this.pickTokenFromViewport(_event);
            if (!validTokenIsPicked)
                this.selectedToken = null;
            let adjacentFields = [];
            if (this.selectedToken) {
                Malefiz.Graph.findNodesWithDistanceToNode(Malefiz.graph.nodes.get(this.selectedToken.field), diceValue, adjacentFields);
            }
            this.removeOwnTokensFrom(adjacentFields);
            Malefiz.PlayerController.drawPossibleMoves(adjacentFields);
            return validTokenIsPicked;
        }
        setBarrier() {
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
                Malefiz.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, false);
            }
            return barrierWasSet;
        }
        moveToken(_event) {
            let nextInstruction = Malefiz.INSTRUCTION.PICK_TOKEN;
            let selectedField = this.pickDisplayedField(_event);
            if (selectedField) {
                let fieldOfCorrespondingDisplayedField = Malefiz.graph.nodes.get(selectedField.field);
                this.resetHitEnemyToken(fieldOfCorrespondingDisplayedField);
                let proceedToNextStage = true;
                if (this.prepareBarrierMove(fieldOfCorrespondingDisplayedField)) {
                    nextInstruction = Malefiz.INSTRUCTION.MOVE_BARRIER;
                    proceedToNextStage = false;
                }
                if (Malefiz.graph.nodes.get(selectedField.field).token?.type === Malefiz.TYPE.WIN) {
                    nextInstruction = Malefiz.INSTRUCTION.FINISH_GAME;
                    proceedToNextStage = false;
                }
                if (proceedToNextStage)
                    nextInstruction = Malefiz.INSTRUCTION.NEXT_TURN;
                this.placeSelectedTokenAtField(Malefiz.graph.nodes.get(selectedField.field));
            }
            Malefiz.viewport.getBranch().getChildrenByName("PossibleMoves")[0].removeAllChildren();
            return nextInstruction;
        }
        pickTokenFromViewport(_event) {
            let validTokenIsPicked = false;
            let picks = ƒ.Picker.pickViewport(Malefiz.viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
            for (let pick of picks) {
                if (!(pick.node instanceof Malefiz.Token))
                    continue;
                for (let token of this.tokens.getChildren()) {
                    if (pick.node === token) {
                        validTokenIsPicked = true;
                        this.selectedToken = token;
                    }
                }
            }
            return validTokenIsPicked;
        }
        removeOwnTokensFrom(adjacentFields) {
            for (let i = 0; i < adjacentFields.length; i++) {
                if (adjacentFields[i].token?.type === this.selectedToken.type) {
                    adjacentFields.splice(i, 1);
                    i--;
                }
            }
        }
        pickDisplayedField(_event) {
            let selectedField;
            let picks = ƒ.Picker.pickViewport(Malefiz.viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
            for (let pick of picks) {
                if (!(pick.node instanceof Malefiz.DisplayedField))
                    continue;
                for (let field of Malefiz.viewport.getBranch().getChildrenByName("PossibleMoves")[0].getChildren()) {
                    if (pick.node === field) {
                        selectedField = field;
                    }
                }
            }
            return selectedField;
        }
        resetHitEnemyToken(fieldOfCorrespondingDisplayedField) {
            if (Malefiz.PlayerController.playerTypes.has(fieldOfCorrespondingDisplayedField.token?.type)) {
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
        }
        prepareBarrierMove(selectedField) {
            if (selectedField.token?.type === Malefiz.TYPE.BARRIER) {
                this.moveableBarrier = selectedField.token;
                Malefiz.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
                return true;
            }
            return false;
        }
    }
    Malefiz.HumanPlayer = HumanPlayer;
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
    function selectRedPlayer(_event) {
        console.log(_event.target.id);
        handlePlayerSelection(Malefiz.TYPE.PLAYER_RED, true);
    }
    function selectGreenPlayer(_event) {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_GREEN, true);
    }
    function selectYellowPlayer(_event) {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_YELLOW, true);
    }
    function selectBluePlayer(_event) {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_BLUE, true);
    }
    function selectRedAI(_event) {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_RED, false);
    }
    function selectGreenAI(_event) {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_GREEN, false);
    }
    function selectYellowAI(_event) {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_YELLOW, false);
    }
    function selectBlueAI(_event) {
        handlePlayerSelection(Malefiz.TYPE.PLAYER_BLUE, false);
    }
    function deselectRed(_event) {
        handlePlayerDeselection(Malefiz.TYPE.PLAYER_RED);
    }
    function deselectGreen(_event) {
        handlePlayerDeselection(Malefiz.TYPE.PLAYER_GREEN);
    }
    function deselectYellow(_event) {
        handlePlayerDeselection(Malefiz.TYPE.PLAYER_YELLOW);
    }
    function deselectBlue(_event) {
        handlePlayerDeselection(Malefiz.TYPE.PLAYER_BLUE);
    }
    function handlePlayerDeselection(_type) {
        let selectId;
        switch (_type) {
            case Malefiz.TYPE.PLAYER_RED:
                selectId = "red";
                break;
            case Malefiz.TYPE.PLAYER_GREEN:
                selectId = "green";
                break;
            case Malefiz.TYPE.PLAYER_YELLOW:
                selectId = "yellow";
                break;
            case Malefiz.TYPE.PLAYER_BLUE:
                selectId = "blue";
                break;
        }
        for (let i = 0; i < players.length; i++) {
            if (players[i].color === Malefiz.typeToColorMap.get(_type)) {
                players[i].removeTokens();
                players.splice(i, 1);
            }
        }
        document.getElementById("deselect-" + selectId).style.display = "none";
        document.getElementById("player-" + selectId).style.display = "inline-block";
        document.getElementById("ai-" + selectId).style.display = "inline-block";
        Malefiz.viewport.draw();
    }
    function handlePlayerSelection(_type, isHuman) {
        if (isHuman) {
            players.push(new Malefiz.HumanPlayer(_type, Malefiz.typeToColorMap.get(_type)));
        }
        else {
            players.push(new Malefiz.AIPlayer(_type, Malefiz.typeToColorMap.get(_type)));
        }
        let selectId;
        switch (_type) {
            case Malefiz.TYPE.PLAYER_RED:
                selectId = "red";
                break;
            case Malefiz.TYPE.PLAYER_GREEN:
                selectId = "green";
                break;
            case Malefiz.TYPE.PLAYER_YELLOW:
                selectId = "yellow";
                break;
            case Malefiz.TYPE.PLAYER_BLUE:
                selectId = "blue";
                break;
        }
        document.getElementById("deselect-" + selectId).style.display = "inline-block";
        document.getElementById("player-" + selectId).style.display = "none";
        document.getElementById("ai-" + selectId).style.display = "none";
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
    class PlayerController {
        constructor(_players) {
            this.currentTurn = 0;
            this.currentStage = Malefiz.STAGE.ROLL;
            this.executeTurn = (_event) => {
                let currentPlayer = this.players[this.currentTurn % this.players.length];
                let switchToNextTurn = false;
                switch (this.currentStage) {
                    case Malefiz.STAGE.ROLL:
                        if (this.dice.pickDice(_event)) {
                            this.diceValue = this.dice.rollDice();
                            this.currentStage = Malefiz.STAGE.PICK_TOKEN;
                        }
                        break;
                    case Malefiz.STAGE.PICK_TOKEN:
                        if (currentPlayer.pickToken(_event, this.diceValue)) {
                            this.currentStage = Malefiz.STAGE.MOVE_TOKEN;
                        }
                        break;
                    case Malefiz.STAGE.MOVE_TOKEN:
                        let nextInstruction = currentPlayer.moveToken(_event);
                        switch (nextInstruction) {
                            case Malefiz.INSTRUCTION.MOVE_BARRIER:
                                this.currentStage = Malefiz.STAGE.SET_BARRIER;
                                break;
                            case Malefiz.INSTRUCTION.NEXT_TURN:
                                switchToNextTurn = true;
                                break;
                            case Malefiz.INSTRUCTION.PICK_TOKEN:
                                if (!currentPlayer.pickToken(_event, this.diceValue)) {
                                    this.currentStage = Malefiz.STAGE.PICK_TOKEN;
                                }
                                break;
                            case Malefiz.INSTRUCTION.FINISH_GAME:
                                alert(currentPlayer.getName() + " won!");
                                currentPlayer.removeTokens();
                                this.players.splice(this.currentTurn % this.players.length, 1);
                                switchToNextTurn = true;
                                break;
                        }
                        break;
                    case Malefiz.STAGE.SET_BARRIER:
                        if (currentPlayer.setBarrier()) {
                            switchToNextTurn = true;
                        }
                        break;
                }
                if (switchToNextTurn) {
                    this.currentStage = Malefiz.STAGE.ROLL;
                    this.currentTurn++;
                    this.updateCurrentPlayerDisplay();
                    if (this.players[this.currentTurn % this.players.length] instanceof Malefiz.AIPlayer) {
                        this.emulatePlayer();
                    }
                }
                Malefiz.viewport.draw();
            };
            this.moveBarrier = (_event) => {
                this.players[this.currentTurn % this.players.length].moveBarrier(_event);
            };
            this.players = _players;
            this.dice = new Malefiz.Dice();
            Malefiz.viewport.addEventListener("\u0192pointerdown" /* DOWN */, this.executeTurn);
            Malefiz.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
            Malefiz.viewport.addEventListener("\u0192pointermove" /* MOVE */, this.moveBarrier);
        }
        emulatePlayer() {
            let startTurn = this.currentTurn;
            while (startTurn === this.currentTurn) {
                this.executeTurn(null);
            }
        }
        updateCurrentPlayerDisplay() {
            Malefiz.viewport.getBranch().getChildrenByName("PlayerDisplay")[0].getComponent(ƒ.ComponentMaterial).clrPrimary = this.players[this.currentTurn % this.players.length].getColor();
        }
        static drawPossibleMoves(adjacentFields) {
            for (let field of adjacentFields) {
                Malefiz.viewport.getBranch().getChildrenByName("PossibleMoves")[0].addChild(new Malefiz.DisplayedField("MoveField", new ƒ.Vector3(field.position.x, field.position.y, 0.01), ƒ.Color.CSS("yellow"), field.label));
            }
        }
    }
    PlayerController.playerTypes = new Set([Malefiz.TYPE.PLAYER_RED, Malefiz.TYPE.PLAYER_GREEN, Malefiz.TYPE.PLAYER_YELLOW, Malefiz.TYPE.PLAYER_BLUE]);
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
            SceneBuilder.insertRemainingEdges();
            Malefiz.graph.dijkstraFrom("0|8");
            for (let [label, field] of Malefiz.graph.nodes) {
                console.log(label + ": " + field.distanceToFinal);
            }
            Malefiz.viewport.getBranch().addChild(fieldRoot);
            SceneBuilder.addStandardTokens();
        }
        static addNodes() {
            // first row
            for (let i = -8; i <= 8; i++) {
                Malefiz.graph.insertNode(i.toString() + "|-5", normNodePosition(new ƒ.Vector2(i, -5)), ƒ.Color.CSS("black"));
            }
            // second row (middle row)
            for (let i = -8; i <= 8; i += 4) {
                Malefiz.graph.insertNode(i.toString() + "|-4", normNodePosition(new ƒ.Vector2(i, -4)), ƒ.Color.CSS("black"));
            }
            // third row
            for (let i = -8; i <= 8; i++) {
                Malefiz.graph.insertNode(i.toString() + "|-3", normNodePosition(new ƒ.Vector2(i, -3)), ƒ.Color.CSS("black"));
            }
            // forth row (middle row)
            for (let i = -6; i <= 6; i += 4) {
                Malefiz.graph.insertNode(i.toString() + "|-2", normNodePosition(new ƒ.Vector2(i, -2)), ƒ.Color.CSS("black"));
            }
            // fifth row
            for (let i = -6; i <= 6; i++) {
                Malefiz.graph.insertNode(i.toString() + "|-1", normNodePosition(new ƒ.Vector2(i, -1)), ƒ.Color.CSS("black"));
            }
            // sixth row (middle row)
            for (let i = -4; i <= 4; i += 8) {
                Malefiz.graph.insertNode(i.toString() + "|0", normNodePosition(new ƒ.Vector2(i, 0)), ƒ.Color.CSS("black"));
            }
            // seventh row
            Malefiz.graph.insertNode("-4|0", normNodePosition(new ƒ.Vector2(-4, 0)), ƒ.Color.CSS("black"));
            Malefiz.graph.insertNode("4|0", normNodePosition(new ƒ.Vector2(4, 0)), ƒ.Color.CSS("black"));
            // eigth row
            for (let i = -4; i <= 4; i++) {
                Malefiz.graph.insertNode(i.toString() + "|1", normNodePosition(new ƒ.Vector2(i, 1)), ƒ.Color.CSS("black"));
            }
            // ninth row (middle row)
            for (let i = -2; i <= 2; i += 4) {
                Malefiz.graph.insertNode(i.toString() + "|2", normNodePosition(new ƒ.Vector2(i, 2)), ƒ.Color.CSS("black"));
            }
            // tenth row
            for (let i = -2; i <= 2; i++) {
                Malefiz.graph.insertNode(i.toString() + "|3", normNodePosition(new ƒ.Vector2(i, 3)), ƒ.Color.CSS("black"));
            }
            // eleventh row (single node)
            Malefiz.graph.insertNode("0|4", normNodePosition(new ƒ.Vector2(0, 4)), ƒ.Color.CSS("black"));
            // twelth row
            for (let i = -8; i <= 8; i++) {
                Malefiz.graph.insertNode(i.toString() + "|5", normNodePosition(new ƒ.Vector2(i, 5)), ƒ.Color.CSS("black"));
            }
            // thirteenth row
            for (let i = -8; i <= 8; i += 16) {
                Malefiz.graph.insertNode(i.toString() + "|6", normNodePosition(new ƒ.Vector2(i, 6)), ƒ.Color.CSS("black"));
            }
            // fourteenth row
            for (let i = -8; i <= 8; i++) {
                Malefiz.graph.insertNode(i.toString() + "|7", normNodePosition(new ƒ.Vector2(i, 7)), ƒ.Color.CSS("black"));
            }
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
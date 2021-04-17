namespace Malefiz {
  export class PlayerController {
    private playerTypes: Set<TYPE> = new Set([TYPE.PLAYER_RED, TYPE.PLAYER_GREEN, TYPE.PLAYER_YELLOW, TYPE.PLAYER_BLUE]); 
    private players: Player[];
    private currentTurn: number = 0;
    private currentStage: STAGE = STAGE.ROLL;
    private diceValue: number;
    private pickedToken: Token;
    private moveableBarrier: Token;
    private dice: Dice;

    constructor(_players: Player[]) {
      this.players = _players;
      this.dice = new Dice();

      viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, this.executeTurn);
      viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);

      viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, this.moveBarrier);
    }

    private executeTurn = (_event: ƒ.EventPointer): void => {
      switch (this.currentStage) {
        case STAGE.ROLL:
          if (this.dice.pickDice(_event)) {
            this.diceValue = this.dice.rollDice();
            this.currentStage = STAGE.PICK_TOKEN;  
          }
          break;
        case STAGE.PICK_TOKEN:
          if (this.pickToken(_event)) {
            this.currentStage = STAGE.MOVE_TOKEN;
          } 
          break;
        case STAGE.MOVE_TOKEN:
          let proceedToNextStage: boolean = this.moveToken(_event);
          if (proceedToNextStage) {
            if (this.moveableBarrier) {
              this.currentStage = STAGE.MOVE_BARRIER;
            }
            else {
              this.currentStage = STAGE.ROLL;
              this.updateCurrentPlayerDisplay();
            }
          }
          let pickedTokenInstead: boolean = false;
          if (!proceedToNextStage) {
            this.pickToken(_event);
            pickedTokenInstead = true;
          }
          if (!pickedTokenInstead && !proceedToNextStage)
            this.currentStage = STAGE.PICK_TOKEN;
          break;

        case STAGE.MOVE_BARRIER:
          if (this.setBarrier()) {
            this.currentStage = STAGE.ROLL;
            viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, false);
            this.updateCurrentPlayerDisplay();
          }
          break;
      }
      viewport.draw();
    }

    private pickToken(_event: ƒ.EventPointer): boolean {
      let validTokenIsPicked: boolean = false;
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
      
      for (let pick of picks) {
        if (!(pick.node instanceof Token))
          continue;
        for (let token of this.players[this.currentTurn % this.players.length].tokens.getChildren()) {
          if (pick.node === token) {
            validTokenIsPicked = true;
            this.pickedToken = <Token> token;  
          }
        }
      }
      if (!validTokenIsPicked)
        this.pickedToken = null;
  
      let adjacentFields: Field[] = []; 
      if (this.pickedToken) {
        this.findNodesWithDistanceToNode(graph.nodes.get(this.pickedToken.field), this.diceValue, adjacentFields);
      }
      for (let i: number = 0; i < adjacentFields.length; i++) {
        if (adjacentFields[i].token?.type === this.pickedToken.type) {
          adjacentFields.splice(i, 1);
          i--;
        }
      }
      this.drawPossibleMoves(adjacentFields);
      return validTokenIsPicked;
    }

    private moveToken(_event: ƒ.EventPointer): boolean {
      let tokenIsMovable: boolean = false;
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
      let selectedField: DisplayedField;
      for (let pick of picks) {
        if (!(pick.node instanceof DisplayedField)) 
          continue;
    
        for (let field of viewport.getBranch().getChildrenByName("PossibleMoves")[0].getChildren() as DisplayedField[]) {
          if (pick.node === field) {
            tokenIsMovable = true;
            selectedField = field;
          }
        }
      }
  
      if (tokenIsMovable) {
        let fieldOfCorrespondingDisplayedField: Field = graph.nodes.get(selectedField.field);
        if (this.playerTypes.has(fieldOfCorrespondingDisplayedField.token?.type)) {
          for (let i: number = 1; i <= 5; i++) {
            let startField: Field = graph.nodes.get("S" + typeToColorMap.get(fieldOfCorrespondingDisplayedField.token?.type) + i);
            if (!startField.token) {
              startField.token = fieldOfCorrespondingDisplayedField.token;
              fieldOfCorrespondingDisplayedField.token.mtxLocal.translation = startField.position.toVector3();
              fieldOfCorrespondingDisplayedField.token.field = startField.label;
              break;
            }
          }
        } else if (fieldOfCorrespondingDisplayedField.token?.type === TYPE.BARRIER) {
          this.moveableBarrier = fieldOfCorrespondingDisplayedField.token;
          viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
        }

        if (graph.nodes.get(selectedField.field).token?.type === TYPE.WIN) {
          let currentPlayer: Player = this.players[this.currentTurn % this.players.length];
          alert(currentPlayer.getName() + " won!");
          currentPlayer.removeTokens();
          this.players.splice(this.currentTurn % this.players.length, 1);
        }

        this.currentTurn++;
        graph.nodes.get(this.pickedToken.field).token = null;
        this.pickedToken.field = selectedField.field;
        graph.nodes.get(selectedField.field).token = this.pickedToken;
        this.pickedToken.mtxLocal.translation = selectedField.mtxLocal.translation;
      }  
      viewport.getBranch().getChildrenByName("PossibleMoves")[0].removeAllChildren();
      return tokenIsMovable;
    }

    private moveBarrier = (_event: ƒ.EventPointer): void => {
      let ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.canvasX, _event.canvasY));
      let intersection: ƒ.Vector3 = ray.intersectPlane(this.moveableBarrier.mtxLocal.translation, new ƒ.Vector3(0, 0, -1))
      this.moveableBarrier.mtxLocal.translation = new ƒ.Vector3(intersection.x, intersection.y, this.moveableBarrier.mtxLocal.translation.z);

      viewport.draw();
    }

    private setBarrier = (): boolean => {
      let x: number = this.moveableBarrier.mtxLocal.translation.x;
      let y: number = this.moveableBarrier.mtxLocal.translation.y;
      let convertedFieldLabel: string = (Math.round(x * 2)).toString() + "|" + (Math.round(y * 2)).toString();
      let barrierWasSet: boolean = false;
      if (graph.nodes.has(convertedFieldLabel) && !(graph.nodes.get(convertedFieldLabel).token) && Math.round(y * 2) >= -3) {
        graph.nodes.get(convertedFieldLabel).token = this.moveableBarrier;
        this.moveableBarrier.mtxLocal.translation = (graph.nodes.get(convertedFieldLabel).position).toVector3();
        this.moveableBarrier.field = graph.nodes.get(convertedFieldLabel).label;
        this.moveableBarrier = null;
        barrierWasSet = true;
      }
      return barrierWasSet;
    }

    private findNodesWithDistanceToNode(_node: Field, _distance: number, adjacentFields: Field[], previousFields: Field[] = []): void {
      _distance--;
      previousFields.push(_node);
      if (_distance >= 0) {
        for (let edge of _node.edgesOfNode) {
          if (edge.endNode.token?.type === TYPE.BARRIER && _distance != 0) 
            continue;

          let fieldAlreadyPassed: boolean = false;
          for (let previousField of previousFields) {
            if (edge.endNode === previousField) 
              fieldAlreadyPassed = true;
          }

          if (!fieldAlreadyPassed)
            this.findNodesWithDistanceToNode(edge.endNode, _distance, adjacentFields, previousFields);
        }
      } else {
        adjacentFields.push(_node);
      }
    }

    private updateCurrentPlayerDisplay(): void {
      viewport.getBranch().getChildrenByName("PlayerDisplay")[0].getComponent(ƒ.ComponentMaterial).clrPrimary = this.players[this.currentTurn % this.players.length].getColor();
    }

    private drawPossibleMoves(adjacentFields: Field[]): void {
      for (let field of adjacentFields) {
        viewport.getBranch().getChildrenByName("PossibleMoves")[0].addChild(new DisplayedField("MoveField", new ƒ.Vector3(field.position.x, field.position.y, 0.01), ƒ.Color.CSS("yellow"), field.label));
      }
    }
  }
}
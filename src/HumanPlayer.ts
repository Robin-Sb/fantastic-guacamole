/// <reference path="Player.ts" />

namespace Malefiz {
  export class HumanPlayer extends Player {
    private selectedToken: Token = null;
    private moveableBarrier: Token = null;

    constructor(_type: TYPE, _color: COLOR) {
      super(_type, _color);
    }

    public pickToken(_event: ƒ.EventPointer, diceValue: number): boolean {
      let validTokenIsPicked: boolean = this.pickTokenFromViewport(_event); 
      if (!validTokenIsPicked)
        this.selectedToken = null;
  
      let adjacentFields: Field[] = []; 
      if (this.selectedToken) {
        Graph.findNodesWithDistanceToNode(graph.nodes.get(this.selectedToken.field), diceValue, adjacentFields);
      }
      this.removeOwnTokensFrom(adjacentFields);
      PlayerController.drawPossibleMoves(adjacentFields);
      return validTokenIsPicked;
    }

    public setBarrier(): boolean {
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
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, false);
      }
      return barrierWasSet;
    }

    public moveToken(_event: ƒ.EventPointer): INSTRUCTION {
      let nextInstruction: INSTRUCTION = INSTRUCTION.PICK_TOKEN;
      let selectedField: DisplayedField = this.pickDisplayedField(_event);
  
      if (selectedField) {
        let fieldOfCorrespondingDisplayedField: Field = graph.nodes.get(selectedField.field);

        this.resetHitEnemyToken(fieldOfCorrespondingDisplayedField);
        let proceedToNextStage: boolean = true;
        if (this.prepareBarrierMove(fieldOfCorrespondingDisplayedField)) {
          nextInstruction = INSTRUCTION.MOVE_BARRIER;
          proceedToNextStage = false;
        }

        if (graph.nodes.get(selectedField.field).token?.type === TYPE.WIN) {
          nextInstruction = INSTRUCTION.FINISH_GAME;
          proceedToNextStage = false;
        } 

        if (proceedToNextStage)
          nextInstruction = INSTRUCTION.NEXT_TURN;
        this.placeSelectedTokenAtField(selectedField);
      }  

      viewport.getBranch().getChildrenByName("PossibleMoves")[0].removeAllChildren();
      return nextInstruction;
    }

    public moveBarrier = (_event: ƒ.EventPointer): void => {
      let ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.canvasX, _event.canvasY));
      let intersection: ƒ.Vector3 = ray.intersectPlane(this.moveableBarrier.mtxLocal.translation, new ƒ.Vector3(0, 0, -1))
      this.moveableBarrier.mtxLocal.translation = new ƒ.Vector3(intersection.x, intersection.y, this.moveableBarrier.mtxLocal.translation.z);

      viewport.draw();
    }

    private pickTokenFromViewport(_event: ƒ.EventPointer): boolean {
      let validTokenIsPicked: boolean = false;
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
      
      for (let pick of picks) {
        if (!(pick.node instanceof Token))
          continue;
        for (let token of this.tokens.getChildren()) {
          if (pick.node === token) {
            validTokenIsPicked = true;
            this.selectedToken = <Token> token;  
          }
        }
      }
      return validTokenIsPicked;
    }
    
    private removeOwnTokensFrom(adjacentFields: Field[]): void {
      for (let i: number = 0; i < adjacentFields.length; i++) {
        if (adjacentFields[i].token?.type === this.selectedToken.type) {
          adjacentFields.splice(i, 1);
          i--;
        }
      }
    }

    private pickDisplayedField(_event: ƒ.EventPointer): DisplayedField {
      let selectedField: DisplayedField;
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
      for (let pick of picks) {
        if (!(pick.node instanceof DisplayedField)) 
          continue;
    
        for (let field of viewport.getBranch().getChildrenByName("PossibleMoves")[0].getChildren() as DisplayedField[]) {
          if (pick.node === field) {
            selectedField = field;
          }
        }
      }
      return selectedField;
    }

    private resetHitEnemyToken(fieldOfCorrespondingDisplayedField: Field): void {
      if (PlayerController.playerTypes.has(fieldOfCorrespondingDisplayedField.token?.type)) {
        for (let i: number = 1; i <= 5; i++) {
          let startField: Field = graph.nodes.get("S" + typeToColorMap.get(fieldOfCorrespondingDisplayedField.token?.type) + i);
          if (!startField.token) {
            startField.token = fieldOfCorrespondingDisplayedField.token;
            fieldOfCorrespondingDisplayedField.token.mtxLocal.translation = startField.position.toVector3();
            fieldOfCorrespondingDisplayedField.token.field = startField.label;
            break;
          }
        }
      }
    }
   
    private placeSelectedTokenAtField(fieldToPlace: DisplayedField) {
      graph.nodes.get(this.selectedToken.field).token = null;
      this.selectedToken.field = fieldToPlace.field;
      graph.nodes.get(fieldToPlace.field).token = this.selectedToken;
      this.selectedToken.mtxLocal.translation = fieldToPlace.mtxLocal.translation;
    }

    private prepareBarrierMove(selectedField: Field): boolean {
      if (selectedField.token?.type === TYPE.BARRIER) {
        this.moveableBarrier = selectedField.token;
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
        return true;
      }
      return false;
    }
  }
}
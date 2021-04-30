/// <reference path="Player.ts" />

namespace Malefiz {
  export class AIPlayer extends Player {
    private newField: Field;

    public setBarrier(): boolean {
      
      return true;
    }
    
    public moveToken(_event: ƒ.EventPointer): INSTRUCTION {
      this.placeSelectedTokenAtField(this.newField);
      return INSTRUCTION.NEXT_TURN;
    }

    public pickToken(_event: ƒ.EventPointer, diceValue: number): boolean {
      for (let token of this.tokens.getChildren() as Token[]) {
        let adjacentFields: Field[] = [];
        Graph.findNodesWithDistanceToNode(graph.nodes.get(token.field), diceValue, adjacentFields)
        if (adjacentFields) {
          this.selectedToken = token;
          this.newField = adjacentFields[0];
        }
      }
      return true;
    }

    public moveBarrier(_event: ƒ.EventPointer): void {}
  }
}
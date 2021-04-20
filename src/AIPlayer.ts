/// <reference path="Player.ts" />

namespace Malefiz {
  export class AIPlayer extends Player {
    public pickToken(_event: ƒ.EventPointer, diceValue: number): boolean {
      return true;
    }

    public setBarrier(): boolean {
      throw new Error("Method not implemented.");
    }
    
    public moveToken(_event: ƒ.EventPointer): INSTRUCTION {
      return INSTRUCTION.NEXT_TURN;
    }

    public moveBarrier(_event: ƒ.EventPointer): void {

    }
  }
}
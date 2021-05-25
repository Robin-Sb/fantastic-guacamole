namespace Malefiz {
  export class PlayerController {
    public static playerTypes: Set<TYPE> = new Set([TYPE.PLAYER_RED, TYPE.PLAYER_GREEN, TYPE.PLAYER_YELLOW, TYPE.PLAYER_BLUE]); 
    private players: Player[];
    private currentTurn: number = 0;
    private currentStage: STAGE = STAGE.ROLL;
    private diceValue: number;
    private dice: Dice;

    constructor(_players: Player[]) {
      this.players = _players;
      this.dice = new Dice();

      viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, this.executeTurn);
      viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);

      viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, this.moveBarrier);
    }

    private executeTurn = (_event: ƒ.EventPointer): void => {
      let currentPlayer: Player = this.players[this.currentTurn % this.players.length];
      let switchToNextTurn: boolean = false;
      switch (this.currentStage) {
        case STAGE.ROLL:
          if (this.dice.pickDice(_event)) {
            this.diceValue = this.dice.rollDice();
            this.currentStage = STAGE.PICK_TOKEN;  
          }
          break;
        case STAGE.PICK_TOKEN:
          if (currentPlayer.pickToken(_event, this.diceValue)) {
            this.currentStage = STAGE.MOVE_TOKEN;
          } 
          break;
        case STAGE.MOVE_TOKEN:
          let nextInstruction: INSTRUCTION = currentPlayer.moveToken(_event);
          switch (nextInstruction) {
            case INSTRUCTION.MOVE_BARRIER:
              this.currentStage = STAGE.SET_BARRIER;
              break;
            case INSTRUCTION.NEXT_TURN:
              switchToNextTurn = true;
              break;
            case INSTRUCTION.PICK_TOKEN:
              if (!currentPlayer.pickToken(_event, this.diceValue)) {
                this.currentStage = STAGE.PICK_TOKEN;
              }
              break;
            case INSTRUCTION.FINISH_GAME: 
              alert(currentPlayer.getName() + " won!");
              currentPlayer.removeTokens();
              this.players.splice(this.currentTurn % this.players.length, 1);
              switchToNextTurn = true;
              break;
            }
          break;

        case STAGE.SET_BARRIER:
          if (currentPlayer.setBarrier()) {
            switchToNextTurn = true;
          }
          break;
      }

      if (switchToNextTurn) {
        this.currentStage = STAGE.ROLL;
        this.currentTurn++;
        this.updateCurrentPlayerDisplay();
        if (this.players[this.currentTurn % this.players.length] instanceof AIPlayer) {
          this.emulatePlayer()
        }
      }
      viewport.draw();
    }

    private emulatePlayer(): void {
      let startTurn = this.currentTurn;

      while(startTurn === this.currentTurn) {
        this.executeTurn(null);
      }
    }

    private moveBarrier = (_event: ƒ.EventPointer): void => {
      this.players[this.currentTurn % this.players.length].moveBarrier(_event);
    }


    private updateCurrentPlayerDisplay(): void {
      viewport.getBranch().getChildrenByName("PlayerDisplay")[0].getComponent(ƒ.ComponentMaterial).clrPrimary = this.players[this.currentTurn % this.players.length].getColor();
    }

    public static drawPossibleMoves(adjacentFields: Field[]): void {
      for (let field of adjacentFields) {
        viewport.getBranch().getChildrenByName("PossibleMoves")[0].addChild(new DisplayedField("MoveField", new ƒ.Vector3(field.position.x, field.position.y, 0.01), ƒ.Color.CSS("yellow"), field.label));
      }
    }
  }
}
namespace Malefiz {
  export class PlayerController {
    private players: Player[];
    private currentTurn: number;
    private currentStage: STAGE;
    private diceValue: number;
    private pickedToken: Token;
    private adjacentFields: Field[];

    constructor(_players: Player[]) {
      this.players = _players;

      viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, this.executeTurn);
      viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
    }

    private executeTurn(_event: ƒ.EventPointer): void {
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

    private roll(): void {
      this.diceValue = Math.floor((Math.random() * 6) + 1);
    }

    private pickToken(_event: ƒ.EventPointer): void {
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
  
      // adjacentFields is global because we need it in the next event listener too
      this.adjacentFields = []; 
      if (this.pickedToken) {
        this.findNodesWithDistanceToNode(graph.nodes.get(this.pickedToken.field), this.diceValue);
      }
      this.drawPossibleMoves(this.adjacentFields);
    }

    private moveToken(_event: ƒ.EventPointer): void {
      let tokenIsMovable: boolean = false;
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
      let selectedField: Field;
      for (let pick of picks) {
        if (!(pick.node instanceof Field)) 
          continue;
    
        for (let field of this.adjacentFields) {
          if (<Field> pick.node === field) {
            tokenIsMovable = true;
            selectedField = field;
          }
        }
      }
  
      if (tokenIsMovable) {
        this.currentTurn++;
        graph.nodes.get(this.pickedToken.field).token = null;
        this.pickedToken.field = selectedField.label;
        this.pickedToken.mtxLocal.translation = selectedField.position.toVector3();
        viewport.removeEventListener(ƒ.EVENT_POINTER.DOWN, this.moveToken);
      }  
      viewport.draw();
    }

    private findNodesWithDistanceToNode(_node: Field, _distance: number): void {
      _distance--;
      if (_distance >= 0) {
        for (let edge of _node.edgesOfNode) {
          for (let i: number = 0; i < edge.endNode.edgesOfNode.length; i++) {
            if (edge.endNode.edgesOfNode[i].endNode === _node) {
              edge.endNode.edgesOfNode.splice(i, 1);
            }  
          }
          this.findNodesWithDistanceToNode(edge.endNode, _distance);
        }
      } else {
        this.adjacentFields.push(_node);
      }
    }

    private drawPossibleMoves(adjacentFields: Field[]): void {
      let ctx: CanvasRenderingContext2D = viewport.getCanvas().getContext("2d");
      for (let field of adjacentFields) {
        let position: ƒ.Vector2 = viewport.pointWorldToClient(field.position.toVector3());
        ctx.beginPath();
        let radius: number = ƒ.Vector2.DIFFERENCE(position, viewport.pointWorldToClient(ƒ.Vector2.SUM(field.position, new ƒ.Vector2(0.2, 0)).toVector3())).magnitude;
        ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
      }
    }
  }


  enum STAGE {
    ROLL,
    PICK_TOKEN,
    MOVE_TOKEN
  }
}
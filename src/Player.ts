namespace Malefiz {
  export class Player {
    #tokens: ƒ.Node;
    public color: Color;
    public colorToCSSMap: Map<Color, ƒ.Color> = new Map([[Color.RED, ƒ.Color.CSS("red")], [Color.GREEN, ƒ.Color.CSS("LawnGreen")], [Color.YELLOW, ƒ.Color.CSS("yellow")], [Color.BLUE, ƒ.Color.CSS("DeepSkyBlue")]]);

    constructor(_type: Color) {
      this.color = _type;
      this.#tokens = new ƒ.Node("Token" + _type);
      viewport.getBranch().addChild(this.#tokens);
      for (let i: number = 1; i <= 5; i++) {
        let position: ƒ.Vector2 = graph.nodes.get("S" + _type + i).position;
        let token: Token = new Token(_type + i, this.colorToCSSMap.get(_type), TYPE.PLAYER, graph.nodes.get("S" + _type + i).label, position);
        token.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCylinder("MeshCylinder")));
        this.#tokens.addChild(token);
        graph.nodes.get("S" + _type + i).token = token;
      }
    }

    public get tokens() {
      return this.#tokens;
    }

    public removeTokens(): void {
      for (let token of this.#tokens.getChildren()) {
        viewport.getBranch().removeChild(token);
      }
    }
  }

  export enum Color {
    RED = "R",
    GREEN = "G",
    BLUE = "B",
    YELLOW = "Y"
  }
}
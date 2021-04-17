namespace Malefiz {
  export class Player {
    #tokens: ƒ.Node;
    public color: COLOR;
    public colorToCSSMap: Map<COLOR, ƒ.Color> = new Map([[COLOR.RED, ƒ.Color.CSS("red")], [COLOR.GREEN, ƒ.Color.CSS("LawnGreen")], [COLOR.YELLOW, ƒ.Color.CSS("yellow")], [COLOR.BLUE, ƒ.Color.CSS("DeepSkyBlue")]]);

    constructor(_type: TYPE, _color: COLOR) {
      this.color = _color;
      this.#tokens = new ƒ.Node("Token" + _color);
      viewport.getBranch().addChild(this.#tokens);
      for (let i: number = 1; i <= 5; i++) {
        let position: ƒ.Vector2 = graph.nodes.get("S" + _color + i).position;
        let token: Token = new Token(_color + i, this.colorToCSSMap.get(_color), _type, graph.nodes.get("S" + _color + i).label, position);
        token.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCylinder("MeshCylinder", 15)));
        this.#tokens.addChild(token);
        graph.nodes.get("S" + _color + i).token = token;
      }
    }

    public get tokens() {
      return this.#tokens;
    }

    public removeTokens(): void {
      viewport.getBranch().removeChild(this.#tokens);
    }

    public getColor(): ƒ.Color {
      return this.colorToCSSMap.get(this.color);
    }
    
    public getName(): string {
      switch(this.color) {
        case COLOR.BLUE:
          return "Blue";
        case COLOR.GREEN:
          return "Green";
        case COLOR.YELLOW:
          return "Yellow";
        case COLOR.RED:
          return "Red";
      }
    }
  }
}
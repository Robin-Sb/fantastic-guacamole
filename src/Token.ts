namespace Malefiz {
  export class Token extends ƒ.Node {
    // maybe move this
    public field: string;
    public color: ƒ.Color;
    public type: TYPE;
    public readonly diameter: number = 0.15;

    constructor(_name: string, _color: ƒ.Color, _type: TYPE, _field: string, _position: ƒ.Vector2) {
      super(_name);
      this.type = _type
      this.color = _color;
      this.field = _field;
      this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("TokenMat" + _type, ƒ.ShaderFlat, new ƒ.CoatColored(_color))));
      this.addComponent(new ƒ.ComponentTransform());
      this.mtxLocal.translate(new ƒ.Vector3(_position.x, _position.y, 0));
      this.mtxLocal.scale(new ƒ.Vector3(this.diameter, this.diameter, 0.3));
      viewport.getBranch().addChild(this);
    }
  }

  export enum TYPE {
    PLAYER,
    BARRIER,
    WIN
  }
}
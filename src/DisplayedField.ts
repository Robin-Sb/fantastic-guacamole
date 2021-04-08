namespace Malefiz {
  export class DisplayedField  extends ƒ.Node {
    constructor (_name: string, _position: ƒ.Vector3, _color: ƒ.Color) {
      super(_name);
      this.addComponent(new ƒ.ComponentMesh(new MeshCircle()));
      this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("FieldMat", ƒ.ShaderFlat, new ƒ.CoatColored(_color))));
      this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
      this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.2, 0.2));
    }
  }
}
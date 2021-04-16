namespace Malefiz {
  export class DisplayedField  extends ƒ.Node {
    private correspondingField: string;
    constructor (_name: string, _position: ƒ.Vector3, _color: ƒ.Color, _fieldLabel: string) {
      super(_name);
      this.addComponent(new ƒ.ComponentMesh(new MeshCircle()));
      this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("FieldMat", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("white")))));
      this.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
      this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position)));
      this.correspondingField = _fieldLabel;
      this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.2, 0.2));
    }

    public get field() {
      return this.correspondingField;
    }
  }
}
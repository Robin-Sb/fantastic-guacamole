namespace Malefiz {
  export class Dice extends ƒ.Node {
    constructor() {
      super("Dice");
      this.addComponent(new ƒ.ComponentTransform);
      this.addFaces();
    }

    private addFaces(): void {
      let face1: ƒ.Node = this.addFace("dice1");
      face1.mtxLocal.translateZ(0.5);
      let face2: ƒ.Node = this.addFace("dice2");
      face2.mtxLocal.rotateY(90);
      face2.mtxLocal.translateX(0.5);
      let face3: ƒ.Node = this.addFace("dice3");
      face3.mtxLocal.translateZ(-0.5);
      let face4: ƒ.Node = this.addFace("dice4");
      face4.mtxLocal.rotateY(-90);
      face4.mtxLocal.translateX(-0.5);
      let face5: ƒ.Node = this.addFace("dice5");
      face5.mtxLocal.translateZ(0.5);
      face5.mtxLocal.rotateX(-90);
      let face6: ƒ.Node = this.addFace("dice6");
      face6.mtxLocal.rotateX(90);
      face6.mtxLocal.translateX(0.5);
    }

    private addFace(id: string): ƒ.Node {
      let face: ƒ.Node = new ƒ.Node(id);
      face.addComponent(new ƒ.ComponentTransform);
      face.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad));
      face.addComponent(new ƒ.ComponentMaterial(new ƒ.Material(id + "Mat", ƒ.ShaderTexture, this.generateTextureFromId(id))));
      this.addChild(face);
      return face;
    }

    private  generateTextureFromId(textureId: string): ƒ.CoatTextured {
      let id: string = "#" + textureId;
      let coatTextured: ƒ.CoatTextured = new ƒ.CoatTextured(); 
      let img: HTMLImageElement = document.querySelector(id);
      let textureImage: ƒ.TextureImage = new ƒ.TextureImage();
      textureImage.image = img;
      coatTextured.texture = textureImage;
      return coatTextured;
    }
  

  }
}
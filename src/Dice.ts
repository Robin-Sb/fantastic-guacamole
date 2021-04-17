namespace Malefiz {
  export class Dice extends ƒ.Node {
    private rotations: Map<number, ƒ.Vector3> = new Map([
      [1, new ƒ.Vector3(0, 0, 0)],
      [2, new ƒ.Vector3(0, 90, 0)],
      [3, new ƒ.Vector3(-90, 0, 0)],
      [4, new ƒ.Vector3(90, 0, 0)],
      [5, new ƒ.Vector3(0, -90, 0)],
      [6, new ƒ.Vector3(0, 180, 0)]
    ]);

    private xDiff: number;
    private yDiff: number;
    private oldX: number;
    private oldY: number;
    private newX: number;
    private newY: number;
    private frames: number = 30;


    constructor() {
      super("Dice");
      this.addComponent(new ƒ.ComponentTransform);
      this.addFaces();
      this.mtxLocal.translation = new ƒ.Vector3(-3, 1, 0);
      this.mtxLocal.scale(new ƒ.Vector3(0.8, 0.8, 0.8));
      viewport.getBranch().addChild(this);
    }

    private addFaces(): void {
      let face1: ƒ.Node = this.addFace("dice1");
      face1.mtxLocal.translateZ(0.5);
      let face2: ƒ.Node = this.addFace("dice2");
      face2.mtxLocal.translateX(-0.5);
      face2.mtxLocal.rotateY(-90);
      let face3: ƒ.Node = this.addFace("dice3");
      face3.mtxLocal.translateY(-0.5);
      face3.mtxLocal.rotateX(90);
      let face4: ƒ.Node = this.addFace("dice4");
      face4.mtxLocal.translateY(0.5);
      face4.mtxLocal.rotateX(-90);
      let face5: ƒ.Node = this.addFace("dice5");
      face5.mtxLocal.translateX(0.5);
      face5.mtxLocal.rotateY(90);
      let face6: ƒ.Node = this.addFace("dice6");
      face6.mtxLocal.translateZ(-0.5);
      face6.mtxLocal.rotateY(180);
    }

    public pickDice(_event: ƒ.EventPointer): boolean {
      let dicePicked: boolean = false;
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.canvasX, _event.canvasY));
      for (let pick of picks) {
        for (let diceQuad of this.getChildren()) {
          if (pick.node === diceQuad) 
            dicePicked = true;
        }
      }
      return dicePicked;
    }

    public rollDice(): number {
      let value: number = Math.floor((Math.random() * 6) + 1);
      let xSign: boolean = Math.round(Math.random()) === 1 ? true : false; 
      let ySign: boolean = Math.round(Math.random()) === 1 ? true : false; 
      this.xDiff = 0; // Math.round(this.rotations.get(value).x - this.mtxLocal.rotation.x) // + 1080 : this.mtxLocal.rotation.x - this.rotations.get(value).x - 1080;
      this.yDiff = 0; // Math.round(this.rotations.get(value).y - this.mtxLocal.rotation.y)  //-  + 1080 : this.mtxLocal.rotation.y - this.rotations.get(value).y - 1080;
      this.oldX = this.mtxLocal.rotation.x;
      this.oldY = this.mtxLocal.rotation.y;
      this.newX = this.rotations.get(value).x - this.oldX + 720;
      this.newY = this.rotations.get(value).y - this.oldY + 720;
      new ƒ.Timer(new ƒ.Time(), 30, this.frames, this.rotateDice);
      //this.mtxLocal.rotation = this.rotations.get(value);
      return value;
    }

    private rotateDice = (): void => {
      // this.mtxLocal.rotateX(this.xDiff / 30);
      // this.mtxLocal.rotateY(this.yDiff / 30);
      this.xDiff += this.newX / this.frames;
      this.yDiff += this.newY / this.frames;
      this.mtxLocal.rotation = new ƒ.Vector3(this.oldX + this.xDiff, this.oldY + this.yDiff, 0);
      viewport.draw();
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
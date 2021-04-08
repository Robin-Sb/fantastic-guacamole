namespace Malefiz {
  export class Graph {
    public nodes: Map<string, Field> = new Map();

    public insertEdge(_start: string, _end: string) {
      let startNode: Field =  this.nodes.get(_start);
      let endNode: Field =  this.nodes.get(_end);
      startNode.edgesOfNode.push(new Edge(endNode));
      endNode.edgesOfNode.push(new Edge(startNode));
    }

    public insertSingleEdge(_start: string, _end: string) {
      let startNode: Field =  this.nodes.get(_start);
      let endNode: Field =  this.nodes.get(_end);
      startNode.edgesOfNode.push(new Edge(endNode));
    }

    public insertNode(_label: string, _position: ƒ.Vector2, _color: ƒ.Color) {
      let newNode: Field = new Field(_label, _position, _color);
      this.nodes.set(_label, newNode);
    }
  }

  export class Field extends ƒ.Node {
    public position: ƒ.Vector2;
    public edgesOfNode: Edge[] = [];
    public label: string;
    public token: Token = null;
    public color: ƒ.Color;

    constructor(_label: string, _position: ƒ.Vector2, _color: ƒ.Color) {
      super(_label);
      this.addComponent(new ƒ.ComponentMesh(new MeshCircle()));
      this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("FieldMat", ƒ.ShaderFlat, new ƒ.CoatColored(_color))));
      this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3())));
      this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.2, 0.2));

      this.label = _label;
      this.position = _position;
      this.color = _color;
    }
  }

  class Edge {
    #endNode: Field;
    constructor(_endNode: Field) {
      this.#endNode = _endNode;
    }
    public get endNode() {
      return this.#endNode;
    }
  }
}
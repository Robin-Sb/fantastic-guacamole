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
      endNode.reverseEdgesOfNode.push(new Edge(startNode));
    }

    public insertNode(_label: string, _position: ƒ.Vector2, _color: ƒ.Color) {
      let newNode: Field = new Field(_label, _position, _color);
      this.nodes.set(_label, newNode);
    }

    public dijkstraFrom(startNode: string) {
      let fields: Map<Field, FieldWithDistance> = this.initialize(startNode);
      this.nodes.get(startNode).distanceToFinal = 0;
      //Graph.sortFields(fields);
      while  (fields.size != 0) {
        let startField: Field = Graph.findNodeWithShortestDistance(fields);
        let startFieldWithDistance: FieldWithDistance = fields.get(startField);
        fields.delete(startField);
        for (let edge of startField.reverseEdgesOfNode) {
          if (fields.has(edge.endNode)) {
            let altDistance: number = startFieldWithDistance.distance + 1;
            if (altDistance < fields.get(edge.endNode).distance) {
              fields.get(edge.endNode).distance = altDistance;
              edge.endNode.distanceToFinal = altDistance;
            }
          }
        }
      }

      // for (let [field, fieldWithDistance] of fields) {
      //   field.distanceToFinal = fieldWithDistance.distance;
      // }
    }

    private static findNodeWithShortestDistance(fields: Map<Field, FieldWithDistance>): Field {
      let shortestDistance: number = Number.MAX_VALUE;
      let fieldWithShortestDistance: Field;
      for (let [field, fieldWithDistance] of fields) {
        if (shortestDistance >= fieldWithDistance.distance) {
          shortestDistance = fieldWithDistance.distance;
          fieldWithShortestDistance = field;
        }
      }
      return fieldWithShortestDistance;
    }

    public initialize(startNode: string): Map<Field, FieldWithDistance> {
      let nodesWithDistance: Map<Field, FieldWithDistance> = new Map();
      for (let [label, field] of this.nodes) {
        let fieldWithDistance: FieldWithDistance = new FieldWithDistance(field);
        if (label == startNode) {
          fieldWithDistance.distance = 0;
        }
        nodesWithDistance.set(field, fieldWithDistance);
      }
      return nodesWithDistance;
    }


    public static findNodesWithDistanceToNode(_node: Field, _distance: number, adjacentFields: Field[], previousFields: Field[] = []): void {
      _distance--;
      previousFields.push(_node);
      if (_distance >= 0) {
        for (let edge of _node.edgesOfNode) {
          if (edge.endNode.token?.type === TYPE.BARRIER && _distance != 0) 
            continue;

          let fieldAlreadyPassed: boolean = false;
          for (let previousField of previousFields) {
            if (edge.endNode === previousField) 
              fieldAlreadyPassed = true;
          }

          if (!fieldAlreadyPassed)
            this.findNodesWithDistanceToNode(edge.endNode, _distance, adjacentFields, previousFields);
        }
      } else {
        adjacentFields.push(_node);
      }
    }
  }

  export class Field extends ƒ.Node {
    public position: ƒ.Vector2;
    public edgesOfNode: Edge[] = [];
    public label: string;
    public token: Token = null;
    public color: ƒ.Color;
    public distanceToFinal: number;
    public reverseEdgesOfNode: Edge[] = [];

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

  class FieldWithDistance {
    #field: Field;
    #distance: number;
    #predecessor: Field;

    constructor(_field: Field) {
      this.#field = _field;
      this.#distance = Number.MAX_VALUE;
      this.#predecessor = null;
    }

    public get field() {
      return this.#field;
    }
    public get distance() {
      return this.#distance;
    }

    public set distance(_distance: number) {
      this.#distance = _distance;
    }

    public get predecessor() {
      return this.#predecessor;
    }

    public set predecessor(_predecessor: Field) {
      this.#predecessor = _predecessor;
    }

  }
}
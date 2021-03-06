namespace Malefiz {
  export class SceneBuilder {
    public static buildScene(): void {
      SceneBuilder.addNodes();
      let fieldRoot: ƒ.Node = new ƒ.Node("FieldRoot");
      for (let [label, field] of graph.nodes) {
        fieldRoot.addChild(field);
        SceneBuilder.insertEdges(field);
      }
      SceneBuilder.insertRemainingEdges();
      graph.dijkstraFrom("0|8");
      for (let [label, field] of graph.nodes) {
        console.log(label + ": " + field.distanceToFinal);
      }
      viewport.getBranch().addChild(fieldRoot);
      SceneBuilder.addStandardTokens();
    }

    private static addNodes(): void {
      // first row
      for (let i: number = -8; i <= 8; i++) {
        graph.insertNode(i.toString() + "|-5", normNodePosition(new ƒ.Vector2(i, -5)), ƒ.Color.CSS("black"));
      }  

      // second row (middle row)
      for (let i: number = -8; i <= 8; i +=4) {
        graph.insertNode(i.toString() + "|-4", normNodePosition(new ƒ.Vector2(i, -4)), ƒ.Color.CSS("black"));
      }
  
      // third row
      for (let i: number = -8; i <= 8; i++) {
        graph.insertNode(i.toString() + "|-3", normNodePosition(new ƒ.Vector2(i, -3)), ƒ.Color.CSS("black"));
      }
  
      // forth row (middle row)
      for (let i: number = -6; i <= 6; i +=4) {
        graph.insertNode(i.toString() + "|-2", normNodePosition(new ƒ.Vector2(i, -2)), ƒ.Color.CSS("black"));
      }

      // fifth row
      for (let i: number = -6; i <= 6; i++) {
        graph.insertNode(i.toString() + "|-1", normNodePosition(new ƒ.Vector2(i, -1)), ƒ.Color.CSS("black"));
      }

      // sixth row (middle row)
      for (let i: number = -4; i <= 4; i += 8) {
        graph.insertNode(i.toString() + "|0", normNodePosition(new ƒ.Vector2(i, 0)), ƒ.Color.CSS("black"));
      }

      // seventh row
      graph.insertNode("-4|0", normNodePosition(new ƒ.Vector2(-4, 0)), ƒ.Color.CSS("black"));
      graph.insertNode( "4|0", normNodePosition(new ƒ.Vector2( 4, 0)), ƒ.Color.CSS("black"));
      
      // eigth row
      for (let i: number = -4; i <= 4; i++) {
        graph.insertNode(i.toString() + "|1", normNodePosition(new ƒ.Vector2(i, 1)), ƒ.Color.CSS("black"));
      }

      // ninth row (middle row)
      for (let i: number = -2; i <= 2; i += 4) {
        graph.insertNode(i.toString() + "|2", normNodePosition(new ƒ.Vector2(i, 2)), ƒ.Color.CSS("black"));
      }

      // tenth row
      for (let i: number = -2; i <= 2; i++) {
        graph.insertNode(i.toString() + "|3", normNodePosition(new ƒ.Vector2(i, 3)), ƒ.Color.CSS("black"));
      }

      // eleventh row (single node)
      graph.insertNode("0|4", normNodePosition(new ƒ.Vector2(0, 4)), ƒ.Color.CSS("black"));
      
      // twelth row
      for (let i: number = -8; i <= 8; i++) {
        graph.insertNode(i.toString() + "|5", normNodePosition(new ƒ.Vector2(i, 5)), ƒ.Color.CSS("black"));
      }
      
      // thirteenth row
      for (let i: number = -8; i <= 8; i += 16) {
        graph.insertNode(i.toString() + "|6", normNodePosition(new ƒ.Vector2(i, 6)), ƒ.Color.CSS("black"));
      }

      // fourteenth row
      for (let i: number = -8; i <= 8; i++) {
        graph.insertNode(i.toString() + "|7", normNodePosition(new ƒ.Vector2(i, 7)), ƒ.Color.CSS("black"));
      }

      // top, finish line
      graph.insertNode("0|8", normNodePosition(new ƒ.Vector2(0, 8)), ƒ.Color.CSS("black"));
  
      graph.insertNode("SR1", normNodePosition(new ƒ.Vector2(-6.5, -6)), ƒ.Color.CSS("DarkRed"));
      graph.insertNode("SR2", normNodePosition(new ƒ.Vector2(-5.5, -6)), ƒ.Color.CSS("DarkRed"));
      graph.insertNode("SR3", normNodePosition(new ƒ.Vector2(-7 ,  -7)), ƒ.Color.CSS("DarkRed"));
      graph.insertNode("SR4", normNodePosition(new ƒ.Vector2(-6 ,  -7)), ƒ.Color.CSS("DarkRed"));
      graph.insertNode("SR5", normNodePosition(new ƒ.Vector2(-5 ,  -7)), ƒ.Color.CSS("DarkRed"));
  
      graph.insertNode("SG1", normNodePosition(new ƒ.Vector2(-2.5, -6)), ƒ.Color.CSS("DarkGreen"));
      graph.insertNode("SG2", normNodePosition(new ƒ.Vector2(-1.5, -6)), ƒ.Color.CSS("DarkGreen"));
      graph.insertNode("SG3", normNodePosition(new ƒ.Vector2(-3,   -7)), ƒ.Color.CSS("DarkGreen"));
      graph.insertNode("SG4", normNodePosition(new ƒ.Vector2(-2,   -7)), ƒ.Color.CSS("DarkGreen"));
      graph.insertNode("SG5", normNodePosition(new ƒ.Vector2(-1,   -7)), ƒ.Color.CSS("DarkGreen"));
  
      graph.insertNode("SY1", normNodePosition(new ƒ.Vector2(1.5, -6)), new ƒ.Color(0.6, 0.6, 0.1));
      graph.insertNode("SY2", normNodePosition(new ƒ.Vector2(2.5, -6)), new ƒ.Color(0.6, 0.6, 0.1));
      graph.insertNode("SY3", normNodePosition(new ƒ.Vector2(1,   -7)), new ƒ.Color(0.6, 0.6, 0.1));
      graph.insertNode("SY4", normNodePosition(new ƒ.Vector2(2,   -7)), new ƒ.Color(0.6, 0.6, 0.1));
      graph.insertNode("SY5", normNodePosition(new ƒ.Vector2(3,   -7)), new ƒ.Color(0.6, 0.6, 0.1));
  
      graph.insertNode("SB1", normNodePosition(new ƒ.Vector2(5.5, -6)), ƒ.Color.CSS("DarkBlue"));
      graph.insertNode("SB2", normNodePosition(new ƒ.Vector2(6.5, -6)), ƒ.Color.CSS("DarkBlue"));
      graph.insertNode("SB3", normNodePosition(new ƒ.Vector2(5,   -7)), ƒ.Color.CSS("DarkBlue"));
      graph.insertNode("SB4", normNodePosition(new ƒ.Vector2(6,   -7)), ƒ.Color.CSS("DarkBlue"));
      graph.insertNode("SB5", normNodePosition(new ƒ.Vector2(7,   -7)), ƒ.Color.CSS("DarkBlue"));
    }

    private static insertEdges(_field: Field): void {
      let xDigit: number = _field.position.x * 2;
      let yDigit: number = _field.position.y * 2;
  
      if (graph.nodes.has(xDigit.toString() + "|" + (yDigit + 1).toString())) {
        graph.insertSingleEdge(_field.label, xDigit.toString() + "|" + (yDigit + 1).toString());
      }
  
      if (graph.nodes.has((xDigit + 1).toString() + "|" + yDigit.toString())) {
        graph.insertSingleEdge(_field.label, (xDigit + 1).toString() + "|" + yDigit.toString());
      }
      if (graph.nodes.has((xDigit - 1).toString() + "|" + yDigit.toString())) {
        graph.insertSingleEdge(_field.label, (xDigit - 1).toString() + "|" + yDigit.toString());
      }
  
      if (graph.nodes.has(xDigit.toString() + "|" + (yDigit - 1).toString())) {
        graph.insertSingleEdge(_field.label, xDigit.toString() + "|" + (yDigit - 1).toString());
      }
    }

    private static insertRemainingEdges(): void {
      let colorStrings: Map<string, string> = new Map([["R", "-6|-5"], ["G", "-2|-5"], ["Y", "2|-5"], ["B", "6|-5"]]);
  
      for (let [color, startNode] of colorStrings) {
        for (let i: number = 1; i <= 5; i++) {
          graph.insertSingleEdge("S" + color + i.toString(), startNode);
        } 
      }
    }

    private static addStandardTokens(): void {
      SceneBuilder.addBarrier(-8, -3);
      SceneBuilder.addBarrier(-4, -3);
      SceneBuilder.addBarrier( 0, -3);
      SceneBuilder.addBarrier( 4, -3);
      SceneBuilder.addBarrier( 8, -3);
      SceneBuilder.addBarrier(-2,  1);
      SceneBuilder.addBarrier( 2,  1);
      SceneBuilder.addBarrier( 0,  3);
      SceneBuilder.addBarrier( 0,  4);
      SceneBuilder.addBarrier( 0,  5);
      SceneBuilder.addBarrier( 0,  7);

      graph.nodes.get("0|8").token = new Token("Finish", ƒ.Color.CSS("black"), TYPE.WIN, "0|8", normNodePosition(new ƒ.Vector2(0, 8)));
    }
    
    private static addBarrier(_x: number, _y: number): void {
      let barrier: Token = new Token("B" + _x + "|" + _y, ƒ.Color.CSS("white"), TYPE.BARRIER, _x + "|" + _y, normNodePosition(new ƒ.Vector2(_x, _y)));
      barrier.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCylinder("MeshCylinder", 15)));
      graph.nodes.get(_x + "|" + _y).token = barrier;
    }
  }

  function normNodePosition(_position: ƒ.Vector2): ƒ.Vector2 {
    _position.x /= 2;
    _position.y /= 2;
    return _position
  } 
}
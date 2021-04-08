namespace Malefiz {
  export class MeshCircle extends ƒ.Mesh {
    public constructor(_name: string = "MeshCircle", _sections: number = 15) {
      super(_name);
      this.create(_sections);
    }
    private sections: number;

    private create(_sections: number) {
      this.sections = Math.min(_sections, 128);

      let vertices: Array<number> = [];
      let normals: Array<number> = [];
      let texCoords: Array<number> = [];
      let unitVertices: Array<number> = this.getUnitVertices();

      let valueZ: number = 1;

      // center point
      vertices.push(0); vertices.push(0); vertices.push(valueZ);
      normals.push(0); normals.push(0); normals.push(valueZ);
      texCoords.push(0.5); texCoords.push(0.5); 

      for (let j: number = 0, k: number = 0; j < this.sections; j++, k += 3) {
        let unitX: number = unitVertices[k];
        let unitY: number = unitVertices[k + 1];
       
        // vertex bottom/top with x, y, z
        vertices.push(unitX);
        vertices.push(unitY);
        vertices.push(valueZ);

        //normals bottom/top with x, y, z
        normals.push(0);
        normals.push(0);
        normals.push(valueZ);

        // texCoords bottom/top with u, v
        texCoords.push(-unitX * 0.5 + 0.5);
        texCoords.push(-unitY * 0.5 + 0.5);
      }

      this.ƒvertices = new Float32Array(vertices);
      this.ƒtextureUVs = new Float32Array(texCoords);
      this.ƒnormalsFace = new Float32Array(normals);
      this.ƒindices = this.createIndices();
      this.createRenderBuffers();
    }


    private getUnitVertices(): Array<number> {
      let delta: number = (2 * Math.PI) / this.sections;
      let angle: number;

      let unitVertices: Array<number> = [];

      for (let i: number = 0; i < this.sections; i++) {
        angle = delta * i;
        unitVertices.push(Math.cos(angle));
        unitVertices.push(Math.sin(angle));
        unitVertices.push(0);
      }
      return unitVertices;
    }

    protected createIndices(): Uint16Array {
      let baseCenterIndex: number = 0;
      let indices: Array<number> = [];

      // starting index for bottom/top vertices
      let k: number = baseCenterIndex + 1;

      for (let i: number = 0; i < this.sections; i++, k++) {
        if (i < this.sections - 1) {
          // bottom indices right -> center -> left
          indices.push(baseCenterIndex);
          indices.push(k);
          indices.push(k + 1);
        } else { 
          // loops back for the last index
          indices.push(baseCenterIndex);
          indices.push(k);
          indices.push(baseCenterIndex + 1);
        }
      }
      return new Uint16Array(indices);
    }
  }
}
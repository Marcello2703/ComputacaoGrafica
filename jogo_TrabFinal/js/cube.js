// Criação da geometria do cubo
export function createCube(gl) {
  const positions = new Float32Array([
    // Front
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
    // Back
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
    // Top
    -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
    // Bottom
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,
    // Right
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
    // Left
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
  ]);

  const normals = new Float32Array([
    // Front
    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
    // Back
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
    // Top
    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
    // Bottom
    0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
    // Right
    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
    // Left
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0
  ]);

  const texcoords = new Float32Array([
    // Front
    0, 1,  1, 1,  1, 0,  0, 0,
    // Back
    1, 1,  1, 0,  0, 0,  0, 1,
    // Top
    0, 1,  0, 0,  1, 0,  1, 1,
    // Bottom
    0, 0,  1, 0,  1, 1,  0, 1,
    // Right
    1, 1,  0, 1,  0, 0,  1, 0,
    // Left
    0, 1,  1, 1,  1, 0,  0, 0
  ]);

  const indices = new Uint16Array([
    0,  1,  2,    0,  2,  3,  // Front
    4,  5,  6,    4,  6,  7,  // Back
    8,  9,  10,   8,  10, 11, // Top
    12, 13, 14,   12, 14, 15, // Bottom
    16, 17, 18,   16, 18, 19, // Right
    20, 21, 22,   20, 22, 23  // Left
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    normal: normalBuffer,
    texcoord: texcoordBuffer,
    indices: indexBuffer,
    count: indices.length
  };
}
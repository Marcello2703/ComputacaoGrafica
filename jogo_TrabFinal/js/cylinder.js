// cylinder.js
export function createCylinder(gl, segments = 20, radius = 0.2, height = 0.1) {
  const positions = [];
  const normals = [];
  const indices = [];
  const texcoords = [];

  // Criando os vértices do corpo do cilindro
  for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      positions.push(x, -height / 2, z);
      positions.push(x, height / 2, z);
      normals.push(x, 0, z);
      normals.push(x, 0, z);
      texcoords.push(i / segments, 1);
      texcoords.push(i / segments, 0);
  }

  // Criando os índices do corpo
  for (let i = 0; i < segments; i++) {
      const base = i * 2;
      indices.push(base, base + 1, base + 3);
      indices.push(base, base + 3, base + 2);
  }

  // Criando tampas superior e inferior
  const topCenter = positions.length / 3;
  const bottomCenter = topCenter + 1;
  positions.push(0, height / 2, 0); // Centro do topo
  positions.push(0, -height / 2, 0); // Centro do fundo
  normals.push(0, 1, 0, 0, -1, 0);
  texcoords.push(0.5, 0.5, 0.5, 0.5);
  
  for (let i = 0; i < segments; i++) {
      const base = i * 2;
      const next = ((i + 1) % segments) * 2;
      
      // Topo
      indices.push(topCenter, base + 1, next + 1);
      
      // Fundo
      indices.push(bottomCenter, next, base);
  }

  // Criando buffers WebGL
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  return {
      position: positionBuffer,
      normal: normalBuffer,
      texcoord: texcoordBuffer,
      indices: indexBuffer,
      count: indices.length
  };
  }
  
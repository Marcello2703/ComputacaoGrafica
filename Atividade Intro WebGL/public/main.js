const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl){
    throw new Error('WebGl not supported');
}

// criar vertex shader
// criar fragment shader
// criar program
// anexar shaders no program
// vertexData = [...]
// criar buffer
// carregar vertexData no buffer
// habilitar atributos do vertex shader
// desenhar

// Shaders GLSL
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    gl_FragColor = u_color;
  }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

//Atributos e variáveis de configuração
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const colorUniformLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//Função para desenhar um círculo
function drawCircle(x, y, radius, color) {
  const positions = [];
  const segments = 100;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    positions.push(x + Math.cos(angle) * radius);
    positions.push(y + Math.sin(angle) * radius);
  }

  console.log("Posição de cada ponto que irá compor o circulo: " + positions.toString());

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], color[3]);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 2);
}

//Função para desenhar um retângulo
function drawRectangle(x, y, width, height, color) {
  const x1 = x - width / 2;
  const x2 = x + width / 2;
  const y1 = y - height / 2;
  const y2 = y + height / 2;

  const positions = [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], color[3]);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

//Função para desenhar todos os objetos
function render() {
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Desenhar o carro
  drawRectangle(-0.5, -0.3, 0.7, 0.5, [0.2, 0.2, 0.8, 1]); // Corpo do carro
  drawCircle(-0.7, -0.55, 0.1, [0, 0, 0, 1]);               // Roda esquerda
  drawCircle(-0.3, -0.55, 0.1, [0, 0, 0, 1]);               // Roda direita

  // Desenhar palhaço
  const headX = 0.5;
  const headY = 0.1;
  const hairRadius = 0.1 * 0.7;
  console.log("Hair radius: " + hairRadius.toString());
  for(let i = 0; i < 8; i++){       //Cabelo
    const angle = (i/8) * Math.PI; //Meia circunferencia (parte de cima da cabeça do palhaço)
    const x = headX + Math.cos(angle) * hairRadius;
    const y = headY + Math.sin(angle) * hairRadius;
    console.log("X: " + x.toString() + "\nY: " + y.toString());
    drawCircle(x, y, hairRadius, [1, 0, 0, 1]);
  }
  drawCircle(headX, headY, 0.1, [1, 0.8, 0.6, 1]);             // Cabeça
  drawRectangle(0.5, -0.15, 0.15, 0.35, [0.5, 0, 0.5, 1]);    // Corpo
  drawCircle(0.5, 0.08, 0.02, [1, 0, 0, 1]);               // Nariz vermelho

  // Desenhar a flor
  const numPetals = 10;
  const petalRadius = 0.05;
  const centerX = -0.5;
  const centerY = 0.5;
  const petalColor = [1, 0.5, 0, 1];

  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * petalRadius * 3;
    const y = centerY + Math.sin(angle) * petalRadius * 3;
    drawCircle(x, y, petalRadius, petalColor);             // Pétalas
  }
  drawCircle(centerX, centerY, petalRadius + 0.08, [1, 1, 0, 1]); // Centro da flor
}

render();


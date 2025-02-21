import { mat4 } from "./math.js";
import { createShaderProgram } from "./glUtils.js";
import { createCube } from "./cube.js";
import { createRoadTexture, createSkyTexture } from "./textures.js";
import { state, updateCamera, drawCar, render, initControls } from "./game.js";
import { createCylinder } from "./cylinder.js";

// Obtém o canvas e cria o contexto WebGL
const canvas = document.getElementById('game');
const gl = canvas.getContext('webgl');
if (!gl) {
  alert('WebGL not supported');
  throw new Error('WebGL not supported');
}

let gameStarted = false;


function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

// Obtém os códigos dos shaders do HTML
const vertexShaderSource = document.getElementById('vertex-shader').textContent;
const fragmentShaderSource = document.getElementById('fragment-shader').textContent;

// Cria e utiliza o programa de shaders
const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

const attributes = {
  position: gl.getAttribLocation(program, 'position'),
  normal: gl.getAttribLocation(program, 'normal'),
  texcoord: gl.getAttribLocation(program, 'texcoord')
};

const uniforms = {
  modelViewMatrix: gl.getUniformLocation(program, 'modelViewMatrix'),
  projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),
  normalMatrix: gl.getUniformLocation(program, 'normalMatrix'),
  color: gl.getUniformLocation(program, 'color'),
  lightDir1: gl.getUniformLocation(program, 'lightDir1'),
  lightDir2: gl.getUniformLocation(program, 'lightDir2'),
  lightColor1: gl.getUniformLocation(program, 'lightColor1'),
  lightColor2: gl.getUniformLocation(program, 'lightColor2'),
  texture: gl.getUniformLocation(program, 'texture'),
  useTexture: gl.getUniformLocation(program, 'useTexture')
};

console.log("vai começar, criando geometrias");

const cube = createCube(gl);
const cylinder = createCylinder(gl, 20, 0.2, 0.1);
const roadTexture = createRoadTexture(gl);
const skyTexture = createSkyTexture(gl);
const projectionMatrix = new Float32Array(16);
const viewMatrix = new Float32Array(16);
const modelMatrix = new Float32Array(16);
const modelViewMatrix = new Float32Array(16);
const normalMatrix = new Float32Array(16);

mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);

initControls(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix);

// Inicia o jogo
function startGame() {
  document.getElementById('startScreen').remove();
  gameStarted = true;
  render(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, 
         projectionMatrix, viewMatrix, modelViewMatrix);
}

// Adicione o event listener para qualquer tecla:
document.addEventListener('keydown', function initialKeyHandler(e) {
  if (!gameStarted) {
    startGame();
    document.removeEventListener('keydown', initialKeyHandler);
  }
});

// Mantenha o resize inicial
resize();
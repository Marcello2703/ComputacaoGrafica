import { mat4 } from "./math.js";

export const state = {
  car: { x: 0, z: 0 },
  // Definindo dois modos de câmera
  camera: {
    mode: 'chase', // modo inicial: "chase" (atrás do carro)
    chase: {
      distance: 5,
      height: 2,
      lookAhead: 8
    },
    // Modo "overhead" ajustado para ficar um pouco mais perto e garantir que o carro permaneça na visão
    overhead: {
      distance: 8,
      height: 8,
      lookAhead: 3
    }
  },
  obstacles: [
    { x: Math.random() * 4 - 2, z: -15 },
    { x: Math.random() * 4 - 2, z: -25 },
    { x: Math.random() * 4 - 2, z: -35 }
  ],
  score: 0,
  gameOver: false,
  paused: false
};

export function updateCamera(viewMatrix) {
  // Seleciona os parâmetros de câmera conforme o modo atual
  const cam = state.camera.mode === "overhead" ? state.camera.overhead : state.camera.chase;
  const eye = [state.car.x, cam.height, state.car.z + cam.distance];
  const center = [state.car.x, 0, state.car.z - cam.lookAhead];
  const up = [0, 1, 0];
  mat4.lookAt(viewMatrix, eye, center, up);
}

export function drawCar(gl, cube, cylinder, viewMatrix, modelViewMatrix, uniforms, x, z, isPlayer) {
  const color = isPlayer ? [0.2, 0.2, 0.8] : [0.8, 0.1, 0.1];
  const roofColor = isPlayer ? [0.3, 0.3, 0.9] : [0.9, 0.2, 0.2];
  const modelMatrix = new Float32Array(16);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.position);
  gl.vertexAttribPointer(uniforms.position, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.normal);
  gl.vertexAttribPointer(uniforms.normal, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cube.texcoord);
  gl.vertexAttribPointer(uniforms.texcoord, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indices);

  console.log("oi");

  // Corpo do carro
  mat4.identity(modelMatrix);
  modelMatrix[12] = x;
  modelMatrix[13] = 0;
  modelMatrix[14] = z;
  modelMatrix[0] = 0.8;
  modelMatrix[5] = 0.3;
  modelMatrix[10] = 1.2;
  mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  gl.uniformMatrix4fv(uniforms.modelViewMatrix, false, modelViewMatrix);
  gl.uniform3fv(uniforms.color, new Float32Array(color));
  gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);

  console.log("oi 2");

  // Teto do carro
  mat4.identity(modelMatrix);
  modelMatrix[12] = x;
  modelMatrix[13] = 0.3;
  modelMatrix[14] = z - 0.1;
  modelMatrix[0] = 0.6;
  modelMatrix[5] = 0.25;
  modelMatrix[10] = 0.6;
  mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  gl.uniformMatrix4fv(uniforms.modelViewMatrix, false, modelViewMatrix);
  gl.uniform3fv(uniforms.color, new Float32Array(roofColor));
  gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);

  // Rodas
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.position);
  gl.vertexAttribPointer(uniforms.position, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.normal);
  gl.vertexAttribPointer(uniforms.normal, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinder.texcoord);
  gl.vertexAttribPointer(uniforms.texcoord, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinder.indices);
  
  const wheelPositions = [
    { x: -0.4, z: 0.4 },
    { x: 0.4, z: 0.4 },
    { x: -0.4, z: -0.4 },
    { x: 0.4, z: -0.4 }
  ];

  console.log("oi 3");
  wheelPositions.forEach(pos => {
    mat4.identity(modelMatrix);
    modelMatrix[12] = x + pos.x;
    modelMatrix[13] = -0.15;
    modelMatrix[14] = z + pos.z;

    const rotationMatrix = new Float32Array(16);
    mat4.identity(rotationMatrix);
    rotationMatrix[0] = 0;
    rotationMatrix[2] = 1;
    rotationMatrix[8] = -1;
    rotationMatrix[10] = 0;

    modelMatrix[0] = 0.4; // Radius
    modelMatrix[5] = 0.4; // Height
    modelMatrix[10] = 0.4; 

    mat4.multiply(modelMatrix, modelMatrix, rotationMatrix);
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(uniforms.modelViewMatrix, false, modelViewMatrix);
    gl.uniform3fv(uniforms.color, new Float32Array([0.1, 0.1, 0.1]));
    gl.drawElements(gl.TRIANGLES, cylinder.count, gl.UNSIGNED_SHORT, 0);
  });
  
  console.log("oi 4");
  // drawBumper(gl, cube, viewMatrix, modelViewMatrix, uniforms, x, -0.2, z + 0.6, 0.8, 0.1, 0.1, modelMatrix); 
  // drawBumper(gl, cube, viewMatrix, modelViewMatrix, uniforms, x, -0.2, z - 0.6, 0.8, 0.1, 0.1, modelMatrix); 
}

export function drawBumper(gl, cube, viewMatrix, modelViewMatrix, uniforms, x, y, z, width, height, depth, modelMatrix){
  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix, modelMatrix, [x, y, z]);
  mat4.scale(modelMatrix, modelMatrix, [width, height, depth]);
  mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  gl.uniformMatrix4fv(uniforms.modelViewMatrix, false, modelViewMatrix);
  gl.uniform3fv(uniforms.color, new Float32Array([0.5, 0.5, 0.5])); // Bumper color
  gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);
}

export function render(
  gl,
  program,
  attributes,
  uniforms,
  cube,
  cylinder,
  roadTexture,
  skyTexture,
  projectionMatrix,
  viewMatrix,
  modelViewMatrix
) {
  // Se o jogo estiver pausado, agenda o próximo frame sem atualizar a lógica
  if (state.paused) {
    requestAnimationFrame(() => {
      render(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix);
    });
    return;
  }
  if (state.gameOver) return;

  // Cria uma variável local para modelMatrix
  const modelMatrix = new Float32Array(16);

  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);

  updateCamera(viewMatrix);

  // Configura as luzes
  gl.uniform3fv(uniforms.lightDir1, new Float32Array([1, 1, 0.5]));
  gl.uniform3fv(uniforms.lightColor1, new Float32Array([1.0, 0.95, 0.8]));
  gl.uniform3fv(uniforms.lightDir2, new Float32Array([-0.5, 0.2, -0.2]));
  gl.uniform3fv(uniforms.lightColor2, new Float32Array([0.6, 0.7, 1.0]));

  mat4.identity(modelMatrix);
  modelMatrix[0] = 80;
  modelMatrix[5] = 40;
  modelMatrix[10] = 1;
  modelMatrix[14] = -40;
  modelMatrix[13] = 0;
  mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  gl.uniformMatrix4fv(uniforms.modelViewMatrix, false, modelViewMatrix);
  gl.uniformMatrix4fv(uniforms.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(uniforms.normalMatrix, false, modelViewMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, skyTexture);
  gl.uniform1i(uniforms.texture, 0);
  gl.uniform1i(uniforms.useTexture, true);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.position);
  gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attributes.position);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.normal);
  gl.vertexAttribPointer(attributes.normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attributes.normal);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.texcoord);
  gl.vertexAttribPointer(attributes.texcoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attributes.texcoord);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indices);
  gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);

  // Atualiza estado do jogo (movimenta obstáculos, pontuação, colisões)
  state.obstacles.forEach((obstacle) => {
    obstacle.z += 0.2;
    if (obstacle.z > 5) {
      obstacle.z = -35;
      obstacle.x = Math.random() * 4 - 2;
      state.score += 10;
      document.getElementById('score').innerText = `Score: ${state.score}`;
    }
    const dx = state.car.x - obstacle.x;
    const dz = state.car.z - obstacle.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < 1.0) {
      state.gameOver = true;
      gameOver(gl, program, attributes, uniforms, cube, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix);
    }
  });

  // Desenha a estrada com textura
  mat4.identity(modelMatrix);
  modelMatrix[13] = -0.5;
  modelMatrix[0] = 6;
  modelMatrix[5] = 0.1;
  modelMatrix[10] = 80;
  mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
  gl.uniformMatrix4fv(uniforms.modelViewMatrix, false, modelViewMatrix);
  gl.uniformMatrix4fv(uniforms.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(uniforms.normalMatrix, false, modelViewMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, roadTexture);
  gl.uniform1i(uniforms.texture, 0);
  gl.uniform1i(uniforms.useTexture, true);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.position);
  gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attributes.position);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.normal);
  gl.vertexAttribPointer(attributes.normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attributes.normal);

  gl.bindBuffer(gl.ARRAY_BUFFER, cube.texcoord);
  gl.vertexAttribPointer(attributes.texcoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attributes.texcoord);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indices);
  gl.drawElements(gl.TRIANGLES, cube.count, gl.UNSIGNED_SHORT, 0);

  // Desabilita textura para os carros
  gl.uniform1i(uniforms.useTexture, false);

  // Desenha o carro do jogador e os obstáculos
  drawCar(gl, cube, cylinder, viewMatrix, modelViewMatrix, uniforms, state.car.x, state.car.z, true);
  state.obstacles.forEach(obstacle => {
    drawCar(gl, cube, cylinder, viewMatrix, modelViewMatrix, uniforms, obstacle.x, obstacle.z, false);
  });

  state.textureOffset = 0; // Adicionar isso no objeto state


  requestAnimationFrame(() => {
    render(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix);
  });
}

export function initControls(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix) {
  window.addEventListener('keydown', (event) => {
    // Reiniciar o jogo ao pressionar "R"
    if (state.gameOver && event.key.toLowerCase() === 'r') {
      restartGame(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix);
      return;
    }

    // Pausar o jogo ao pressionar "Space"
    if (event.code === "Space") {
      state.paused = !state.paused;
      if (state.paused) {
        const pauseDiv = document.createElement('div');
        pauseDiv.id = 'pauseMessage';
        pauseDiv.style.position = 'absolute';
        pauseDiv.style.top = '50%';
        pauseDiv.style.left = '50%';
        pauseDiv.style.transform = 'translate(-50%, -50%)';
        pauseDiv.style.color = 'white';
        pauseDiv.style.fontSize = '48px';
        pauseDiv.style.fontFamily = 'Arial, sans-serif';
        pauseDiv.style.textAlign = 'center';
        pauseDiv.innerText = 'Paused';
        document.body.appendChild(pauseDiv);
      } else {
        const pauseDiv = document.getElementById('pauseMessage');
        if (pauseDiv) pauseDiv.remove();
      }
      return;
    }

    // Alternar câmeras
    if (event.key === "1") {
      state.camera.mode = "chase";
    } else if (event.key === "2") {
      state.camera.mode = "overhead";
    }

    // Controles do carro
    if (state.gameOver) return;
    switch (event.key) {
      case 'ArrowLeft':
        state.car.x -= 0.3;
        state.car.x = Math.max(state.car.x, -2);
        break;
      case 'ArrowRight':
        state.car.x += 0.3;
        state.car.x = Math.min(state.car.x, 2);
        break;
    }
  });
}

export function gameOver(gl, program, attributes, uniforms, cube, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix) {
  const gameOverDiv = document.createElement("div");
  gameOverDiv.id = "gameOverDiv";
  gameOverDiv.style.position = "absolute";
  gameOverDiv.style.top = "50%";
  gameOverDiv.style.left = "50%";
  gameOverDiv.style.transform = "translate(-50%, -50%)";
  gameOverDiv.style.color = "white";
  gameOverDiv.style.fontSize = "48px";
  gameOverDiv.style.fontFamily = "Arial, sans-serif";
  gameOverDiv.style.textAlign = "center";
  gameOverDiv.innerHTML = `Game Over!<br>Score: ${state.score}<br>Press R to Restart`; // Remova o botão
  
  document.body.appendChild(gameOverDiv);
}

export function restartGame(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix) {
  state.car.x = 0;
  state.car.z = 0;
  state.obstacles = [
    { x: Math.random() * 4 - 2, z: -15 },
    { x: Math.random() * 4 - 2, z: -25 },
    { x: Math.random() * 4 - 2, z: -35 }
  ];
  state.score = 0; // Zera o score
  state.gameOver = false;
  document.getElementById('score').innerText = `Score: ${state.score}`; // Atualiza a interface

  // Remove a tela de Game Over se existir
  const gameOverDiv = document.getElementById("gameOverDiv");
  if (gameOverDiv) {
    gameOverDiv.remove();
  }

  // Reinicia a renderização
  render(gl, program, attributes, uniforms, cube, cylinder, roadTexture, skyTexture, projectionMatrix, viewMatrix, modelViewMatrix);
}


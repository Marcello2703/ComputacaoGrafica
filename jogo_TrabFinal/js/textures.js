// Função genérica para carregar texturas a partir de imagens
export function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Textura temporária enquanto a imagem carrega
  const placeholder = new Uint8Array([255, 255, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    // Se a textura for NPOT, precisamos definir CLAMP_TO_EDGE e remover mipmap
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
  

  image.src = url;

  return texture;
}

// Criar textura para a estrada usando "road.jpg"
export function createRoadTexture(gl) {
  return loadTexture(gl, './textures/road2.jpg');
}

// Criar textura para o céu usando "horizon.jpg"
export function createSkyTexture(gl) {
  return loadTexture(gl, './textures/horizon.jpg');
}

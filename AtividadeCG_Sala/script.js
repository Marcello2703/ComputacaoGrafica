const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

const vertexShaderSource = `
attribute vec2 aPosition;
uniform mat3 uTransform;
void main() {
    vec3 transformedPosition = uTransform * vec3(aPosition, 1.0);
    gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 uColor;
void main() {
    gl_FragColor = uColor;
}`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
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
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
const uTransformLoc = gl.getUniformLocation(program, 'uTransform');
const uColorLoc = gl.getUniformLocation(program, 'uColor');

const vertices = new Float32Array([
    -0.5, -0.5,
     0.5, -0.5,
     0.5,  0.5,
    -0.5, -0.5,
     0.5,  0.5,
    -0.5,  0.5
]);

// Create buffer and upload vertices
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Enable scissor test
gl.enable(gl.SCISSOR_TEST);

// Animation variables
let angle = 0;

// Render loop
function render() {
    //gl.clear(gl.COLOR_BUFFER_BIT);
    angle += 0.01;
    //4 quadrantes pra cada quadrado renderizado
    for (let i = 0; i < 4; i++) {
        //viewport e recorte pra cada quadrante
        const x = (i % 2) * canvas.width / 2;
        const y = Math.floor(i / 2) * canvas.height / 2;
        gl.viewport(x, y, canvas.width / 2, canvas.height / 2);

        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(x + 10, y + 10, canvas.width / 2 - 20, canvas.height / 2 - 20);

        gl.useProgram(program);

        let transform;
        if (i === 0) {
            //Move left and right
            const dx = Math.sin(angle) * 0.5; // Horizontal oscillation
            transform = new Float32Array([
                1, 0, 0,
                0, 1, 0,
                dx, 0, 1
            ]);
        } else if (i === 1) {
            //Move up and down with compression
            const dy = Math.sin(angle) * 0.5;
            const compression = Math.abs(Math.sin(angle)) * 0.5 + 0.5; 
            transform = new Float32Array([
                1,            0,             0,
                0, compression,             0,
                0,            dy,            1
            ]);
        } else if (i === 2) {
            //Zoom in and out
            const scale = Math.sin(angle) * 0.5 + 1; 
            transform = new Float32Array([
                scale, 0,     0,
                0,     scale, 0,
                0,     0,     1
            ]);
        } else if (i === 3) {
            //Rotate
            transform = new Float32Array([
                Math.cos(angle), -Math.sin(angle), 0,
                Math.sin(angle),  Math.cos(angle), 0,
                0,                0,               1
            ]);
        }

        gl.uniformMatrix3fv(uTransformLoc, false, transform);
        gl.uniform4f(uColorLoc, (i & 1) * 0.5, ((i >> 1) & 1) * 0.5, 1.0, 1.0);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.enableVertexAttribArray(aPositionLoc);
        gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        gl.disable(gl.SCISSOR_TEST);
    }

    requestAnimationFrame(render);
}

gl.clearColor(0, 0, 0, 1);
render();
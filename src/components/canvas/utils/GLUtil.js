
export function setVec2Uniform(gl, program, uniformName, value) {
    const uniformLocation = gl.getUniformLocation(program, uniformName);
    gl.uniform2fv(uniformLocation, value);
}

export function setFloatUniform(gl, program, uniformName, value) {
    const uniformLocation = gl.getUniformLocation(program, uniformName);
    gl.uniform1f(uniformLocation, value);
}

export function clearGlScene(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function bindAttributeData(gl, location, data, size, type = gl.FLOAT, dynamic = true) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    gl.vertexAttribPointer(location, size, type, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

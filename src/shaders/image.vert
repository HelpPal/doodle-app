
precision mediump float;

uniform vec2 resolution;
uniform float rotation; // In radians
uniform vec2 center;

attribute vec2 position;

mat2 createRotationMatrix(float rad) {
	return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
}

// Scale from canvas coordinates [(0, 0), (width, height)] to (-1, 1)
vec2 toVertexShaderCoords(vec2 v) {
	return ((v / resolution) - 0.5) * vec2(2.0, -2.0);
}

void main() {
	mat2 rotationMatrix = createRotationMatrix(-rotation);
	vec2 currentScreenPosition = toVertexShaderCoords(center + rotationMatrix * (position - center));
	gl_Position = vec4(currentScreenPosition, 0.0, 1.0);
}

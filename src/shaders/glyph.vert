
precision mediump float;

uniform vec2 resolution;

attribute vec2 position;
attribute vec2 center;
attribute float rotation; // In radians

mat2 createRotationMatrix(float rad) {
	return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
}

vec2 toScreenCoords(vec2 v) {
	return ((v / resolution) - 0.5) * vec2(2.0, -2.0);
}

void main() {
	mat2 rotationMatrix = createRotationMatrix(-rotation);
	vec2 currentScreenPosition = toScreenCoords(center + rotationMatrix * (position - center));
	gl_Position = vec4(currentScreenPosition, 0.0, 1.0);
}

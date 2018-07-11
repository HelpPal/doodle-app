
precision mediump float;

uniform vec2 resolution;
uniform vec2 origin;
uniform vec2 scale;
uniform float strokeWidth;
uniform vec2 beginVertex;
uniform vec2 endVertex;

attribute vec2 position;
attribute float direction;
attribute vec2 next;
attribute vec2 previous;
attribute vec2 center;
attribute float rotation; // In radians

varying vec2 currentVertex;
varying vec2 start;
varying vec2 mid;
varying vec2 end;

mat2 createRotationMatrix(float rad) {
	return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
}

mat2 createScaleMatrix(vec2 s) {
	return mat2(s.x, 0, 0, s.y);
}

// Scale from canvas coordinates [(0, 0), (width, height)] to (-1, 1)
vec2 toVertexShaderCoords(vec2 v) {
	return ((v / resolution) - 0.5) * vec2(2.0, -2.0);
}

void main() {

	start = previous / resolution;
	mid =  position / resolution;
	end = next / resolution;

	mat2 rotationMatrix = createRotationMatrix(-rotation);
	mat2 scaleMatrix = createScaleMatrix(scale);
	vec2 scaledPosition = origin + scaleMatrix * (position - origin);
	vec2 currentScreenPosition = toVertexShaderCoords(center + rotationMatrix * (scaledPosition - center));
	vec2 nextScreenPosition = toVertexShaderCoords(center + rotationMatrix * (next - center));
	vec2 previousScreenPosition = toVertexShaderCoords(center + rotationMatrix * (previous - center));

	currentVertex = center + rotationMatrix * (scaledPosition - center);

	vec2 dir = vec2(0.0);
	float aspect = resolution.x / resolution.y;
	float hypoteneuse = distance(vec2(0, 0), resolution);
	float len = strokeWidth / (hypoteneuse * 0.5);

	// See:
	// -- https://mattdesl.svbtle.com/drawing-lines-is-hard
	// -- https://github.com/mattdesl/webgl-lines/blob/master/projected/vert.glsl

	dir = normalize(nextScreenPosition - previousScreenPosition);
	vec2 normal = vec2(-dir.y, dir.x);
	normal *= len;
	normal.x /= aspect;
	vec2 offset = normal * sign(direction);

	// If we are drawing an line cap, push the vertex out by `len` so that
	// there is room for the rounded corner.
	vec2 lineCapOffset = vec2(0.0);
	if (position == endVertex) {
		lineCapOffset = dir * len;
	}
	if (position == beginVertex) {
		lineCapOffset = dir * len * -1.0;
	}

	vec2 offsetScreenPosition = currentScreenPosition + offset + lineCapOffset;
	gl_Position = vec4(offsetScreenPosition, 0.0, 1.0);
}

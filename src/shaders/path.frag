
#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform vec2 resolution;
uniform float strokeWidth;
uniform vec2 beginVertex;
uniform vec2 endVertex;
// uniform texture2D previousFrameBuffer;

varying vec2 currentVertex;
varying vec2 start;
varying vec2 mid;
varying vec2 end;

float det(vec2 a, vec2 b) { return a.x*b.y-b.x*a.y; }

vec2 closestPointInSegment( vec2 a, vec2 b ) {
  vec2 ba = b - a;
  return a + ba*clamp(-dot(a,ba)/dot(ba,ba), 0.0, 1.0 );
}

// From: http://research.microsoft.com/en-us/um/people/hoppe/ravg.pdf
vec2 getDistanceVector(vec2 b0, vec2 b1, vec2 b2) {
  float a = det(b0, b2), b = 2.0 * det(b1, b0), d = 2.0 * det(b2, b1);
  if (abs(2.0 * a + b + d) < 1000.0) {
      return closestPointInSegment(b0, b2);
  }
  float f = b * d - a * a;
  vec2 d21 = b2 - b1, d10 = b1 - b0, d20 = b2 - b0;
  vec2 gf = 2.0 * (b * d21 + d * d10 + a * d20);
  gf = vec2(gf.y, -gf.x);
  vec2 pp = -f * gf / dot(gf, gf);
  vec2 d0p = b0 - pp;
  float ap = det(d0p, d20), bp = 2.0 * det(d10, d0p);
  float t = clamp((ap + bp) / (2.0 * a + b + d), 0.0, 1.0);
  return mix(mix(b0, b1, t), mix(b1, b2, t), t);
}

float approxDistance(vec2 p, vec2 b0, vec2 b1, vec2 b2) {
  return length(getDistanceVector(b0 - p, b1 - p, b2 - p));
}

vec2 toFragCoords(vec2 v) {
	return vec2(v.x, resolution.y - v.y);
}

void main() {

    // vec4 previousColor = sample(previousFrameBuffer, gl_FragCoord.xy);

    // Declare vars
    float thickness = 0.5 * strokeWidth;
	vec2 coord = gl_FragCoord.xy;

    // Check if we are drawing a line cap
    float distanceFromCurrentVertex = distance(toFragCoords(currentVertex), coord);
    float delta = fwidth(distanceFromCurrentVertex);
    float lineCapSmooth = smoothstep(thickness - delta, thickness, distanceFromCurrentVertex);

    // Bezier curve computation -- currently unused.
    // `distFromCurve` will be the distance from the curve through a, b and c
	// vec2 a = vec2(start.x, 1.0 - start.y) * resolution;
	// vec2 b = vec2(mid.x, 1.0 - mid.y) * resolution;
	// vec2 c = vec2(end.x, 1.0 - end.y) * resolution;
	// float distFromCurve = approxDistance(coord, a, b, c);

	gl_FragColor = vec4(vec3(0.0), 1.0 - lineCapSmooth);
}

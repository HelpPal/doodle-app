
precision mediump float;

uniform vec2 resolution;
uniform vec2 origin;
uniform vec2 size;
uniform vec2 imageSize;
uniform float rotation;
uniform vec2 center;
uniform float padding;
uniform sampler2D image;

mat2 createRotationMatrix(float rad) {
	return mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
}

vec2 getImageSize() {
    bool isLandscape = imageSize.x > imageSize.y;
    if (isLandscape) {
				float aspect = imageSize.y / imageSize.x;
        return vec2(size.x, size.y * aspect);
    }
		float aspect = imageSize.x / imageSize.y;
		return vec2(size.x * aspect, size.y);
}

vec2 getImageOffset() {
	vec2 adjustedImageSize = getImageSize();
	float widthOffset = (size.x - adjustedImageSize.x) * 0.5;
	float heightOffset = (size.y - adjustedImageSize.y) * 0.5;
	return vec2(widthOffset, heightOffset);
}

void main() {
    mat2 rotationMatrix = createRotationMatrix(rotation);
    vec2 coord = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
    coord = center + rotationMatrix * (coord - center);
    vec2 adjustedImageSize = getImageSize();
		vec2 offset = getImageOffset();
    vec2 imageCoord = ((coord - origin) / imageSize);
    if (imageCoord.x > 1.0 ||
			  imageCoord.y > 1.0 ||
				imageCoord.x < 0.0 ||
				imageCoord.y < 0.0) {
        gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);
        return;
    }
    gl_FragColor = texture2D(image, imageCoord);
}

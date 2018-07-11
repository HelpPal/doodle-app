
import map from 'lodash/map';
import vectorizeText from 'vectorize-text';

// FIXME test font, in production replace with google fonts
import '../OpenBaskerville/OpenBaskerville.otf';
import './fonts.css';

const DEFAULT_POSITION = { x: 0, y: 0 }; // FIXME

export function triangulatGlyphsForText(text, fontFamily) {
    const value = text.getValue();
    const position = text.getPosition() || DEFAULT_POSITION;
    const size = text.getSize();
    const rotation = text.getRotation();
    const fontSize = text.getFontSize();
    const triangles = vectorizeText(value, {
        triangles: true,
        textBaseline: 'ideographic',
        textAlign: 'left',
        size: fontSize,
        lineHeight: fontSize,
        height: fontSize,
        font: fontFamily
    });
    const center = calculateCenterPoint(position, size);
    return map(triangles.cells, triangle => {
        const [a, b, c] = triangle;
        const points = [triangles.positions[a],
                        triangles.positions[b],
                        triangles.positions[c]];
        return {
            center,
            rotation,
            points: map(points, p => convertPoint({ x: p[0], y: p[1] }, position, fontSize))
        };
    });
}

function calculateCenterPoint(position, size) {
    return {
        x: position.x + size.width / 2,
        y: position.y + size.height / 2
    };
}

function convertPoint(point, position, fontSize, padding) {
    return {
        x: point.x + position.x + 0.06 * fontSize,
        y: point.y + position.y + 1.85 * fontSize
    };
}

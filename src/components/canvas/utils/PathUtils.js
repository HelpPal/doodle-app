

export function getMidpoint(a, b) {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
    };
}

export function getUnitNormalVector(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const orthogDx = dy;
    const orthogDy = -dx;
    const m = getMagnitude(orthogDx, orthogDy);
    const unitX = (orthogDx / m) || 0;
    const unitY = (orthogDy / m) || 0;
    return {
        x: unitX,
        y: unitY
    };
}


export function getMagnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}

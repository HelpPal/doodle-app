
import { Model } from 'caldera-immutable-model';
import { List } from 'immutable';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';

export default class Path extends Model {

    constructor(data) {
        super(data);
        this.vertices = new List(this.get('vertices'));
    }

    getId() {
        return this.get('id');
    }

    setId(id) {
        return this.set('id', id);
    }

    getVertices() {
        return this.vertices;
    }

    setVertices(vertices) {
        return this.set('vertices', vertices);
    }

    getPosition() {
        return this.get('position');
    }

    setPosition(position) {
        return this.set('position', position);
    }

    pushVertex(vertex) {
        return this.setVertices(this.getVertices().push(vertex));
    }

    getMinX() {
        const point = minBy(this.getVertices().toArray(), vertex => vertex.x);
        return point.x;
    }

    getMinY() {
        const point = minBy(this.getVertices().toArray(), vertex => vertex.y);
        return point.y;
    }

    getMaxX() {
        const point = maxBy(this.getVertices().toArray(), vertex => vertex.x);
        return point.x;
    }

    getMaxY() {
        const point = maxBy(this.getVertices().toArray(), vertex => vertex.y);
        return point.y;
    }

    // Scale -------

    setScaleX(scaleX) {
      return this.set('scaleX', scaleX);
    }

    setScaleY(scaleY) {
      return this.set('scaleY', scaleY);
    }

    getScaleX() {
      return this.get('scaleX') || 1;
    }

    getScaleY() {
      return this.get('scaleY') || 1;
    }

    getScale() {
        return {
            x: this.getScaleX(),
            y: this.getScaleY()
        };
    }

    // Width -------

    setWidth(width) {
      const maxX = this.getMaxX();
      const minX = this.getMinX();
      const originalWidth = maxX - minX;
      const scaleX = 1 + (width - originalWidth) / originalWidth;
      return this.setScaleX(scaleX);
    }

    getWidth() {
        const maxX = this.getMaxX();
        const minX = this.getMinX();
        const scaleX = this.getScaleX();
        return (maxX - minX) * scaleX;
    }

    // Height -------

    setHeight(height) {
      const maxY = this.getMaxY();
      const minY = this.getMinY();
      const originalHeight = maxY - minY;
      const scaleY = 1 + (height - originalHeight) / originalHeight;
      return this.setScaleY(scaleY);
    }

    getHeight() {
        const maxY = this.getMaxY();
        const minY = this.getMinY();
        const scaleY = this.getScaleY();
        return (maxY - minY) * scaleY;
    }

    // Size -------

    //FIXME: Add padding and rotation to equation
    isPointInBounds(point) {
        return (point.x >= this.getPosition().x && point.x <= (this.getPosition().x + this.getWidth()) &&
                point.y >= this.getPosition().y && point.y <= (this.getPosition().y + this.getHeight()));
    }

    getSize() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        };
    }

    // Center ------

    getCenter() {
        const position = this.getPosition();
        const size = this.getSize();
        return {
            x: position.x + size.width / 2,
            y: position.y + size.height / 2
        };
    }

    // Rotation -------

    getRotation() {
        return this.get('rotation');
    }

    setRotation(rotation) {
        return this.set('rotation', rotation);
    }

    // Padding -------

    getPadding() {
        return this.get('padding');
    }

    setPadding(padding) {
        return this.set('padding', padding);
    }

    // Other -------

    calculateChangeInOrigin(origin) {
        const position = this.getPosition();
        return {
            x: origin.x - position.x,
            y: origin.y - position.y
        };
    }

    translateVertices(translation) {
        return this.setVertices(this.getVertices().map(vertex => {
            return {
                x: vertex.x + translation.x,
                y: vertex.y + translation.y
            };
        }));
    }
}

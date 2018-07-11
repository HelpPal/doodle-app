
import { Model } from 'caldera-immutable-model';
import { defaultFontSize } from '../constants';

export default class Text extends Model {
    getId() {
        return this.get('id');
    }

    setId(id) {
        return this.set('id', id);
    }

    getValue() {
        return this.get('value');
    }

    setValue(value) {
        return this.set('value', value);
    }

    getPosition() {
        return this.get('position');
    }

    setPosition(position) {
        return this.set('position', position);
    }

    getFontSize() {
        return this.get('fontSize') || defaultFontSize;
    }

    setFontSize(fontSize) {
        return this.set('fontSize', fontSize);
    }

    getHeight() {
        return this.get('height');
    }

    setHeight(height) {
        return this.set('height', height);
    }

    getWidth() {
        return this.get('width');
    }

    setWidth(width) {
        return this.set('width', width);
    }

    getSize() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        };
    }

    setSize(size) {
        if (!size) {
            return this;
        }
        return this.setFontSize(size.height)
                   .setHeight(size.height)
                   .setWidth(size.width);
    }

    //FIXME: Add rotation to equation
    isPointInBounds(point) {
        return (point.x >= this.getPosition().x && point.x <= (this.getPosition().x + this.getWidth()) &&
                point.y >= this.getPosition().y && point.y <= (this.getPosition().y + this.getHeight()));
    }

    getRotation() {
        return this.get('rotation');
    }

    setRotation(rotation) {
        return this.set('rotation', rotation);
    }

    getPadding() {
        return this.get('padding');
    }

    setPadding(padding) {
        return this.set('padding', padding);
    }
}

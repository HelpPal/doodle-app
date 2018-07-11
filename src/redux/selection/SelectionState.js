
import { Model } from 'caldera-immutable-model';

export default class SelectionState extends Model {
    getSelectedId() {
        return this.get('selectedId');
    }

    setSelectedId(id) {
        return this.set('selectedId', id);
    }

    resetSelection() {
        return this.setSelectedId(null);
    }

    getSize() {
        return this.get('size');
    }

    setSize(size) {
        return this.set('size', size);
    }

    getPosition() {
        return this.get('position');
    }

    setPosition(position) {
        return this.set('position', position);
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

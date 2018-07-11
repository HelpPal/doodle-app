
import { Model } from 'caldera-immutable-model';

export default class Glyph extends Model {
    getPoints() {
        return this.get('points');
    }

    getRotation() {
        return this.get('rotation');
    }

    getCenter() {
        return this.get('center');
    }
}

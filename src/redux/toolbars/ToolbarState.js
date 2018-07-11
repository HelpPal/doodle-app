
import { Model } from 'caldera-immutable-model';
import { Toolbars } from './constants';

export default class ToolbarState extends Model {
    getActiveToolbar() {
        return this.get('activeToolbar');
    }

    setActiveToolbar(toolbar) {
        return this.set('activeToolbar', toolbar);
    }

    isPathActive() {
        return this.getActiveToolbar() === Toolbars.Path;
    }

    isTextActive() {
        return this.getActiveToolbar() === Toolbars.Text;
    }

    isSelectActive() {
        return this.getActiveToolbar() === Toolbars.Select;
    }

    isImageActive() {
        return this.getActiveToolbar() === Toolbars.Image;
    }
}


import { Model } from 'caldera-immutable-model';
import TextCollection from '../../models/TextCollection';
import { TEXT_PADDING } from '../../constants';

export default class TextState extends Model {
    constructor(props) {
        super(props);
        this.text = new TextCollection(this.get('text'));
    }

    getFontFamily() {
        return this.get('fontFamily');
    }

    setFontFamily(fontFamily) {
        return this.set('fontFamily', fontFamily);
    }

    getFontPath() {
        return this.get('fontPath');
    }

    setFontPath(fontPath) {
        return this.set('fontPath', fontPath);
    }

    getText() {
        return this.text;
    }

    setText(text) {
        return this.set('text', text);
    }

    addOrReplaceText(text) {
        return this.setText(this.getText().addOrReplaceById(text.id || text.getId(), text));
    }

    findTextById(id) {
        return this.getText().findById(id);
    }

    setTextPositionSizeRotationById(id, position, size, rotation) {
        const text = this.findTextById(id);
        if (!text) {
            return this;
        }
        const newText = text.setPadding(TEXT_PADDING)
                            .setPosition(position)
                            .setFontSize(size.height - TEXT_PADDING)
                            .setHeight(size.height)
                            .setWidth(size.width)
                            .setRotation(rotation);
        return this.addOrReplaceText(newText);
    }

    addOrReplaceTextValueById(id, value) {
        const text = this.findTextById(id);
        if (!text) {
            return this.addOrReplaceText({ id, value });
        }
        return this.addOrReplaceText(text.setValue(value));
    }

    setFontSizeById(id, fontSize) {
        const text = this.findTextById(id);
        if (!text) {
            return this;
        }
        return this.addOrReplaceText(text.setFontSize(fontSize));
    }

    findTextByPointInBounds(point) {
        return this.getText().find(text => {
            // FIXME find a better solution than ignoring empty strings
            if (!text.getValue()) {
                return false;
            }
            return text.isPointInBounds(point);
        });
    }

    removeTextById(id) {
        return this.setText(this.getText().removeById(id));
    }

    deleteAllText() {
        return this.setText([]);
    }
}

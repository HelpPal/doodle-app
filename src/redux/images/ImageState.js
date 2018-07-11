
import { Model } from 'caldera-immutable-model';
import ImageCollection from '../../models/ImageCollection';
import { IMAGE_PADDING } from '../../constants';

export default class ImageState extends Model {
    constructor(data) {
        super(data);
        this.images = new ImageCollection(this.get('images'));
    }

    getSelectedImagePath() {
        return this.get('selectedImagePath');
    }

    setSelectedImagePath(selectedImagePath) {
        return this.set('selectedImagePath', selectedImagePath);
    }

    getImages() {
        return this.images;
    }

    setImages(images) {
        return this.set('images', images);
    }

    addOrReplaceImage(image) {
        const images = this.getImages();
        const newImages = images.addOrReplaceById(image.id || image.getId(), image);
        return this.setImages(newImages);
    }

    findImageByPointInBounds(point) {
        return this.getImages().find(image => {
            return image.isPointInBounds(point);
        });
    }

    findImageById(id) {
        return this.getImages().findById(id);
    }

    removeImageById(id) {
        return this.setImages(this.getImages().removeById(id));
    }

    deleteAllImages() {
        return this.setImages([]);
    }

    setImagePositionSizeRotationById(id, position, size, rotation) {
      const image = this.findImageById(id);
      if (!image) {
        return this;
      }
      const newImage = image.setPosition(position)
                            .setPadding(IMAGE_PADDING)
                            .setHeight(size.height)
                            .setWidth(size.width)
                            .setSize(size)
                            .setRotation(rotation);
      return this.addOrReplaceImage(newImage);
    }
}

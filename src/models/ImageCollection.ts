
import { Collection } from 'caldera-immutable-model';
import Image from './Image';

interface ImageCollection {
    constructor(data: [Image] | [ImageData]);
}

class ImageCollection extends Collection {
    public static Model = Image;
}

export default ImageCollection;

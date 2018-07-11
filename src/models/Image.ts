
import { Model } from 'caldera-immutable-model';

type Vertex = {
    x: number;
    y: number
};

type Size = {
    width: number,
    height: number;
};

type ImageData = {
    center?: Vertex;
    position?: Vertex;
    rotation?: number;
    size?: Size;
    url?: string;
    id?: string;
};

interface Image extends Model {
    constructor(data: ImageData);
}

class Image extends Model {

    public getId(): string | null {
        return this.get('id');
    }

    public setId(id: string): Image {
        return this.set('id', id);
    }

    public getPosition(): Vertex | null {
        return this.get('position');
    }

    public setPosition(position: Vertex): Image {
        return this.set('position', position);
    }

    public getPadding(): number {
        return this.get('padding') || 0;
    }

    public setPadding(padding: number): Image {
        return this.set('padding', padding);
    }

    public getSize(): Size | null {
        return this.get('size');
    }

    public setSize(size: Size) {
        return this.set('size', size);
    }

    public getWidth(): number {
        const size = this.getSize();
        return size ? size.width : 0;
    }

    public setWidth(width: number) {
        let size = this.getSize();
        return this.setSize({ ...size, width });
    }

    public getHeight(): number {
        const size = this.getSize();
        return size ? size.height : 0;
    }

    public setHeight(height: number) {
        let size = this.getSize();
        return this.setSize({ ...size, height });
    }

    public getRotation(): number {
        return this.get('rotation') || 0;
    }

    public setRotation(rotation: number): Image {
        return this.set('rotation', rotation);
    }

    public getCenter(): Vertex | null {
        const position = this.getPosition();
        const size = this.getSize();
        return {
            x: position.x + (size.width / 2),
            y: position.y + (size.height / 2)
        };
    }

    public getUrl(): string | null {
        return this.get('url');
    }

    // FIXME: Add rotation to equation
    public isPointInBounds(point): boolean {
        return (point.x >= this.getPosition().x && point.x <= (this.getPosition().x + this.getWidth()) &&
                point.y >= this.getPosition().y && point.y <= (this.getPosition().y + this.getHeight()));
    }
}

export default Image;

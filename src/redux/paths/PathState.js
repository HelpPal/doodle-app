
import { Model } from 'caldera-immutable-model';
import PathCollection from '../../models/PathCollection';
import { PATH_PADDING } from '../../constants';

export default class PathState extends Model {
    constructor(data) {
        super(data);
        this.paths = new PathCollection(this.get('paths'));
    }

    getPaths() {
        return this.paths;
    }

    setPaths(paths) {
        return this.set('paths', paths);
    }

    addOrReplacePath(path) {
        const paths = this.getPaths();
        const newPaths = paths.addOrReplaceById(path.id || path.getId(), path);
        return this.setPaths(newPaths);
    }

    findPathByPointInBounds(point) {
        return this.getPaths().find(path => {
            return path.isPointInBounds(point);
        });
    }

    findPathById(id) {
        return this.getPaths().findById(id);
    }

    setPathPositionSizeRotationById(id, position, size, rotation) {
      const path = this.findPathById(id);
      if (!path) {
        return this;
      }
      const changeInOrigin = path.calculateChangeInOrigin(position);
      const newPath = path.setPadding(PATH_PADDING)
                          .setPosition(position)
                          .setHeight(size.height)
                          .setWidth(size.width)
                          .setRotation(rotation)
                          .translateVertices(changeInOrigin);
      return this.addOrReplacePath(newPath);
    }

    removePathById(id) {
        return this.setPaths(this.getPaths().removeById(id));
    }

    deleteAllPaths() {
        return this.setPaths([]);
    }
}

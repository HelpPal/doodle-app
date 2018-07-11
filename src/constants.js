
/* globals CONFIG */

export const isProduction = process.env.NODE_ENV === 'production';
export const defaultFontSize = 50;
export const DEFAULT_STROKE_WIDTH = 15;

export const DEFAULT_SELECTION_WIDTH = 300;
export const DEFAULT_SELECTION_HEIGHT = 200;

export const DEFAULT_SELECTION_SIZE = {
    width: DEFAULT_SELECTION_WIDTH,
    height: DEFAULT_SELECTION_HEIGHT
};

export const MINIMUM_IMAGE_SIZE = {
    width: 175,
    height: 175
};

// NOTE: images should be square
export const DEFAULT_IMAGE_SELECTION_SIZE = {
    width: DEFAULT_SELECTION_WIDTH,
    height: DEFAULT_SELECTION_HEIGHT
};

export const SELECTION_PADDING = {
    x: 30,
    y: 30
};

export const PATH_PADDING = 30;
export const IMAGE_PADDING = 30;
export const TEXT_PADDING = 30;

export const web = getEnvConfig(CONFIG.web);
export const api = getEnvConfig(CONFIG.api);

function getEnvConfig(service) {
    const { dev, production } = service;
    if (isProduction) {
        return production;
    }
    return dev;
}

export const UPLOADS_DIRECTORY = 'DoodleImages';
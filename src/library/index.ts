import { JilButton, JilPanel, JilLayer, JilCanvas, JilImage, JilText, JilScene } from './components';
import { register } from './behaviours/core/factory';

// export class
import { SceneManager } from './sceneManager';

// register to factory
register('button', JilButton);
register('panel', JilPanel);
register('layer', JilLayer);
register('image', JilImage);
register('text', JilText);
register('canvas', JilCanvas);

/**
 * Init Helper
 * @function
 */
export const init = SceneManager.init;
/**
 * Create a new scene
 * @function
 */
export const create = SceneManager.create;
/**
 * Switch to a scene
 * @function
 */
export const use = SceneManager.use;

export { SceneManager };

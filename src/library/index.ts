import { SceneManager } from './sceneManager';
import { JilButton, JilPanel, JilLayer, JilCanvas, JilImage, JilText } from './components';
import {
	registerComponent, registerLayout,
	verticalLayout, gridLayout, horizontalLayout, defaultLayout
} from './behaviours';

// register component
registerComponent('button', JilButton);
registerComponent('panel', JilPanel);
registerComponent('layer', JilLayer);
registerComponent('image', JilImage);
registerComponent('text', JilText);
registerComponent('canvas', JilCanvas);

// register layout
registerLayout('default', defaultLayout);
registerLayout('vertical', verticalLayout);
registerLayout('horizontal', horizontalLayout);
registerLayout('grid', gridLayout);

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

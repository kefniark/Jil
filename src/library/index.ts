import { SceneManager } from './sceneManager';
import {
	JilPanel, JilLayer, JilCanvas,
	JilButton, JilImage, JilText, JilRadio, JilCheckbox, JilSelect, JilInput, JilAlert
} from './components';
import {
	registerComponent, registerLayout, registerClassname,
	verticalLayout, gridLayout, horizontalLayout, defaultLayout
} from './behaviours';
import { JilTextCharacter } from './components/element/textCharacter';

// register component
registerComponent('canvas', JilCanvas);
registerComponent('layer', JilLayer);

registerComponent('button', JilButton);
registerComponent('checkbox', JilCheckbox);
registerComponent('character', JilTextCharacter);
registerComponent('image', JilImage);
registerComponent('panel', JilPanel);
registerComponent('radio', JilRadio);
registerComponent('text', JilText);
registerComponent('select', JilSelect);
registerComponent('input', JilInput);
registerComponent('alert', JilAlert);

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

export { SceneManager, registerClassname, registerComponent, registerLayout };

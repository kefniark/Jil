import { Scene } from './components/scene';
import { createProjector, h, Projector } from 'maquette';
import { FadeInOut } from './transitions/sceneTransition';
import { resolution } from './config';
import * as Fatina from 'fatina';

/**
 * @ignore
 */
const scenes: {[id: string]: Scene} = {};
/**
 * @ignore
 */
const sceneList: Scene[] = [];
/**
 * @ignore
 */
let projector: Projector | undefined;
/**
 * @ignore
 */
let current: Scene | undefined;

/**
 * Scene Manager Object (use UMD: Universal Module Definition)
 *
 * @remarks
 * - Import: `import { SceneManager } from 'jil';`
 * - Require: `const SceneManager = require('jil').SceneManager;`
 * - Web: `<script src="jil.js"></script> ... jil.SceneManager`
 */
export class SceneManager {

	/**
	 * Create the JIL root and append it to the document.body
	 *
	 * @param width Native width of the game
	 * @param height Native height of the game
	 */
	public static init (width?: number, height?: number) {
		Fatina.init();
		projector = createProjector();
		const vdom = () => h('div', { id: 'root' }, sceneList.map((x) => x.render()));
		projector.append(document.body, vdom);
		if (width && height) {
			resolution.set(width, height);
		}
	}

	/**
	 * Create a new scene
	 *
	 * @param id SceneId (need to be unique)
	 */
	public static create (id: string): Scene {
		if (!projector) {
			throw new Error('JIL is not initialized, please call .init() before using it');
		}
		scenes[id] = new Scene(id, projector);
		sceneList.push(scenes[id]);
		projector.scheduleRender();
		return scenes[id];
	}

	/**
	 * Switch to a different scene
	 *
	 * @param id SceneId
	 */
	public static use (id: string) {
		if (!projector) {
			throw new Error('JIL is not initialized, please call .init() before using it');
		}
		if (current === scenes[id]) return;

		FadeInOut(current, scenes[id]);

		current = scenes[id];
	}
}

import { JilScene } from './components';
import { createProjector, h, Projector } from 'maquette';
import { FadeInOut } from './transitions/sceneTransition';
import { resolution } from './config';
import * as Fatina from 'fatina';

/**
 * @ignore
 */
let scenes: {[id: string]: JilScene} = {};
/**
 * @ignore
 */
let sceneList: JilScene[] = [];
/**
 * @ignore
 */
let projector: Projector | undefined;
/**
 * @ignore
 */
let current: JilScene | undefined;

/**
 * Scene Manager Object (use UMD: Universal Module Definition)
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
		sceneList = [];
		scenes = {};

		const vdom = () => h('div', { id: 'root' }, sceneList.map((x) => x.render()));

		// tslint:disable-next-line
		if (typeof(document) !== 'undefined') {
			projector = createProjector();
			projector.append(document.body, vdom);
		} else {
			projector = {
				// tslint:disable-next-line:no-empty
				scheduleRender: () => {}
			} as Projector;
		}

		if (width && height) {
			resolution.set(width, height);
		}
	}

	/**
	 * Create a new scene
	 *
	 * @param id SceneId (need to be unique)
	 */
	public static create (id: string): JilScene {
		if (!projector) {
			throw new Error('JIL is not initialized, please call .init() before using it');
		}
		scenes[id] = new JilScene(id, projector);
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

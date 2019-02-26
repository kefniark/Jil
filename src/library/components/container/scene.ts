import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { SyncEvent } from 'ts-events';
import { Node, Transform, Factory } from '../../behaviours';
import { Vector2 } from '../../helpers';
import { resolution } from '../../config';
import { JilLayer } from './layer';

// tslint:disable-next-line:interface-name
export interface JilScene extends Node, Transform, Factory { }

export class JilScene {
	/**
	 * @ignore
	 */
	@use(Node, Transform, Factory) public this: any;

	private enterEvent: SyncEvent<void>;
	private leaveEvent: SyncEvent<void>;

	constructor (id: string, projector: Projector) {
		this.id = id;
		this.enterEvent = new SyncEvent<void>();
		this.leaveEvent = new SyncEvent<void>();
		this._projector = projector;
		this.resetTransform();
		this.resetStyle();
		this.enable = false;
	}

	/**
	 * Enter the scene
	 *  - Make it visible
	 *  - Trigger events
	 *  - Refresh UI
	 *
	 * @returns
	 * @memberof Scene
	 */
	public enter () {
		if (this.enable) return;
		this.enable = true;
		this.enterEvent.post();
		this.refresh();
	}

	/**
	 * Leave the scene
	 *  - Hide it
	 *  - Trigger events
	 *  - Refresh UI
	 *
	 * @returns
	 * @memberof Scene
	 */
	public leave () {
		if (!this.enable) return;
		this.enable = false;
		this.leaveEvent.post();
		this.refresh();
	}

	/**
	 * Create a new Layer in this scene
	 *
	 * @param id ID of the new layer (need to be unique)
	 * @memberof Scene
	 */
	public createLayer = (id: string, classname?: string) => this.create('layer', id, classname) as JilLayer;

	/**
	 * Render the HTML
	 * @ignore
	 *
	 * @returns {VNode}
	 * @memberof Scene
	 */
	public render (): VNode {
		const styles = {} as any;
		styles.display = this.enable ? 'block' : 'none';

		// tslint:disable-next-line
		const screenRatio = (typeof(window) !== 'undefined') ? window.innerWidth / window.innerHeight : 1;
		const gameRatio = resolution.x / resolution.y;

		if (screenRatio <= gameRatio) {
			styles.width = '100vw';
			styles.height = '56.25vw';
			styles.marginTop = '-28.125vw';
			styles.marginLeft = '0vw';
			styles.top = '50vh';
			styles.left = '0vh';
		} else {
			styles.width = '177vh';
			styles.height = '100vh';
			styles.marginTop = '0vh';
			styles.marginLeft = '-88.5vh';
			styles.top = '0vw';
			styles.left = '50vw';
		}

		return h('div', {
			id: this.id,
			key: this.id,
			class: 'scene',
			styles
		}, this._childrens.map((x) => {
			return x.render();
		}));
	}

	// helpers
	public onEnter (cb: () => void) {
		this.enterEvent.attach(cb);
	}

	public onLeave (cb: () => void) {
		this.leaveEvent.attach(cb);
	}
}

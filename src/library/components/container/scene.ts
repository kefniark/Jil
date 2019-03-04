import { use } from 'typescript-mix';
import { h, VNode, Projector } from 'maquette';
import { SyncEvent } from 'ts-events';
import { JilNode, Transform, Factory, ITransformParam } from '../../behaviours';
import { resolution } from '../../config';
import { JilLayer } from './layer';
import { JilAlert, JilAlertParams } from '../popup/alert';
import { JilConfirm } from '../popup/confirm';

export interface JilScene extends JilNode, Transform, Factory { }

export class JilScene {
	/**
	 * @ignore
	 */
	@use(JilNode, Transform, Factory) public this: any;

	private enterEvent: SyncEvent<void>;
	private leaveEvent: SyncEvent<void>;

	constructor (id: string, projector: Projector) {
		this.id = id;
		this._projector = projector;
		this.resetNode('scene');
		this.resetTransform({});

		this.enterEvent = new SyncEvent<void>();
		this.leaveEvent = new SyncEvent<void>();

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
	public createLayer = (id: string, params?: ITransformParam) => this.createComponent('layer', id, params) as JilLayer;
	public createAlertPopup = (id: string, params?: JilAlertParams) => this.createComponent('alert', id, params) as JilAlert;
	public createConfirmPopup = (id: string, params?: JilAlertParams) => this.createComponent('confirm', id, params) as JilConfirm;

	public alert (title: string, msg: string) {
		return new Promise((resolve, reject) => {
			const alert = this.createAlertPopup('alert', { title, content: msg });
			alert.onLoad(() => alert.show());
			alert.onClick(() => {
				alert.hide();
				alert.destroy();
				resolve();
			});
		});
	}

	public confirm (title: string, msg: string) {
		return new Promise((resolve, reject) => {
			const confirm = this.createConfirmPopup('confirm', { title, content: msg });
			confirm.onLoad(() => confirm.show());
			confirm.onClick(() => {
				confirm.hide();
				confirm.destroy();
				resolve();
			});
			confirm.onCancel(() => {
				confirm.hide();
				confirm.destroy();
				reject();
			});
		});
	}

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

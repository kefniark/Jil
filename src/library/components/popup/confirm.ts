import { JilNode, Transform, Factory, ITransformParam } from '../../behaviours';
import { use } from 'typescript-mix';
import { Projector, VNode, h } from 'maquette';
import { JilButton, JilButtonParams } from '../element/button';
import { getParam } from '../../helpers';
import { SyncEvent } from 'ts-events';
import { resolution } from '../../config';

export interface JilConfirm extends JilNode, Transform, Factory { }

/**
 * @ignore
 */
export interface JilConfirmParams extends ITransformParam {
	title?: string;
	content?: string;
}

export class JilConfirm {
	@use(JilNode, Transform, Factory) public this: any;

	public title: string;
	public content: string;
	private okButton: JilButton;
	private cancelButton: JilButton;
	private clickEvent: SyncEvent<void>;
	private cancelEvent: SyncEvent<void>;

	constructor (id: string, params: ITransformParam, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetNode('dialog');

		if (!params) params = {};
		this.resetTransform(params);

		this.clickEvent = new SyncEvent<void>();
		this.cancelEvent = new SyncEvent<void>();

		this.title = getParam(params, 'title', 'Title');
		this.content = getParam(params, 'content', 'Content');

		this.size.set(0.6, 0.5);

		this.okButton = this.createButton('okBtn', {
			text: 'OK',
			size: [0.2, 0.15],
			anchor: [0.5, 1],
			pivot: [0.5, 1],
			position: [0.15, -0.35]
		});
		this.okButton.onClick(() => this.clickEvent.post());

		this.cancelButton = this.createButton('cancelBtn', {
			text: 'Cancel',
			size: [0.2, 0.15],
			anchor: [0.5, 1],
			pivot: [0.5, 1],
			position: [-0.15, -0.35]
		});
		this.cancelButton.onClick(() => this.cancelEvent.post());
	}

	public show () {
		(document.getElementById(this.id) as any).showModal();
		(document.getElementById(this.id) as any).focus();
		this.node.nodeEvent.post('show');
	}

	public hide () {
		(document.getElementById(this.id) as any).close();
		this.node.nodeEvent.post('hide');
	}

	public onClick (cb: () => void) {
		if (this.clickEvent) this.clickEvent.attach(cb);
	}

	public onCancel (cb: () => void) {
		if (this.cancelEvent) this.cancelEvent.attach(cb);
	}

	private createButton = (id: string, params?: string | JilButtonParams) => this.createComponent('button', id, params) as JilButton;

	public render (): VNode {
		const styles = {} as any;
		styles.display = this.enable ? 'block' : 'none';
		styles.opacity = this.opacity.toString();

		// tslint:disable-next-line
		const size = (typeof(window) !== 'undefined') ? { x: window.innerWidth, y: window.innerHeight }: { x: 1, y: 1};
		const screenRatio = size.x / size.y;
		const gameRatio = resolution.x / resolution.y;
		const scaleX = size.x / resolution.x;
		const scaleY = size.y / resolution.y;
		const scale = (screenRatio <= gameRatio) ? scaleX : scaleY;

		styles.width = `${resolution.x * this.size.x}px`;
		styles.height = `${resolution.y * this.size.y}px`;
		// styles.transformOrigin = 'center center';
		styles.transform = `scale(${scale})`;
		this.styles = styles;

		return h('dialog', this.getProperties({}), [
			h('form', { method: 'dialog' }, [
				h('p', { class: 'title' }, [ this.title ]),
				h('p', {}, [ this.content ]),
				this.okButton.render(),
				this.cancelButton.render()
			])
		]);
	}
}

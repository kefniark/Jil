import { JilNode, Transform, Factory, ITransformParam } from '../../behaviours';
import { use } from 'typescript-mix';
import { Projector, VNode, h } from 'maquette';
import { JilButton, JilButtonParams } from '../element/button';
import { getParam, getComponent } from '../../helpers';
import { SyncEvent } from 'ts-events';

export interface JilAlert extends JilNode, Transform, Factory { }

/**
 * @ignore
 */
export interface JilAlertParams extends ITransformParam {
	title?: string;
	content?: string;
}

export class JilAlert {
	@use(JilNode, Transform, Factory) public this: any;

	public title: string;
	public content: string;
	private okButton: JilButton;
	private clickEvent: SyncEvent<void>;

	constructor (id: string, params: ITransformParam, parent: JilNode, projector: Projector | undefined) {
		this.id = id;
		this._parent = parent;
		this._projector = projector;
		this.resetNode('dialog');

		if (!params) params = {};
		this.resetTransform(params);

		this.clickEvent = new SyncEvent<void>();

		this.title = getParam(params, 'title', 'Title');
		this.content = getParam(params, 'content', 'Content');

		this.size.set(0.8, 0.5);

		this.okButton = this.createButton('okBtn', {
			text: 'OK',
			size: [0.2, 0.2],
			anchor: [0.5, 1],
			pivot: [0.5, 1]
		});
		this.okButton.onClick(() => this.clickEvent.post());
	}

	public onClick (cb: () => void) {
		if (this.clickEvent) this.clickEvent.attach(cb);
	}

	private createButton = (id: string, params?: string | JilButtonParams) => this.createComponent('button', id, params) as JilButton;

	public render (): VNode {
		return h('dialog', this.getProperties({
		}), [
			h('form', { method: 'dialog' }, [
				h('p', { class: 'title' }, [ this.title ]),
				h('p', {}, [ this.content ]),
				this.okButton.render()
			])
		]);
	}
}

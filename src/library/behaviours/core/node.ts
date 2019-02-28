import { h, VNode, Projector } from 'maquette';
import { SyncEvent } from 'ts-events';
import { getComponent } from '../../helpers';
import { Transform } from './transform';

export class JilNode {
	public id?: string;
	public type?: string;

	public get transform (): Transform {
		return getComponent<Transform>(this);
	}

	/**
	 * @ignore
	 */
	public _projector?: Projector;
	/**
	 * @ignore
	 */
	public _parent?: JilNode;
	/**
	 * @ignore
	 */
	public _childrens: JilNode[] = [];

	private createEvent = new SyncEvent<void>();
	private destroyEvent = new SyncEvent<void>();

	/**
	 * @ignore
	 */
	public nodeEvent = new SyncEvent<string>();

	/**
	 * @ignore
	 */
	public resetNode (type: string) {
		this.type = type;
		this._childrens = [];
		if (!this.createEvent) this.createEvent = new SyncEvent<void>();
		if (!this.destroyEvent) this.destroyEvent = new SyncEvent<void>();
		if (!this.nodeEvent) this.nodeEvent = new SyncEvent<string>();
	}

	protected handlerAfterCreate () {
		if (this.createEvent) this.createEvent.post();
	}

	protected handleAfterRemoved () {
		if (this.destroyEvent) this.destroyEvent.post();
	}

	public onLoad (cb: () => void) {
		if (this.createEvent) this.createEvent.attach(cb);
	}

	public onDestroy (cb: () => void) {
		if (this.destroyEvent) this.destroyEvent.attach(cb);
	}

	public addChild (element: JilNode) {
		this._childrens.push(element);
		if (this.nodeEvent) this.nodeEvent.post('added');
		this.refresh();
	}

	public removeChild (element: JilNode) {
		const i = this._childrens.indexOf(element);
		if (i !== -1) {
			this._childrens.splice(i, 1);
			if (this.nodeEvent) this.nodeEvent.post('removed');
		}
		this.refresh();
	}

	public destroy () {
		if (this.nodeEvent) this.nodeEvent.post('destroyed');
		if (this._parent) this._parent.removeChild(this);
	}

	public refresh () {
		if (this.nodeEvent) this.nodeEvent.post('refresh');
		if (this._projector) this._projector.scheduleRender();
	}

	/**
	 * @ignore
	 */
	public render (): VNode {
		return h('div', this._childrens.map((x) => x.render()));
	}

	public find (id: string): JilNode | undefined {
		return this._childrens.find((x) => x.id === id);
	}

	public findByType (type: string): JilNode | undefined {
		return this._childrens.find((x) => x.type === type);
	}

	public findAllByType (type: string) {
		return this._childrens.filter((x) => x.type === type);
	}

	public toString (): string {
		return `[UI ${this.id}]`;
	}
}

import { h, VNode, Projector } from 'maquette';
import { SyncEvent } from 'ts-events';

export class Node {
	public id?: string;
	/**
	 * @ignore
	 */
	public _projector?: Projector;
	/**
	 * @ignore
	 */
	public _parent?: Node;
	/**
	 * @ignore
	 */
	public _childrens: Node[] = [];

	private createEvent: SyncEvent<void> | undefined;
	private destroyEvent: SyncEvent<void> | undefined;

	/**
	 * @ignore
	 */
	public resetTransform () {
		this._childrens = [];
		if (!this.createEvent) this.createEvent = new SyncEvent<void>();
		if (!this.destroyEvent) this.destroyEvent = new SyncEvent<void>();
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

	public addChild (element: Node) {
		this._childrens.push(element);
		this.refresh();
	}

	public removeChild (element: Node) {
		const i = this._childrens.indexOf(element);
		if (i !== -1) {
			this._childrens.splice(i, 1);
		}
		this.refresh();
	}

	public destroy () {
		if (this._parent) this._parent.removeChild(this);
	}

	public refresh () {
		if (this._projector) this._projector.scheduleRender();
	}

	/**
	 * @ignore
	 */
	public render (): VNode {
		return h('div', this._childrens.map((x) => x.render()));
	}

	public toString (): string {
		return `[UI ${this.id}]`;
	}
}

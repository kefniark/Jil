import { SyncEvent } from 'ts-events';
import { getComponent } from '../../helpers';
import { Transform } from '../core/transform';

export class MouseEvents {
	/**
	 * @ignore
	 */
	private mousedownEvent?: SyncEvent<MouseEvent>;
	private mouseupEvent?: SyncEvent<MouseEvent>;
	private mouseenterEvent?: SyncEvent<MouseEvent>;
	private mouseleaveEvent?: SyncEvent<MouseEvent>;
	private mousemoveEvent?: SyncEvent<MouseEvent>;
	private mousewheelEvent?: SyncEvent<MouseEvent>;

	/**
	 * @ignore
	 */
	public resetMouseEvent () {
		this.mousedownEvent = new SyncEvent<MouseEvent>();
		this.mouseupEvent = new SyncEvent<MouseEvent>();
		this.mouseenterEvent = new SyncEvent<MouseEvent>();
		this.mouseleaveEvent = new SyncEvent<MouseEvent>();
		this.mousemoveEvent = new SyncEvent<MouseEvent>();
		this.mousewheelEvent = new SyncEvent<MouseEvent>();
	}

	public mousedown (ev: MouseEvent): void {
		if (!this.mousedownEvent) return;
		this.mousedownEvent.post(ev);
	}

	public mouseup (ev: MouseEvent): void {
		if (!this.mouseupEvent) return;
		this.mouseupEvent.post(ev);
	}

	public mouseenter (evt: MouseEvent) {
		if (!this.mouseenterEvent) return;
		this.mouseenterEvent.post(evt);
	}

	public mouseleave (evt: MouseEvent) {
		if (!this.mouseleaveEvent) return;
		this.mouseleaveEvent.post(evt);
	}

	public mousemove (evt: MouseEvent) {
		if (!this.mousemoveEvent) return;
		this.mousemoveEvent.post(evt);
	}

	public mousewheel (evt: MouseEvent) {
		if (!this.mousewheelEvent) return;
		this.mousewheelEvent.post(evt);
	}

	// helpers
	public onMouseup (cb: () => void) {
		if (this.mouseupEvent) this.mouseupEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onmouseup = this.mouseup.bind(this);
	}

	public onMousedown (cb: () => void) {
		if (this.mousedownEvent) this.mousedownEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onmousedown = this.mousedown.bind(this);
	}

	public onMouseenter (cb: () => void) {
		if (this.mouseenterEvent) this.mouseenterEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onmouseenter = this.mouseenter.bind(this);
	}

	public onMouseleave (cb: () => void) {
		if (this.mouseleaveEvent) this.mouseleaveEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onmouseleave = this.mouseleave.bind(this);
	}

	public onMousemove (cb: () => void) {
		if (this.mousemoveEvent) this.mousemoveEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onmousemove = this.mousemove.bind(this);
	}

	public onMousewheel (cb: () => void) {
		if (this.mousewheelEvent) this.mousewheelEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onmousewheel = this.mousewheel.bind(this);
	}
}

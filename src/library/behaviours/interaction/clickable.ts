import { SyncEvent } from 'ts-events';
import { getComponent } from '../../helpers';
import { Transform } from '../core/transform';

export class Clickable {
	/**
	 * @ignore
	 */
	private clickEvent?: SyncEvent<void>;
	private dbClickEvent?: SyncEvent<void>;

	/**
	 * @ignore
	 */
	public resetClickable () {
		this.clickEvent = new SyncEvent<void>();
		this.dbClickEvent = new SyncEvent<void>();
	}

	public click () {
		if (!this.clickEvent) return;
		this.clickEvent.post();
	}

	public doubleClick () {
		if (!this.dbClickEvent) return;
		this.dbClickEvent.post();
	}

	// helpers
	public onClick (cb: () => void) {
		if (this.clickEvent) this.clickEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.classnames = ('clickable ' + transform.classnames).trim();
		transform.properties.onclick = this.click.bind(this);
	}

	public onDbClick (cb: () => void) {
		if (this.dbClickEvent) this.dbClickEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.classnames = ('clickable ' + transform.classnames).trim();
		transform.properties.ondblclick = this.doubleClick.bind(this);
	}
}

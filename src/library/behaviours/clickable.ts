import { SyncEvent } from 'ts-events';

export class Clickable {

	private clickEvent?: SyncEvent<void>;

	public resetClickable () {
		this.clickEvent = new SyncEvent<void>();
	}

	public click () {
		if (!this.clickEvent) return;
		this.clickEvent.post();
	}

	// helpers
	public onClick (cb: () => void) {
		if (this.clickEvent) this.clickEvent.attach(cb);
	}
}

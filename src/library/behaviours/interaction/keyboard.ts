import { SyncEvent } from 'ts-events';
import { getComponent } from '../../helpers';
import { Transform } from '../core/transform';

export class KeyboardEvents {
	/**
	 * @ignore
	 */
	private keydownEvent?: SyncEvent<KeyboardEvent>;
	private keypressEvent?: SyncEvent<KeyboardEvent>;
	private keyupEvent?: SyncEvent<KeyboardEvent>;
	private focusEvent?: SyncEvent<FocusEvent>;
	private blurEvent?: SyncEvent<FocusEvent>;
	private submitEvent?: SyncEvent<Event>;

	/**
	 * @ignore
	 */
	public resetKeyboardEvent () {
		this.keydownEvent = new SyncEvent<KeyboardEvent>();
		this.keypressEvent = new SyncEvent<KeyboardEvent>();
		this.keyupEvent = new SyncEvent<KeyboardEvent>();
		this.focusEvent = new SyncEvent<FocusEvent>();
		this.blurEvent = new SyncEvent<FocusEvent>();
		this.submitEvent = new SyncEvent<Event>();
	}

	public keydown (evt: KeyboardEvent) {
		if (!this.keydownEvent) return;
		this.keydownEvent.post(evt);
	}

	public keypress (evt: KeyboardEvent) {
		if (!this.keypressEvent) return;
		this.keypressEvent.post(evt);
	}

	public keyup (evt: KeyboardEvent) {
		if (!this.keyupEvent) return;
		this.keyupEvent.post(evt);
	}

	public focus (evt: FocusEvent) {
		if (!this.focusEvent) return;
		this.focusEvent.post(evt);
	}

	public focusblur (evt: FocusEvent) {
		if (!this.blurEvent) return;
		this.blurEvent.post(evt);
	}

	public submit (evt: Event) {
		if (!this.submitEvent) return;
		this.submitEvent.post(evt);
	}

	// helpers
	public onKeydown (cb: () => void) {
		if (this.keydownEvent) this.keydownEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onkeydown = this.keydown.bind(this);
	}

	public onKeypress (cb: () => void) {
		if (this.keypressEvent) this.keypressEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onkeypress = this.keypress.bind(this);
	}

	public onKeyup (cb: () => void) {
		if (this.keyupEvent) this.keyupEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onkeyup = this.keyup.bind(this);
	}

	public onFocus (cb: () => void) {
		if (this.focusEvent) this.focusEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onfocus = this.focus.bind(this);
	}

	public onBlur (cb: () => void) {
		if (this.blurEvent) this.blurEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onblur = this.focusblur.bind(this);
	}

	public onSubmit (cb: () => void) {
		if (this.submitEvent) this.submitEvent.attach(cb);
		const transform = getComponent<Transform>(this);
		transform.properties.onsubmit = this.submit.bind(this);
	}
}

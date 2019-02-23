import * as Fatina from 'fatina';

// tslint:disable:no-console
export class TransformTween {
	private moveTween: Fatina.ITween | undefined;
	private rotateTween: Fatina.ITween | undefined;
	private fadeTween: Fatina.ITween | undefined;

	private _moveTween (data: any, duration: number, autostart: boolean, autokill: boolean) {
		// console.log('Create MoveTween', this, data, duration, autostart, autokill);
		const self = this as any;
		const tween = Fatina.tween(self.position)
			// .onStart(() => console.log('move start', self.position))
			// .onComplete(() => console.log('move complete', self.position))
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad);

		if (self.refresh) tween.onUpdate(() => self.refresh());

		if (autostart) {
			if (autokill && this.moveTween) this.moveTween.kill();
			tween.start();
		}

		this.moveTween = tween;

		return tween;
	}

	public moveX (x = 0, duration = 250, autostart = true, autokill = false) {
		return this._moveTween({ x }, duration, autostart, autokill);
	}

	public moveY (y = 0, duration = 250, autostart = true, autokill = false) {
		return this._moveTween({ y }, duration, autostart, autokill);
	}

	public move (x = 0, y = 0, duration = 250, autostart = true, autokill = true) {
		return this._moveTween({ x, y }, duration, autostart, autokill);
	}

	private _fadeTween (data: any, duration: number, autostart: boolean, autokill: boolean) {
		// console.log('Create FadeTween', this, data, duration, autostart, autokill);
		const self = this as any;
		const tween = Fatina.tween(this)
			// .onStart(() => console.log('fade start', self.opacity))
			// .onComplete(() => console.log('fade complete', self.opacity))
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad);

		if (self.refresh) tween.onUpdate(() => self.refresh());

		if (autostart) {
			if (autokill && this.fadeTween) this.fadeTween.kill();
			tween.start();
		}

		this.fadeTween = tween;
		return tween;
	}

	public show (duration = 150, autostart = true, autokill = true) {
		return this._fadeTween({ opacity: 1 }, duration, autostart, autokill);
	}

	public hide (duration = 150, autostart = true, autokill = true) {
		return this._fadeTween({ opacity: 0 }, duration, autostart, autokill);
	}

	private _rotateTween (data: any, duration: number, autostart: boolean, autokill: boolean) {
		// console.log('Create FadeTween', this, data, duration, autostart, autokill);
		const self = this as any;
		const tween = Fatina.tween(this)
			// .onStart(() => console.log('fade start', self.opacity))
			// .onComplete(() => console.log('fade complete', self.opacity))
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad);

		if (self.refresh) tween.onUpdate(() => self.refresh());

		if (autostart) {
			if (autokill && this.rotateTween) this.rotateTween.kill();
			tween.start();
		}

		this.rotateTween = tween;
		return tween;
	}

	public rotate (duration = 150, autostart = true, autokill = true) {
		return this._fadeTween({ opacity: 1 }, duration, autostart, autokill);
	}
}

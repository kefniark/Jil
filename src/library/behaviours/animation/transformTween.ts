import * as Fatina from 'fatina';
import { getComponent } from '../../helpers';
import { JilNode, Transform } from '..';

// tslint:disable:no-console
export class TransformTween {
	private moveTween: Fatina.ITween | undefined;
	private rotateTween: Fatina.ITween | undefined;
	private fadeTween: Fatina.ITween | undefined;
	private blurTween: Fatina.ITween | undefined;

	private _moveTween (data: any, duration: number, autostart: boolean, autokill: boolean) {
		const transform = getComponent<Transform>(this);
		const node = getComponent<JilNode>(this);
		const tween = Fatina.tween(transform.position)
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad);

		tween.onUpdate(() => node.refresh());

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
		const node = getComponent<JilNode>(this);
		const tween = Fatina.tween(this)
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad);

		tween.onUpdate(() => node.refresh());

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

	public toggle (duration = 150, autostart = true, autokill = true) {
		const transform = getComponent<Transform>(this);
		if (transform.opacity === 1) {
			this.hide(duration, autostart, autokill);
		} else {
			this.show(duration, autostart, autokill);
		}
	}

	private _rotateTween (data: any, duration: number, autostart: boolean, autokill: boolean) {
		const node = getComponent<JilNode>(this);
		const tween = Fatina.tween(this)
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad);

		tween.onUpdate(() => node.refresh());

		if (autostart) {
			if (autokill && this.rotateTween) this.rotateTween.kill();
			tween.start();
		}

		this.rotateTween = tween;
		return tween;
	}

	public rotate (rotate: number, duration = 150, autostart = true, autokill = true) {
		return this._rotateTween({ rotation: rotate }, duration, autostart, autokill);
	}

	private _blurTween (data: any, duration: number, autostart: boolean, autokill: boolean) {
		const node = getComponent<JilNode>(this);
		const tween = Fatina.tween(this)
			.to(data, duration)
			.setEasing(Fatina.EasingType.InOutQuad);

		tween.onUpdate(() => node.refresh());

		if (autostart) {
			if (autokill && this.blurTween) this.blurTween.kill();
			tween.start();
		}

		this.blurTween = tween;
		return tween;
	}

	public blurAnimation (blur: number, duration = 150, autostart = true, autokill = true) {
		return this._blurTween({ blur }, duration, autostart, autokill);
	}
}

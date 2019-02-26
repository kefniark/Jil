import { Vector2, Vector2Extend } from '../../helpers';
import { resolution } from '../../config';

// tslint:disable-next-line:max-classes-per-file
export class Transform {
	public enable = true;

	// properties overwritable
	public anchor = new Vector2Extend();
	public pivot = new Vector2Extend();
	public position = new Vector2Extend();
	public size = new Vector2Extend();

	// local properties
	public positionPx = new Vector2();
	public sizePx = new Vector2();
	public scale = new Vector2();
	public opacity = 1;
	public rotation = 0;

	/**
	 * @ignore
	 */
	public resetStyle () {
		// tslint:disable:no-console

		const self = this as any;
		const handler = {
			set: (obj, prop, value) => {
				obj[prop] = value;
				if (self.refresh) self.refresh();
				return true;
			}
		};

		const handlerPos = {
			get: (obj, prop) => {
				if (prop !== 'x' && prop !== 'y') return obj[prop];
				return self.position[prop] * resolution[prop];
			},
			set: (obj, prop, value) => {
				if (prop !== 'x' && prop !== 'y') return obj[prop] = value;
				else self.position[prop] = value / resolution[prop];
				return true;
			}
		};

		const handlerSize = {
			get: (obj, prop) => {
				if (prop !== 'x' && prop !== 'y') return obj[prop];
				return self.size[prop] * resolution[prop];
			},
			set: (obj, prop, value) => {
				if (prop !== 'x' && prop !== 'y') return obj[prop] = value;
				else self.size[prop] = value / resolution[prop];
				return true;
			}
		};

		this.enable = true;

		this.anchor = new Proxy(new Vector2Extend(), handler);
		this.pivot = new Proxy(new Vector2Extend(), handler);
		this.position = new Proxy(new Vector2Extend(), handler);
		this.size = new Proxy(new Vector2Extend(1, 1), handler);

		this.positionPx = new Proxy(new Vector2(), handlerPos);
		this.sizePx = new Proxy(new Vector2(), handlerSize);
		this.scale = new Proxy(new Vector2(1, 1), handler);

		this.opacity = 1;
		this.rotation = 0;
	}

	/**
	 * @ignore
	 */
	public getStyle () {
		const x = ((this.anchor.x / this.size.x) - this.pivot.x + (this.position.x / this.size.x)) * 100;
		const y = ((this.anchor.y / this.size.y) - this.pivot.y + (this.position.y / this.size.y)) * 100;
		let transform = `translate(${x}%, ${y}%) `;

		if (this.scale.x !== 1 || this.scale.y !== 1) {
			transform += `scale(${this.scale.x}, ${this.scale.y}) `;
		}

		if (this.rotation !== 0) {
			transform += `rotate(${this.rotation}deg)`;
		}

		return {
			display: this.enable && this.opacity > 0 ? 'block' : 'none',
			width: `${this.size.x * 100}%`,
			height: `${this.size.y * 100}%`,
			transformOrigin: 'top left',
			opacity: this.opacity.toString(),
			transform,
			willChange: 'transform, opacity'
		};
	}
}

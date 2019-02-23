
import { Vector2 } from '../helpers/vector2';

// tslint:disable-next-line:max-classes-per-file
export class Transform {
	public enable = true;
	public anchor: Vector2 = undefined as any;
	public pivot: Vector2 = undefined as any;
	public position: Vector2 = undefined as any;
	public size: Vector2 = undefined as any;
	public scale: Vector2 = undefined as any;
	public opacity = 1;
	public rotation = 0;

	public resetStyle () {
		const self = this as any;
		const handler = {
			set: (obj, prop, value) => {
				obj[prop] = value;
				// tslint:disable-next-line:no-console
				if (self.refresh) self.refresh();
				return true;
			}
		};
		this.enable = true;
		this.anchor = new Proxy(new Vector2(), handler);
		this.pivot = new Proxy(new Vector2(), handler);
		this.position = new Proxy(new Vector2(), handler);
		this.size = new Proxy(new Vector2(1, 1), handler);
		this.scale = new Proxy(new Vector2(1, 1), handler);
		this.opacity = 1;
		this.rotation = 0;
	}

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

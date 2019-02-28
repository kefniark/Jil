import { Vector2 } from './vector2';

/**
 * Variant of Vector2
 * This is used by the layout system to overwrite user settings (position, size)
 *
 * @export
 * @class Vector2Extend
 */
export class Vector2Extend {
	private origin: Vector2;
	private overwrite: Vector2;

	get x (): number {
		if (this.overwrite.x > 0) return this.overwrite.x;
		return this.origin.x;
	}
	set x (val: number) {
		this.origin.x = val;
	}

	get y (): number {
		if (this.overwrite.y > 0) return this.overwrite.y;
		return this.origin.y;
	}
	set y (val: number) {
		this.origin.y = val;
	}

	public constructor (x?: number, y?: number) {
		this.origin = new Vector2(x, y);
		this.overwrite = new Vector2();
	}

	public set (x: number, y: number) {
		this.origin.set(x, y);
	}

	public enforce (x: number, y: number) {
		this.overwrite.set(x, y);
	}

	public clear () {
		this.overwrite.set(0, 0);
	}

	public toString () {
		return `[${this.x}:${this.y}]`;
	}
}

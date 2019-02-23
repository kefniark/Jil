export class Vector2 {
	public x = 0;
	public y = 0;

	public constructor (x?: number, y?: number) {
		if (x) this.x = x;
		if (y) this.y = y;
	}

	public set (x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

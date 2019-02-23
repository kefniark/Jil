export const types = {};
export function register (type: string, className: any) {
	types[type] = className;
}

export class Factory {
	public create (type: string, id: string, params?: any) {
		if (!types[type]) {
			throw new Error(`Cannot create type ${type}`);
		}
		const self = this as any;
		const child = new types[type](id, params, self, self._projector);
		self.addChild(child);
		return child;
	}
}

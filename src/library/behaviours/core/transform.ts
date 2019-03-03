import { Vector2, Vector2Extend, getComponent, getParamVec2, getParamVec2Extend, getParamNum } from '../../helpers';
import { resolution } from '../../config';
import { JilNode } from './node';
import { Factory } from './factory';
import { VNodeProperties } from 'maquette';
import { SyncEvent } from 'ts-events';

/**
 * @ignore
 */
export interface TransformParam {
	enable?: boolean;

	style?: Partial<CSSStyleDeclaration>;
	class?: string;

	position?: number[];
	size?: number[];
	scale?: number[];
	anchor?: number[];
	pivot?: number[];

	opacity?: number;
	rotation?: number;
	blur?: number;
}

// tslint:disable-next-line:max-classes-per-file
export class Transform {
	public enable = true;
	private createEvent = new SyncEvent<void>();
	private destroyEvent = new SyncEvent<void>();

	public get node (): JilNode {
		return getComponent<JilNode>(this);
	}

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
	public blur = 0;

	// element custom properties
	public classnames = '';
	private lastStyles: any = {};
	public styles: Partial<CSSStyleDeclaration> = {};
	public properties: VNodeProperties = {};

	/**
	 * @ignore
	 */
	public resetTransform (params: TransformParam) {
		// tslint:disable:no-console
		const self = this;
		const node = getComponent<JilNode>(this);

		const handler = {
			set: (obj, prop, value) => {
				obj[prop] = value;
				node.refresh();
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

		this.anchor = new Proxy(getParamVec2Extend(params, 'anchor'), handler);
		this.pivot = new Proxy(getParamVec2Extend(params, 'pivot'), handler);
		this.position = new Proxy(getParamVec2Extend(params, 'position'), handler);
		this.size = new Proxy(getParamVec2Extend(params, 'size', 1, 1), handler);

		this.positionPx = new Proxy(new Vector2(), handlerPos);
		this.sizePx = new Proxy(new Vector2(), handlerSize);
		this.scale = new Proxy(getParamVec2(params, 'scale', 1, 1), handler);

		this.opacity = getParamNum(params, 'opacity', 1);
		this.rotation = getParamNum(params, 'rotation', 0);
		this.blur = getParamNum(params, 'blur', 0);

		this.classnames = params.class || '';
		this.styles = params.style || {};
		this.properties = {};

		this.lastStyles = { rotation: 0, blur: 0, opacity: 0 };
		if (!this.createEvent) this.createEvent = new SyncEvent<void>();
		if (!this.destroyEvent) this.destroyEvent = new SyncEvent<void>();
	}

	private handlerAfterCreate () {
		if (this.createEvent) this.createEvent.post();
	}

	private handleAfterRemoved () {
		if (this.destroyEvent) this.destroyEvent.post();
	}

	public onLoad (cb: () => void) {
		if (this.createEvent) this.createEvent.attach(cb);
		this.properties.afterCreate = this.handlerAfterCreate.bind(this);
		console.log('onLoad', this.properties);
	}

	public onDestroy (cb: () => void) {
		if (this.destroyEvent) this.destroyEvent.attach(cb);
		this.properties.afterRemoved = this.handleAfterRemoved.bind(this);
		console.log('onDestroy', this.properties);
	}

	/**
	 * @ignore
	 */
	public getStyle () {
		const x = ((this.anchor.x / this.size.x) - this.pivot.x + (this.position.x / this.size.x)) * 100;
		const y = ((this.anchor.y / this.size.y) - this.pivot.y + (this.position.y / this.size.y)) * 100;

		const style: Partial<CSSStyleDeclaration> = {
			display: (!this.enable || this.opacity <= 0) ? 'none' : 'block'
		};

		if (this.size.x !== 1) style.width = `${this.size.x * 100}%`;
		if (this.size.y !== 1) style.height = `${this.size.y * 100}%`;

		let transform = '';
		if (x !== 0 || y !== 0) {
			transform += `translate(${x}%, ${y}%) `;
		}

		if (this.scale.x !== 1 || this.scale.y !== 1) {
			transform += `scale(${this.scale.x}, ${this.scale.y}) `;
		}

		if (this.rotation !== 0 || this.lastStyles.rotation !== this.rotation) {
			transform += `rotate(${this.rotation}deg)`;
		}

		let filter = '';
		if (this.blur !== 0 || this.lastStyles.blur !== this.blur) {
			filter += `blur(${this.blur}px) `;
		}

		if (transform) style.transform = transform;
		if (filter) style.filter = filter;
		if (this.opacity !== 1 || this.lastStyles.opacity !== this.opacity) style.opacity = this.opacity.toString();

		this.lastStyles = {
			rotation: this.rotation,
			opacity: this.opacity,
			blur: this.blur
		};

		return style;
	}

	public getClassnames () {
		const factory = getComponent<Factory>(this);
		const classes = [this.node.type, this.classnames];
		if (factory.getClassname) {
			classes.push(factory.getClassname(this.node.type));
		}
		return classes.filter((x) => x && x.length > 0)
			.map((x) => x.toString().trim())
			.join(' ').trim();
	}

	public getProperties (prop: VNodeProperties): VNodeProperties {
		const data = {
			id: this.node.id,
			key: this.node.id,
			styles: Object.assign(this.getStyle(), this.styles),
			class: this.getClassnames()
		};
		// tslint:disable-next-line:prefer-object-spread
		return Object.assign(prop, this.properties, data);
	}
}

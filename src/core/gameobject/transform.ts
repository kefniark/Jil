import { EntityStore, IComponentData } from "kaaya"
import { Component } from "./component"
import { Vector2, Vector3 } from "../../core/math"

export interface ITransformData extends IComponentData {
	position: number[]
	rotation: number[]
	scale: number[]

	anchor: number[]
	pivot: number[]
	size: number[]
}

export class TransformComponent extends Component {
	private _position: Vector2
	get position(): Vector2 {
		return this._position
	}

	private _rotation: Vector3
	get rotation(): Vector3 {
		return this._rotation
	}

	private _scale: Vector2
	get scale(): Vector2 {
		return this._scale
	}

	private _anchor: Vector2
	get anchor(): Vector2 {
		return this._anchor
	}

	private _size: Vector2
	get size(): Vector2 {
		return this._size
	}

	private _pivot: Vector2
	get pivot(): Vector2 {
		return this._pivot
	}

	constructor(store: EntityStore, data: ITransformData) {
		if (!data.type) data.type = "Transform"
		super(store, data)

		const transformDataDefault = {
			position: [0, 0],
			rotation: [0, 0, 0],
			scale: [1, 1],

			anchor: [0.5, 0.5],
			pivot: [0.5, 0.5],
			size: [1, 1]
		} as ITransformData

		this.data = Object.assign({}, transformDataDefault, data)
	}

	created() {
		super.created()
		const transData = this.data as ITransformData

		this._position = new Vector2(this, () => transData.position)
		this._rotation = new Vector3(this, () => transData.rotation)
		this._scale = new Vector2(this, () => transData.scale)
		this._pivot = new Vector2(this, () => transData.pivot)
		this._anchor = new Vector2(this, () => transData.anchor)
		this._size = new Vector2(this, () => transData.size)
	}

	toCss(): Partial<CSSStyleDeclaration> {
		const x = (this.anchor.x / this.size.x - this.pivot.x + this.position.x / this.size.x) * 100
		const y = (this.anchor.y / this.size.y - this.pivot.y + this.position.y / this.size.y) * 100

		const style: Partial<CSSStyleDeclaration> = {}

		if (this.size.x !== 1) style.width = `${this.size.x * 100}%`
		if (this.size.y !== 1) style.height = `${this.size.y * 100}%`

		let transform = ""

		if (this.anchor.x != 0.5 && this.anchor.y != 0.5) {
			style.transformOrigin = `${this.anchor.x * 100}% ${this.anchor.y * 100}%`
		}

		if (x !== 0 || y !== 0) {
			transform += `translate(${x}%, ${y}%) `
		}

		if (this.rotation.z !== 0) {
			transform += `rotate(${this.rotation.z}deg)`
		}

		if (this.scale.x !== 1 || this.scale.y !== 1) {
			transform += `scale(${this.scale.x}, ${this.scale.y}) `
		}

		if (transform) style.transform = transform

		return style
	}
}

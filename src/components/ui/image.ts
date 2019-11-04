import { EntityStore, IComponentData } from "kaaya"
import { Component } from "../../core/gameobject"
import { el, setAttr, setStyle } from "redom"

export interface IImageData extends IComponentData {
	opacity: number
	src: string
}

export class ImageComponent extends Component {
	constructor(store: EntityStore, data: IImageData) {
		if (!data.type) data.type = "Image"
		super(store, data)
		const sceneDataDefault = {
			src: "https://pixijs.io/examples/examples/assets/bunny.png",
			opacity: 1
		} as IImageData
		this.data = Object.assign({}, sceneDataDefault, data)

		const root = window as any
		root.image = (root.image || 0) + 1
	}

	updateStyle() {
		const data = this.data as IImageData
		setAttr(this._element, "src", data.src)
		setStyle(this._element, { opacity: data.opacity })
	}

	render() {
		if (!this._element) {
			this._element = el("img", {
				id: this.data.id,
				key: this.data.id,
				class: "image"
			})
			this.updateStyle()
			return this._element
		}
		return this._element
	}
}

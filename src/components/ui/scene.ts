import { EntityStore, IComponentData } from "kaaya"
import { Component } from "../../core/gameobject"
import { el, setChildren, setStyle, setAttr } from "redom"

export interface ISceneData extends IComponentData {}

export class SceneComponent extends Component {
	constructor(store: EntityStore, data: any) {
		if (!data.type) data.type = "Scene"
		super(store, data)
		const sceneDataDefault = {} as ISceneData
		this.data = Object.assign({}, sceneDataDefault, data)

		window.addEventListener("resize", () => this.refreshStyle())
	}

	created() {
		super.created()
		this.gameobject.onRender.on(() => this.refreshStyle())
	}

	refreshStyle() {
		const ratio = Math.min(
			this.store.data.settings.container.height / this.store.data.settings.resolution.height,
			this.store.data.settings.container.width / this.store.data.settings.resolution.width
		)

		var classes = ["scene"]
		if (!this.gameobject.enable) classes.push("disabled")
		setAttr(this._element, "class", classes.join(" "))

		var css = Object.assign(this.transform.toCss(), {
			width: `${this.store.data.settings.resolution.width}px`,
			height: `${this.store.data.settings.resolution.height}px`,
			transformOrigin: `top left`,
			transform: `scale(${ratio})`
		})

		setStyle(this._element, css)
	}

	render() {
		if (!this._element) {
			this._element = el(
				"div",
				{
					id: this.data.id,
					key: this.data.id
				},
				this.gameobject.childs.map(child => child.render())
			)
			this.refreshStyle()
			return this._element
		}

		setChildren(this._element, this.gameobject.childs.map(child => child.render()))
		this.refreshStyle()
		return this._element
	}
}

import { EntityStore, IComponentData } from "kaaya"
import { Component } from "../../core/gameobject"
import { el } from "redom"

export interface IButtonData extends IComponentData {
	text: string
	disabled: boolean
}

export class ButtonComponent extends Component {
	constructor(store: EntityStore, data: IButtonData) {
		if (!data.type) data.type = "Button"
		super(store, data)
		const sceneDataDefault = {
			text: "Button",
			disabled: false
		} as IButtonData
		this.data = Object.assign({}, sceneDataDefault, data)
	}

	getClass() {
		const data = this.data as IButtonData
		var classes = ["Button"]
		if (data.disabled) classes.push("disabled")
	}

	render() {
		if (!this._element) {
			this._element = el(
				"button",
				{
					id: this.data.id,
					key: this.data.id,
					class: "Button"
				},
				(this.data as IButtonData).text
			)
			return this._element
		}
		const btn = this._element as HTMLButtonElement
		btn.textContent = (this.data as IButtonData).text
		return this._element
	}
}

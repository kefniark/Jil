import { EntityStore, IComponentData } from "kaaya"
import { Component } from "../../core/gameobject"
import { el } from "redom"

export interface IPanelData extends IComponentData {}

export class PanelComponent extends Component {
	constructor(store: EntityStore, data: any) {
		if (!data.type) data.type = "Panel"
		super(store, data)
		const sceneDataDefault = {} as IPanelData
		this.data = Object.assign({}, sceneDataDefault, data)
	}

	render() {
		if (!this._element) {
			this._element = el("span", {
				id: this.id,
				key: this.id,
				class: "panel"
			})
		}
		return this._element
	}
}

import { EntityStore, IComponentData } from "kaaya"
import { Component } from "../../core/gameobject"
import { el } from "redom"

export interface IGridLayoutData extends IComponentData {
	row: number
	col: number
	cellWidth: number
	cellHeight: number
}

export class GridLayoutComponent extends Component {
	get row() {
		return this.data.row
	}
	set row(val: number) {
		this.watchedData.row = val
	}

	get col() {
		return this.data.col
	}
	set col(val: number) {
		this.watchedData.col = val
	}

	protected data: IGridLayoutData

	constructor(store: EntityStore, data: IGridLayoutData) {
		if (!data.type) data.type = "GridLayout"
		super(store, data)
		const sceneDataDefault = {
			row: 0,
			col: 0,
			cellWidth: 0,
			cellHeight: 0
		} as IGridLayoutData
		this.data = Object.assign({}, sceneDataDefault, data)
	}

	created() {
		super.created()
		this.gameobject.onRender.on(() => this.render())
	}

	render() {
		var row = 0
		var col = 0
		for (var child of this.gameobject.childs) {
			const transform = child.transform

			if (this.data.cellWidth > 0) {
				transform.size.x = this.data.cellWidth
			} else {
				transform.size.x = this.data.col > 0 ? 1 / this.data.col : 1
			}

			if (this.data.cellHeight > 0) {
				transform.size.y = this.data.cellHeight
			} else {
				transform.size.y = this.data.row > 0 ? 1 / this.data.row : 1
			}

			transform.position.x = row * transform.size.x - 0.5 + transform.size.x / 2
			transform.position.y = col * transform.size.y - 0.5 + transform.size.y / 2

			if (this.data.row > 0) {
				row++
				if (row >= this.data.row) {
					row = 0
					col++
				}
			} else if (this.data.col > 0) {
				col++
				if (col >= this.data.col) {
					col = 0
					row++
				}
			}
		}

		if (!this._element) {
			this._element = el("span", {
				id: this.id,
				key: this.id,
				class: "grid"
			})
		}
		return this._element
	}
}

import { EntityStore, IComponentData } from "kaaya"
import { uid } from "coopa"
import { GameObject } from "./gameobject"
import { RedomElement } from "redom"
import Fatina from "fatina"

export class Component {
	protected _element: RedomElement

	get id() {
		return this.data.id
	}
	get name() {
		return this.data.type
	}
	get gameobject() {
		return this.store.getEntity<GameObject>(this.data.parentId)
	}
	get transform() {
		return this.gameobject.transform
	}
	protected get watchedData() {
		return this.store.getData(this.data.id)
	}

	protected store: EntityStore
	protected data: IComponentData
	dataDefault: IComponentData = {
		id: uid(),
		parentId: "",
		type: "",
		enable: true
	}

	constructor(store: EntityStore, data: IComponentData) {
		this.store = store
		this.data = Object.assign({}, this.dataDefault, data)
	}

	created() {
		const parent = this.store.getData(this.data.parentId)
		if (!parent) return
		if (this.data.type in parent.componentIds) return
		if (!this.store.created.has(this.id)) return
		parent.componentIds[this.data.type] = this.data.id

		const pa = this.store.getEntity<GameObject>(this.data.parentId)
		if (pa) pa.scheduleRender()
	}

	deleted() {
		const parent = this.store.getData(this.data.parentId)
		if (!parent || !parent.componentIds) return
		delete parent.componentIds[this.data.type]
	}

	tween() {
		return Fatina.tween(this.data).onUpdate(() => this.updateStyle())
	}

	mounted() {}

	unmounted() {}

	enabled() {}

	disabled() {}

	updateStyle() {}

	render(): RedomElement | undefined {
		return undefined
	}
}

import { el, setStyle, setAttr, setChildren, RedomElement } from "redom"
import { EntityStore, IEntityData } from "kaaya"
import { TransformComponent } from "./transform"
import { Component } from "./component"
import { uid, Event } from "coopa"
import { ImageComponent, IImageData, ButtonComponent, PanelComponent, IPanelData } from "../../components/ui"
import { IGridLayoutData, GridLayoutComponent } from "../../components/layout"
import Fatina from "fatina"

export interface IGameObjectData extends IEntityData {
	classnames: string[]
	opacity: number
}

export class GameObject {
	private _element: RedomElement
	public onRender: Event<void>

	get enable() {
		return this.data.enable
	}
	set enable(value: boolean) {
		this.watchedData.enable = value
		this.scheduleRender()
	}
	get id() {
		return this.data.id
	}
	get name() {
		return this.data.name
	}
	set name(value: string) {
		this.watchedData.name = value
	}
	get gameobject(): GameObject {
		return this.store.getEntity<GameObject>(this.data.id)
	}
	get transform() {
		return this.store.getEntity<TransformComponent>(this.data.componentIds["Transform"])
	}
	get parent() {
		return this.store.getEntity<GameObject>(this.data.parentId)
	}
	get components() {
		return Object.values(this.data.componentIds).map(x => this.store.getEntity<Component>(x))
	}
	get childs() {
		return this.data.childIds.map(x => this.store.getEntity<GameObject>(x))
	}
	protected get watchedData() {
		return this.store.getData(this.data.id)
	}

	store: EntityStore
	data: IGameObjectData
	dataDefault: IGameObjectData = {
		id: uid(),
		name: "gameobject",
		parentId: "",
		childIds: [],
		componentIds: {},
		enable: true,
		classnames: [],
		opacity: 1
	}

	constructor(store: EntityStore, data: IGameObjectData) {
		this.store = store
		this.data = Object.assign({}, this.dataDefault, data)
		this.onRender = new Event<void>()
	}

	tween() {
		return Fatina.tween(this.data).onUpdate(() => this.updateStyle())
	}

	shake() {
		return Fatina.shake(this.transform, {
			amplitude: 0.3,
			duration: 500
		})
			.onUpdate(() => this.updateStyle())
			.start()
	}

	scale() {
		return Fatina.scale(this.transform, {
			amplitude: 0.3,
			duration: 500
		})
			.onUpdate(() => this.updateStyle())
			.start()
	}

	wobble() {
		return Fatina.wobble(this.transform, {
			amplitude: 0.3,
			duration: 500
		})
			.onUpdate(() => this.updateStyle())
			.start()
	}

	getComponent<T extends Component>(id: string): T | undefined {
		return this.components.find(x => x.name.toLowerCase() === id.toLowerCase()) as T
	}

	created() {
		const parent = this.store.getData(this.data.parentId)
		if (!parent) return
		if (parent.childIds.indexOf(this.data.id) !== -1) return
		if (!this.store.created.has(this.id)) return
		parent.childIds.push(this.data.id)

		const pa = this.store.getEntity<GameObject>(this.data.parentId)
		if (pa) pa.scheduleRender()
	}

	deleted() {
		const parent = this.store.getData(this.data.parentId)
		if (!parent || !parent.childIds) return
		parent.childIds = parent.childIds.filter((x: string) => x !== this.id)
		for (const componentId of Object.values(this.data.componentIds)) {
			this.store.delete(componentId)
		}
		for (const childId of this.data.childIds) {
			this.store.delete(childId)
		}
	}

	createPanel(params: Partial<IPanelData> = {}): PanelComponent {
		const id = uid()
		const panelId = uid()

		this.store.create("gameobject", { id, parentId: this.gameobject.id })
		this.store.create("transform", { parentId: id })
		this.store.create("panel", Object.assign({ id: panelId, parentId: id }, params))

		return this.store.getEntity<PanelComponent>(panelId)
	}

	createImage(params: Partial<IImageData> = {}): ImageComponent {
		const id = uid()
		const imageId = uid()

		this.store.create("gameobject", { id, parentId: this.gameobject.id })
		this.store.create("transform", { parentId: id })
		this.store.create("image", Object.assign({ id: imageId, parentId: id }, params))

		return this.store.getEntity<ImageComponent>(imageId)
	}

	createImageComponent(params: Partial<IImageData> = {}): ImageComponent {
		const imageId = uid()
		this.store.create("image", Object.assign({ id: imageId, parentId: this.gameobject.id }, params))

		return this.store.getEntity<ImageComponent>(imageId)
	}

	createButton(): ButtonComponent {
		const id = uid()
		const buttonId = uid()

		this.store.create("gameobject", { id, parentId: this.gameobject.id })
		this.store.create("transform", { parentId: id })
		this.store.create("button", { id: buttonId, parentId: id })

		return this.store.getEntity<ButtonComponent>(buttonId)
	}

	createGridLayout(params: Partial<IGridLayoutData> = {}): GridLayoutComponent {
		const id = uid()
		this.store.create("gridlayout", Object.assign({ id, parentId: this.gameobject.id }, params))
		return this.store.getEntity<GridLayoutComponent>(id)
	}

	private getStyles() {
		const styles: Partial<CSSStyleDeclaration> = {}
		if (this.data.opacity !== 1) styles.opacity = this.data.opacity.toString()
		const transform = this.transform.toCss()
		return Object.assign(styles, transform)
	}

	scheduleRender() {
		Fatina.setTimeout(() => this.render(), 1)
	}

	private renderChild(): RedomElement[] {
		const comp = this.gameobject.components.map(child => child.render()).filter(x => !!x) as RedomElement[]
		const childs = this.gameobject.childs.map(child => child.render()).filter(x => !!x) as RedomElement[]
		return [...comp, ...childs]
	}

	updateChilds() {
		setChildren(this._element, this.renderChild())
	}

	updateStyle() {
		var classes = ["gameobject", ...this.data.classnames]
		if (!this.data.enable) classes.push("disabled")
		setAttr(this._element, "class", classes.join(" "))
		setStyle(this._element, this.getStyles())
	}

	render(): RedomElement {
		var classes = ["gameobject", ...this.data.classnames]
		if (!this.data.enable) classes.push("disabled")
		if (!this._element) {
			this._element = el(
				"div",
				{
					id: this.data.id,
					key: this.data.id
				},
				this.renderChild()
			)
			this.updateStyle()
			return this._element
		}
		this.updateChilds()
		this.updateStyle()
		this.onRender.emit()
		return this._element
	}
}

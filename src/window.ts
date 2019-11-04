import { el, mount, RedomElement, setChildren, setStyle } from "redom"
import Kaaya, { EntityStore } from "kaaya"
import { math, uid, StringExt } from "coopa"
import { ButtonComponent, ImageComponent, PanelComponent, SceneComponent } from "./components/ui"
import { GridLayoutComponent } from "./components/layout"
import { GameObject, TransformComponent } from "./core/gameobject"
import Fatina from "fatina"

export interface ISettings {
	scene: {
		active: string
	}
	resolution: {
		width: number
		height: number
	}
	container: {
		width: number
		height: number
	}
	styles: Partial<CSSStyleDeclaration>
}

export class Window {
	html: HTMLElement
	sceneIds: string[]

	private _element: RedomElement
	private _store: EntityStore
	get settings() {
		return this._store.data.settings as ISettings
	}

	constructor(html: HTMLElement) {
		this.html = html
		this.sceneIds = []

		this._store = Kaaya.createEntityStore()
		this._store.data.settings = {
			scene: {
				active: ""
			},
			resolution: {
				width: 1280,
				height: 720
			},
			container: {
				width: 0,
				height: 0
			},
			styles: {
				position: "absolute",
				width: "100vw",
				height: "100vh",
				top: "0px",
				left: "0px"
			}
		} as ISettings
		// this._store.observe(mut => console.log(mut))

		console.log("youhou ! ")
		// core
		this._store.register("gameobject", (store, data) => new GameObject(store, data))
		this._store.register("transform", (store, data) => new TransformComponent(store, data))

		// components
		this._store.register("scene", (store, data) => new SceneComponent(store, data))
		this._store.register("image", (store, data) => new ImageComponent(store, data))
		this._store.register("panel", (store, data) => new PanelComponent(store, data))
		this._store.register("button", (store, data) => new ButtonComponent(store, data))

		// layouts
		this._store.register("gridlayout", (store, data) => new GridLayoutComponent(store, data))

		this._element = this.render()
		mount(html, this._element)

		window.addEventListener("resize", () => this.refreshSize())
		this.refreshSize()
	}

	refreshSize() {
		const ratio = this.html.clientWidth / this.html.clientHeight
		this.settings.container.width = this.html.clientWidth
		this.settings.container.height = this.html.clientHeight
		const expected = this.settings.resolution.width / this.settings.resolution.height
		if (math.numberEqual(ratio, expected)) return
		if (ratio > expected) {
			this.settings.styles.height = `100vh`
			this.settings.styles.width = `${100 * expected}vh`
			this.settings.styles.top = `0px`
			this.settings.styles.left = `${(this.html.clientWidth - this.html.clientHeight * expected) / 2}px`
		} else {
			this.settings.styles.width = `100vw`
			this.settings.styles.height = `${100 / expected}vw`
			this.settings.styles.top = `${(this.html.clientHeight - this.html.clientWidth / expected) / 2}px`
			this.settings.styles.left = `0px`
		}
		this.render()
	}

	createScene(id: string): SceneComponent {
		this.sceneIds.push(id)

		const sceneId = uid()
		this._store.create("gameobject", { id, enable: false })
		this._store.create("transform", { parentId: id })
		this._store.create("scene", { id: sceneId, parentId: id })

		this.scheduleRender()

		if (StringExt.isNullOrEmpty(this.settings.scene.active)) {
			this.switchScene(id)
		}

		return this._store.getEntity<SceneComponent>(sceneId)
	}

	switchScene(id: string) {
		if (StringExt.isNullOrEmpty(id)) throw new Error(`Wrong parameters`)
		if (this.settings.scene.active === id) throw new Error(`Wrong parameters`)

		if (!StringExt.isNullOrEmpty(this.settings.scene.active)) {
			const prev = this._store.getEntity<GameObject>(this.settings.scene.active)
			prev.enable = false
		}
		this.settings.scene.active = id
		const go = this._store.getEntity<GameObject>(id)
		go.enable = true
	}

	deleteScene(id: string): void {
		this._store.delete(id)
		this.scheduleRender()
	}

	getStyle() {
		return {
			position: this.settings.styles.position,
			width: this.settings.styles.width,
			height: this.settings.styles.height,
			top: this.settings.styles.top,
			left: this.settings.styles.left
		}
	}

	scheduleRender() {
		Fatina.setTimeout(() => this.render(), 50)
	}

	renderChild(): RedomElement[] {
		return this.sceneIds.map(id => {
			var scene = this._store.getEntity<GameObject>(id).components.find(x => x.name === "Scene") as SceneComponent
			return scene.render()
		})
	}

	updateChildren() {
		setChildren(this._element, this.renderChild())
	}

	updateStyle() {
		setStyle(this._element, this.getStyle())
	}

	render() {
		if (!this._element) {
			this._element = el(
				"div",
				{
					id: "window",
					class: "window"
				},
				this.renderChild()
			)
			this.updateStyle()
			return this._element
		}
		this.updateChildren()
		this.updateStyle()
		return this._element
	}
}

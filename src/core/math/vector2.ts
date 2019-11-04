import Fatina, { ITween } from "fatina"
import { Component } from "../../core/gameobject"

export class Vector2 {
	private getter: () => number[]
	private parent: Component

	get x() {
		return this.getter()[0]
	}
	set x(val: number) {
		this.getter()[0] = val
	}

	get y() {
		return this.getter()[1]
	}
	set y(val: number) {
		this.getter()[1] = val
	}

	constructor(parent: Component, getter: () => number[]) {
		this.parent = parent
		this.getter = getter
	}

	set(x: number = 0, y: number = 0) {
		this.x = x
		this.y = y
	}

	setPx(x: number = 0, y: number = 0) {
		this.set(x / 1280, y / 720)
	}

	add(x: number = 0, y: number = 0) {
		this.x += x
		this.y += y
	}

	addPx(x: number = 0, y: number = 0) {
		this.add(x / 1280, y / 720)
	}

	scale(x: number = 0, y: number = 0) {
		this.x *= x
		this.y *= y
	}

	tween(): ITween {
		return Fatina.tween(this).onUpdate(() => this.parent.gameobject.updateStyle())
	}
}

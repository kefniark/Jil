import Fatina, { ITween } from "fatina"
import { Component } from "../../core/gameobject"

export class Vector3 {
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

	get z() {
		return this.getter()[2]
	}
	set z(val: number) {
		this.getter()[2] = val
	}

	constructor(parent: Component, getter: () => number[]) {
		this.parent = parent
		this.getter = getter
	}

	set(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x
		this.y = y
		this.z = z
	}

	add(x: number = 0, y: number = 0, z: number = 0) {
		this.x += x
		this.y += y
		this.z += z
	}

	scale(x: number = 0, y: number = 0, z: number = 0) {
		this.x *= x
		this.y *= y
		this.z *= z
	}

	tween(): ITween {
		return Fatina.tween(this).onUpdate(() => this.parent.gameobject.updateStyle())
	}
}

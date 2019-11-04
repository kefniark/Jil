// Prefab
// Window
// Scene
// -> UI Components
// 	-> Layer
// 	-> Image
// 	-> Text
// 	-> Interactable

import { Window } from "./window"

export function initialize(app: HTMLElement): Window {
	return new Window(app)
}

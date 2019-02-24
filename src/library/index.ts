import { Scene } from './components/scene';
import { Layer } from './components/layer';
import { Button } from './components/button';
import { Panel } from './components/panel';
import { Image } from './components/image';
import { Text } from './components/text';
import { Canvas } from './components/canvas';

import { register } from './behaviours/factory';
import { createProjector, h } from 'maquette';
import { FadeInOut } from './transitions/sceneTransition';
import * as Fatina from 'fatina';

// export class
export { Scene, Button, Panel, Layer, Text, Canvas };

// register to factory
register('button', Button);
register('panel', Panel);
register('layer', Layer);
register('image', Image);
register('text', Text);
register('canvas', Canvas);

// tslint:disable:no-console
/**
 * @ignore
 */
const scenes: {[id: string]: Scene} = {};
/**
 * @ignore
 */
const sceneList: Scene[] = [];
(window as any).scene = {
	init () {
		Fatina.init();
		this.projector = createProjector();
		const vdom = () => h('div', { id: 'root' }, sceneList.map((x) => x.render()));
		this.projector.append(document.body, vdom);
	},

	create (id: string) {
		console.log('create', id);
		scenes[id] = new Scene(id, this.projector);
		sceneList.push(scenes[id]);
		this.projector.scheduleRender();
		return scenes[id];
	},

	use (id: string) {
		console.log('use', id);
		if (this.current === scenes[id]) return;

		FadeInOut(this.current, scenes[id]);

		this.current = scenes[id];
	}
};

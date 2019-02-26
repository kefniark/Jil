// tslint:disable:no-duplicate-imports
import * as test from 'tape';
import { Test } from 'tape';
import { SceneManager } from '../src/library';

test('Test SceneManager', (t: Test) => {
	// tslint:disable-next-line:no-console
	SceneManager.init();

	SceneManager.create('new1');
	SceneManager.create('new2');
	SceneManager.use('new 1');

	t.end();
});

test('Test SceneManager', (t: Test) => {
	// tslint:disable-next-line:no-console
	SceneManager.init();

	const scene = SceneManager.create('new1');
	const layer1 = scene.createLayer('layer1');
	scene.createLayer('layer2');

	layer1.createCanvas('canvasId');
	layer1.createImage('imageId');
	layer1.createButton('buttonId');
	layer1.createPanel('panelId');
	layer1.createText('textId');

	SceneManager.use('new 1');
	scene.render();

	t.end();
});

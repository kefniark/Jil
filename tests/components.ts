// tslint:disable:no-duplicate-imports
import * as test from 'tape';
import { Test } from 'tape';
import { SceneManager } from '../src/library';
import * as Fatina from 'fatina';
import { LayoutType } from '../src/library/behaviours/layout/layout';

const getData = () => {
	SceneManager.init();

	const scene = SceneManager.create('scene');
	const layer = scene.createLayer('layer1');

	scene.createLayer('layer2');
	scene.createLayer('layer3');

	return { scene, layer };
};

test('Test Tweens', (t: Test) => {
	const data = getData();

	// move
	data.layer.moveX(5, 1);
	data.layer.moveY(5, 1);
	Fatina.update(10);

	t.equal(data.layer.position.x, 5);
	t.equal(data.layer.position.y, 5);

	data.layer.move(10, 10, 1);
	Fatina.update(10);

	t.equal(data.layer.position.x, 10);
	t.equal(data.layer.position.y, 10);

	data.layer.hide(1);
	Fatina.update(2);
	t.equal(data.layer.opacity, 0);

	data.layer.show(1);
	Fatina.update(2);
	t.equal(data.layer.opacity, 1);

	data.layer.rotate(1, 1);
	Fatina.update(2);
	t.equal(data.layer.rotation, 1);

	t.end();
});

test('Test Layout', (t: Test) => {
	const data = getData();

	const panel = data.layer.createPanel('panel');
	const img1 = panel.createImage('image1');
	panel.createImage('image2');

	panel.setLayout(LayoutType.Horizontal);

	t.equal(img1.size.x, 0.5);
	t.equal(img1.size.y, 1);
	t.end();
});

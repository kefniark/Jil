// tslint:disable:no-duplicate-imports
import * as test from 'tape';
import { Test } from 'tape';
import { SceneManager } from '../src/library';
import { isString } from '../src/library/helpers';

/**
 * Prepare a basic scene
 */
const getData = () => {
	SceneManager.init();

	const scene = SceneManager.create('scene');
	const layer = scene.createLayer('layer1');

	scene.createLayer('layer2');
	scene.createLayer('layer3');

	return { scene, layer };
};

test('Node Child/Parent', (t: Test) => {
	const data = getData();

	t.strictEqual(data.layer._parent, data.scene, 'check node.parent');
	t.ok(data.scene._childrens.indexOf(data.layer) !== -1, 'check node.childrens');
	t.equal(data.scene._childrens.length, 3, 'check all the childrens are added');

	t.strictEqual(data.scene.find('layer1'), data.layer, 'node.find');
	t.strictEqual(data.scene.findByType('layer'), data.layer, 'node.findByType');
	t.equal(data.scene.findAllByType('layer').length, 3, 'node.findAllByType');

	t.end();
});

test('Node Events', (t: Test) => {
	const data = getData();

	let removed = false;
	let destroyed = false;
	let refreshScene = false;
	let refreshLayer = false;

	data.scene.nodeEvent.attach((evt) => {
		if (evt === 'refresh') refreshScene = true;
		if (evt === 'removed') removed = true;
	});
	data.layer.nodeEvent.attach((evt) => {
		if (evt === 'refresh') refreshLayer = true;
		if (evt === 'destroyed') destroyed = true;
	});

	t.strictEqual(data.layer.transform, data.layer.node.transform);

	const dom = data.layer.render();
	data.layer.refresh();
	data.layer.destroy();

	t.notEqual(dom, '', 'check dom size');
	t.ok(refreshLayer, 'Check the layer was refresh');
	t.ok(destroyed, 'Check the layer was removed');
	t.ok(refreshScene, 'Check the Scene (parent) was refresh');
	t.ok(removed, 'Check the Scene (parent) received removed');
	t.equal(data.layer.toString(), '[UI layer1]', 'Check tostring');

	t.end();
});

test('Transform Properties', (t: Test) => {
	const data = getData();

	t.equal(data.layer.anchor.x, 0, 'transform property anchor.x');
	t.equal(data.layer.anchor.y, 0, 'transform property anchor.y');
	t.equal(data.layer.pivot.x, 0, 'transform property pivot.x');
	t.equal(data.layer.pivot.y, 0, 'transform property pivot.y');

	t.equal(data.layer.position.x, 0, 'transform property position.x');
	t.equal(data.layer.position.y, 0, 'transform property position.y');
	t.equal(data.layer.positionPx.x, 0, 'transform property positionPx.x');
	t.equal(data.layer.positionPx.y, 0, 'transform property positionPx.y');

	t.equal(data.layer.size.x, 1, 'transform property size.x');
	t.equal(data.layer.size.y, 1, 'transform property size.y');
	t.equal(data.layer.sizePx.x, 1280, 'transform property sizePx.x');
	t.equal(data.layer.sizePx.y, 720, 'transform property sizePx.y');

	t.equal(data.layer.scale.x, 1, 'transform property scale.x');
	t.equal(data.layer.scale.y, 1, 'transform property scale.y');
	t.equal(data.layer.opacity, 1, 'transform property opacity');
	t.equal(data.layer.rotation, 0, 'transform property rotation');

	const style1 = data.layer.getStyle();

	data.layer.position.set(0.5, 0.5);
	data.layer.positionPx.set(0.5, 0.5);
	data.layer.size.set(0.5, 0.5);
	data.layer.sizePx.set(0.5, 0.5);
	data.layer.scale.x = 0.3;
	data.layer.rotation = 1;
	data.layer.opacity = 0;

	const style2 = data.layer.getStyle();
	t.notEqual(style1, style2, 'check style properly changed');

	t.end();
});

test('Factory', (t: Test) => {
	const data = getData();

	data.layer.createCanvas('canvasId');
	data.layer.createImage('imageId');
	data.layer.createButton('buttonId');
	data.layer.createPanel('panelId');
	data.layer.createText('textId');
	data.layer.createRadio('radioId');
	data.layer.createCheckbox('checkboxId');
	data.layer.createSelect('selectId');
	data.layer.createInput('inputId');

	const dom = data.scene.render();
	t.notEqual(dom, '', 'check dom size');

	data.layer.hide(0);
	data.layer.render();

	t.end();
});

test('Helpers.isString', (t: Test) => {
	t.ok(isString('url'));
	t.notOk(isString({}));
	t.notOk(isString([]));
	t.notOk(isString(undefined));

	t.end();
});

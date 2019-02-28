// tslint:disable:no-duplicate-imports
import * as test from 'tape';
import { Test } from 'tape';
import { SceneManager } from '../src/library/sceneManager';
import * as Fatina from 'fatina';

test('Test SceneManager', (t: Test) => {
	SceneManager.init(1280, 720);

	const new1 = SceneManager.create('new1');
	const new2 = SceneManager.create('new2');
	SceneManager.use('new1');

	t.strictEqual(SceneManager.Current, new1, 'new1');

	Fatina.update(5000);

	t.ok(new1.enable);
	t.notOk(new2.enable);
	new1.enter();
	new2.leave();

	SceneManager.use('new2');

	Fatina.update(5000);

	t.strictEqual(SceneManager.Current, new2, 'new2');

	t.end();
});

test('Test Scene Event', (t: Test) => {
	SceneManager.init(720, 1280);

	const new1 = SceneManager.create('new1');
	const new2 = SceneManager.create('new2');

	let leave = false;
	let enter = false;

	new1.onLeave(() => leave = true);
	new2.onEnter(() => enter = true);
	SceneManager.use('new1');

	t.strictEqual(SceneManager.Current, new1, 'new1');

	SceneManager.use('new2');

	Fatina.update(5000);
	t.strictEqual(SceneManager.Current, new2, 'new2');

	new1.render();
	new2.render();

	t.ok(leave, 'scene 1 leave event');
	t.ok(enter, 'scene 2 enter event');

	t.end();
});

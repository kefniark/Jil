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

	SceneManager.use('new2');

	Fatina.update(5000);

	t.strictEqual(SceneManager.Current, new2, 'new2');

	t.end();
});

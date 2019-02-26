// tslint:disable:no-duplicate-imports
import * as test from 'tape';
import { Test } from 'tape';
import { SceneManager } from '../src/library/sceneManager';

test('Test SceneManager', (t: Test) => {
	// tslint:disable-next-line:no-console
	SceneManager.init();

	SceneManager.create('new1');
	SceneManager.create('new2');
	SceneManager.use('new 1');

	t.end();
});

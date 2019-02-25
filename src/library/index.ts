import { Layer } from './components/layer';
import { Button } from './components/button';
import { Panel } from './components/panel';
import { Image } from './components/image';
import { Text } from './components/text';
import { Canvas } from './components/canvas';

import { register } from './behaviours/factory';
import { SceneManager } from './sceneManager';

// export class
export { SceneManager };

// register to factory
register('button', Button);
register('panel', Panel);
register('layer', Layer);
register('image', Image);
register('text', Text);
register('canvas', Canvas);

import { JilLayer, JilScene } from '../components';
import * as Fatina from 'fatina';

export function FadeInOut (sceneSrc: JilScene | undefined, SceneDst: JilScene) {
	const sequence = Fatina.sequence();
	// tslint:disable:no-console
	sequence.appendCallback(() => console.log('Scene Transition Start', sceneSrc, SceneDst));
	if (sceneSrc) {
		const faderSrc = sceneSrc.createLayer(`FaderOut_${Math.round(Math.random() * 100000)}`, 'fader');
		faderSrc.opacity = 0;
		sequence.append(faderSrc.show(250, false));
		sequence.appendCallback(() => sceneSrc.leave());
		sequence.appendCallback(() => faderSrc.destroy());
	} else {
		sequence.appendInterval(500);
	}
	const faderDst = SceneDst.createLayer(`FaderIn_${Math.round(Math.random() * 100000)}`, 'fader');
	faderDst.opacity = 1;
	sequence.appendCallback(() => SceneDst.enter());

	const tween = faderDst.hide(350, false);
	tween.onUpdate(() => faderDst.refresh());
	sequence.append(tween);

	sequence.appendCallback(() => console.log('Scene Transition Finish', sceneSrc, SceneDst));
	sequence.appendCallback(() => faderDst.destroy());
	sequence.start();
}

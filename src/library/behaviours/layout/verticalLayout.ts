import { Layout } from './layout';
import { JilNode } from '../core/node';

export const verticalLayout = (container: Layout, childrens: JilNode[]) => {
	let j = 0;
	for (const child of childrens) {
		const childTr = child.transform;
		childTr.size.enforce(1, 1 / childrens.length);
		childTr.position.enforce(0, j / childrens.length);
		j++;
	}
};

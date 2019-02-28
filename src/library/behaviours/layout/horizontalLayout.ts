import { Layout } from './layout';
import { JilNode } from '../core/node';

export const horizontalLayout = (container: Layout, childrens: JilNode[]) => {
	let i = 0;
	for (const child of childrens) {
		const childTr = child.transform;
		childTr.size.enforce(1 / childrens.length, 1);
		childTr.position.enforce(i / childrens.length, 0);
		i++;
	}
};

import { Layout } from './layout';
import { JilNode } from '../core/node';

export const defaultLayout = (container: Layout, childrens: JilNode[]) => {
	childrens.forEach((x) => {
		x.transform.size.clear();
		x.transform.position.clear();
	});
};

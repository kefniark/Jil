import { Layout } from './layout';
import { JilNode } from '../core/node';

export const gridLayout = (container: Layout, childrens: JilNode[]) => {
	let col = 0;
	let row = 0;

	let rowSize = 1;
	let colSize = 1;
	if (container.layoutParams.rowNumber && container.layoutParams.colNumber) {
		colSize = container.layoutParams.colNumber;
		rowSize = container.layoutParams.rowNumber;
	} else if (container.layoutParams.colNumber) {
		colSize = container.layoutParams.colNumber;
		rowSize = Math.ceil(childrens.length / colSize);
	} else {
		rowSize = container.layoutParams.rowNumber ? container.layoutParams.rowNumber : 5;
		colSize = Math.ceil(childrens.length / rowSize);
	}

	for (const child of childrens) {
		const childTr = child.transform;
		childTr.size.enforce(1 / colSize, 1 / rowSize);
		childTr.position.enforce(col / colSize, row / rowSize);
		col++;
		if (col >= colSize) {
			col = 0;
			row++;
		}
	}
};

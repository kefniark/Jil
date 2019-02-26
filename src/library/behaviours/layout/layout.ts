import { Transform } from '../core/transform';
import { Node } from '../core/node';

export const enum LayoutType {
	Default = 'default',
	Horizontal = 'horizontal',
	Vertical = 'vertical',
	Grid = 'grid'
}

export interface ILayoutProps {
	width?: number;
	height?: number;
}

export class Layout {

	private layout: LayoutType = LayoutType.Default;
	private layoutProperties: ILayoutProps = {};

	public resetLayout () {
		const node = this as any as Node;
		if (node.nodeEvent) {
			node.nodeEvent.attach((evt) => {
				if (evt !== 'added' && evt !== 'removed') return;
				this.refreshLayout();
			});
		}
	}

	public setLayout (layout: LayoutType, props?: ILayoutProps) {
		this.layout = layout ? layout : LayoutType.Default;
		this.layoutProperties = props ? props : {};
		this.refreshLayout();
	}

	public refreshLayout () {
		const node = this as any as Node;
		switch (this.layout) {
		case LayoutType.Horizontal:
			let i = 0;
			for (const child of node._childrens) {
				const childTr = child as any as Transform;
				childTr.size.enforce(1 / node._childrens.length, 1);
				childTr.position.enforce(i / node._childrens.length, 0);
				i++;
			}
			break;
		case LayoutType.Vertical:
			let j = 0;
			for (const child of node._childrens) {
				const childTr = child as any as Transform;
				childTr.size.enforce(1, 1 / node._childrens.length);
				childTr.position.enforce(0, j / node._childrens.length);
				j++;
			}
			break;
		case LayoutType.Grid:
			let row = 0;
			let line = 0;
			const rowSize = Math.ceil(node._childrens.length / 2);
			for (const child of node._childrens) {
				const childTr = child as any as Transform;
				childTr.size.enforce(1 / rowSize, 1 / 2);
				childTr.position.enforce(row / rowSize, line / 2);
				row++;
				if (row >= rowSize) {
					row = 0;
					line++;
				}
			}
			break;
		}
	}
}

import { VNode, Projector } from 'maquette';
import { SyncEvent } from 'ts-events';
import { Transform } from './transform';
export declare class JilNode {
    id: string;
    type: string;
    readonly transform: Transform;
    /**
     * @ignore
     */
    _projector?: Projector;
    /**
     * @ignore
     */
    _parent?: JilNode;
    /**
     * @ignore
     */
    _childrens: JilNode[];
    /**
     * @ignore
     */
    nodeEvent: SyncEvent<string>;
    /**
     * @ignore
     */
    resetNode(type: string): void;
    addChild(element: JilNode): void;
    removeChild(element: JilNode): void;
    removeAllChilds(): void;
    destroy(): void;
    refresh(): void;
    /**
     * @ignore
     */
    render(): VNode;
    find(id: string): JilNode | undefined;
    findByType(type: string): JilNode | undefined;
    findAllByType(type: string): JilNode[];
    toString(): string;
}

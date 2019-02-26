import { VNode, Projector } from 'maquette';
import { SyncEvent } from 'ts-events';
export declare class Node {
    id?: string;
    /**
     * @ignore
     */
    _projector?: Projector;
    /**
     * @ignore
     */
    _parent?: Node;
    /**
     * @ignore
     */
    _childrens: Node[];
    private createEvent;
    private destroyEvent;
    /**
     * @ignore
     */
    nodeEvent: SyncEvent<string> | undefined;
    /**
     * @ignore
     */
    resetTransform(): void;
    protected handlerAfterCreate(): void;
    protected handleAfterRemoved(): void;
    onLoad(cb: () => void): void;
    onDestroy(cb: () => void): void;
    addChild(element: Node): void;
    removeChild(element: Node): void;
    destroy(): void;
    refresh(): void;
    /**
     * @ignore
     */
    render(): VNode;
    toString(): string;
}

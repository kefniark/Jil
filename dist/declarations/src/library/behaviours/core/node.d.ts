import { VNode, Projector } from 'maquette';
import { SyncEvent } from 'ts-events';
import { Transform } from './transform';
export declare class JilNode {
    id?: string;
    type?: string;
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
    private createEvent;
    private destroyEvent;
    /**
     * @ignore
     */
    nodeEvent: SyncEvent<string>;
    /**
     * @ignore
     */
    resetNode(type: string): void;
    protected handlerAfterCreate(): void;
    protected handleAfterRemoved(): void;
    onLoad(cb: () => void): void;
    onDestroy(cb: () => void): void;
    addChild(element: JilNode): void;
    removeChild(element: JilNode): void;
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

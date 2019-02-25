import { VNode, Projector } from 'maquette';
import { Node, Transform, Factory } from '../../behaviours';
import { Vector2 } from '../../helpers';
import { JilLayer } from './layer';
export interface JilScene extends Node, Transform, Factory {
}
export declare class JilScene {
    /**
     * @ignore
     */
    this: any;
    /**
     * Game Resolution (need to be remove)
     * @deprecated
     *
     * @type {Vector2}
     * @memberof Scene
     */
    resolution: Vector2;
    private enterEvent;
    private leaveEvent;
    constructor(id: string, projector: Projector);
    /**
     * Enter the scene
     *  - Make it visible
     *  - Trigger events
     *  - Refresh UI
     *
     * @returns
     * @memberof Scene
     */
    enter(): void;
    /**
     * Leave the scene
     *  - Hide it
     *  - Trigger events
     *  - Refresh UI
     *
     * @returns
     * @memberof Scene
     */
    leave(): void;
    /**
     * Create a new Layer in this scene
     *
     * @param id ID of the new layer (need to be unique)
     * @memberof Scene
     */
    createLayer: (id: string, classname?: string | undefined) => JilLayer;
    /**
     * Render the HTML
     * @ignore
     *
     * @returns {VNode}
     * @memberof Scene
     */
    render(): VNode;
    onEnter(cb: () => void): void;
    onLeave(cb: () => void): void;
}

import { VNode, Projector } from 'maquette';
import { JilNode, Transform, Factory, ITransformParam } from '../../behaviours';
import { JilLayer } from './layer';
import { JilAlert, JilAlertParams } from '../popup/alert';
export interface JilScene extends JilNode, Transform, Factory {
}
export declare class JilScene {
    /**
     * @ignore
     */
    this: any;
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
    createLayer: (id: string, params?: ITransformParam | undefined) => JilLayer;
    createAlertPopup: (id: string, params?: JilAlertParams | undefined) => JilAlert;
    alert(title: string, msg: string): void;
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

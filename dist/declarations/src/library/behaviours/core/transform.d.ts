import { Vector2, Vector2Extend } from '../../helpers';
import { JilNode } from './node';
import { VNodeProperties } from 'maquette';
/**
 * @ignore
 */
export interface TransformParam {
    enable?: boolean;
    style?: Partial<CSSStyleDeclaration>;
    class?: string;
    position?: number[];
    size?: number[];
    scale?: number[];
    anchor?: number[];
    pivot?: number[];
    opacity?: number;
    rotation?: number;
    blur?: number;
}
export declare class Transform {
    enable: boolean;
    private createEvent;
    private destroyEvent;
    readonly node: JilNode;
    anchor: Vector2Extend;
    pivot: Vector2Extend;
    position: Vector2Extend;
    size: Vector2Extend;
    positionPx: Vector2;
    sizePx: Vector2;
    scale: Vector2;
    opacity: number;
    rotation: number;
    blur: number;
    classnames: string;
    private lastStyles;
    styles: Partial<CSSStyleDeclaration>;
    properties: VNodeProperties;
    /**
     * @ignore
     */
    resetTransform(params: TransformParam): void;
    private handlerAfterCreate;
    private handleAfterRemoved;
    onLoad(cb: () => void): void;
    onDestroy(cb: () => void): void;
    /**
     * @ignore
     */
    getStyle(): Partial<CSSStyleDeclaration>;
    getClassnames(): string;
    getProperties(prop: VNodeProperties): VNodeProperties;
}

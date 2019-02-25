declare module "helpers/vector2" {
    export class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        set(x: number, y: number): void;
    }
}
declare module "config" {
    import { Vector2 } from "helpers/vector2";
    /**
     * @ignore
     */
    export const resolution: Vector2;
}
declare module "behaviours/node" {
    import { VNode, Projector } from 'maquette';
    export class Node {
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
}
declare module "behaviours/transform" {
    import { Vector2 } from "helpers/vector2";
    export class Transform {
        enable: boolean;
        anchor: Vector2;
        pivot: Vector2;
        position: Vector2;
        positionPx: Vector2;
        size: Vector2;
        sizePx: Vector2;
        scale: Vector2;
        opacity: number;
        rotation: number;
        /**
         * @ignore
         */
        resetStyle(): void;
        /**
         * @ignore
         */
        getStyle(): {
            display: string;
            width: string;
            height: string;
            transformOrigin: string;
            opacity: string;
            transform: string;
            willChange: string;
        };
    }
}
declare module "behaviours/factory" {
    export const types: {};
    export function register(type: string, className: any): void;
    export class Factory {
        /**
         * @ignore
         */
        create(type: string, id: string, params?: any): any;
    }
}
declare module "behaviours/transformTween" {
    import * as Fatina from 'fatina';
    export class TransformTween {
        private moveTween;
        private rotateTween;
        private fadeTween;
        private _moveTween;
        moveX(x?: number, duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
        moveY(y?: number, duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
        move(x?: number, y?: number, duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
        private _fadeTween;
        show(duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
        hide(duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
        private _rotateTween;
        rotate(duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
    }
}
declare module "components/layer" {
    import { Node } from "behaviours/node";
    import { Transform } from "behaviours/transform";
    import { VNode, Projector } from 'maquette';
    import { Factory } from "behaviours/factory";
    import { TransformTween } from "behaviours/transformTween";
    export interface Layer extends Node, Transform, Factory, TransformTween {
    }
    export class Layer {
        this: any;
        classname: string;
        constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
        createPanel: (id: string) => Node;
        createButton: (id: string, params: any) => Node;
        createImage: (id: string, params: any) => Node;
        createText: (id: string, params: any) => Node;
        createCanvas: (id: string, params: any) => Node;
        private resizeHandler;
        render(): VNode;
    }
}
declare module "behaviours/clickable" {
    export class Clickable {
        /**
         * @ignore
         */
        private clickEvent?;
        /**
         * @ignore
         */
        resetClickable(): void;
        click(): void;
        onClick(cb: () => void): void;
    }
}
declare module "components/button" {
    import { Node } from "behaviours/node";
    import { Transform } from "behaviours/transform";
    import { Clickable } from "behaviours/clickable";
    import { TransformTween } from "behaviours/transformTween";
    import { VNode, Projector } from 'maquette';
    export interface Button extends Node, Transform, Clickable, TransformTween {
    }
    export class Button {
        this: any;
        text: any;
        constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
        render(): VNode;
    }
}
declare module "components/panel" {
    import { Node } from "behaviours/node";
    import { Transform } from "behaviours/transform";
    import { VNode, Projector } from 'maquette';
    import { Factory } from "behaviours/factory";
    import { TransformTween } from "behaviours/transformTween";
    export interface Panel extends Node, Transform, Factory, TransformTween {
    }
    export class Panel {
        this: any;
        constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
        render(): VNode;
        createPanel: (id: string) => Node;
        createButton: (id: string, params: any) => Node;
        createImage: (id: string, params: any) => Node;
        createText: (id: string, params: any) => Node;
        createCanvas: (id: string, params: any) => Node;
    }
}
declare module "helpers/helpers" {
    export function isString(obj: any): boolean;
}
declare module "components/image" {
    import { Node } from "behaviours/node";
    import { Transform } from "behaviours/transform";
    import { Clickable } from "behaviours/clickable";
    import { VNode, Projector } from 'maquette';
    import { TransformTween } from "behaviours/transformTween";
    export interface Image extends Node, Transform, Clickable, TransformTween {
    }
    export class Image {
        this: any;
        src: any;
        styles: any;
        constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
        render(): VNode;
    }
}
declare module "components/text" {
    import { Node } from "behaviours/node";
    import { Transform } from "behaviours/transform";
    import { VNode, Projector } from 'maquette';
    import { TransformTween } from "behaviours/transformTween";
    export interface Text extends Node, Transform, TransformTween {
    }
    export class Text {
        this: any;
        text: any;
        styles: any;
        constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
        render(): VNode;
    }
}
declare module "components/canvas" {
    import { Node } from "behaviours/node";
    import { Transform } from "behaviours/transform";
    import { Clickable } from "behaviours/clickable";
    import { TransformTween } from "behaviours/transformTween";
    import { VNode, Projector } from 'maquette';
    export interface Canvas extends Node, Transform, Clickable, TransformTween {
    }
    export class Canvas {
        this: any;
        constructor(id: string, params: any, parent: Node, projector: Projector | undefined);
        render(): VNode;
    }
}
declare module "components/scene" {
    import { Node } from "behaviours/node";
    import { Transform } from "behaviours/transform";
    import { VNode, Projector } from 'maquette';
    import { Factory } from "behaviours/factory";
    import { Vector2 } from "helpers/vector2";
    export interface Scene extends Node, Transform, Factory {
    }
    export class Scene {
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
        createLayer: (id: string, classname?: string | undefined) => Node;
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
}
declare module "transitions/sceneTransition" {
    import { Scene } from "components/scene";
    export function FadeInOut(sceneSrc: Scene | undefined, SceneDst: Scene): void;
}
declare module "sceneManager" {
    import { Scene } from "components/scene";
    /**
     * Scene Manager Object (use UMD: Universal Module Definition)
     *
     * @remarks
     * - Import: `import { SceneManager } from 'jil';`
     * - Require: `const SceneManager = require('jil').SceneManager;`
     * - Web: `<script src="jil.js"></script> ... jil.SceneManager`
     */
    export class SceneManager {
        /**
         * Create the JIL root and append it to the document.body
         *
         * @param width Native width of the game
         * @param height Native height of the game
         */
        static init(width?: number, height?: number): void;
        /**
         * Create a new scene
         *
         * @param id SceneId (need to be unique)
         */
        static create(id: string): Scene;
        /**
         * Switch to a different scene
         *
         * @param id SceneId
         */
        static use(id: string): void;
    }
}

    export { SceneManager } from "sceneManager";

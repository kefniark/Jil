import { RedomElement } from "redom";
import { EntityStore, IEntityData } from "kaaya";
import { TransformComponent } from "./transform";
import { Component } from "./component";
import { Event } from "coopa";
import { ImageComponent, IImageData, ButtonComponent, PanelComponent, IPanelData } from "../../components/ui";
import { IGridLayoutData, GridLayoutComponent } from "../../components/layout";
export interface IGameObjectData extends IEntityData {
    classnames: string[];
    opacity: number;
}
export declare class GameObject {
    private _element;
    onRender: Event<void>;
    enable: boolean;
    readonly id: string;
    name: string;
    readonly gameobject: GameObject;
    readonly transform: TransformComponent;
    readonly parent: GameObject;
    readonly components: Component[];
    readonly childs: GameObject[];
    protected readonly watchedData: any;
    store: EntityStore;
    data: IGameObjectData;
    dataDefault: IGameObjectData;
    constructor(store: EntityStore, data: IGameObjectData);
    tween(): import("fatina").ITween;
    shake(): import("fatina").ITween;
    scale(): import("fatina").ITween;
    wobble(): import("fatina").ITween;
    getComponent<T extends Component>(id: string): T | undefined;
    created(): void;
    deleted(): void;
    createPanel(params?: Partial<IPanelData>): PanelComponent;
    createImage(params?: Partial<IImageData>): ImageComponent;
    createImageComponent(params?: Partial<IImageData>): ImageComponent;
    createButton(): ButtonComponent;
    createGridLayout(params?: Partial<IGridLayoutData>): GridLayoutComponent;
    private getStyles;
    scheduleRender(): void;
    private renderChild;
    updateChilds(): void;
    updateStyle(): void;
    render(): RedomElement;
}

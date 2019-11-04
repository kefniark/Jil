import { RedomElement } from "redom";
import { SceneComponent } from "./components/ui";
export interface ISettings {
    scene: {
        active: string;
    };
    resolution: {
        width: number;
        height: number;
    };
    container: {
        width: number;
        height: number;
    };
    styles: Partial<CSSStyleDeclaration>;
}
export declare class Window {
    html: HTMLElement;
    sceneIds: string[];
    private _element;
    private _store;
    readonly settings: ISettings;
    constructor(html: HTMLElement);
    refreshSize(): void;
    createScene(id: string): SceneComponent;
    switchScene(id: string): void;
    deleteScene(id: string): void;
    getStyle(): {
        position: string | null | undefined;
        width: string | null | undefined;
        height: string | null | undefined;
        top: string | null | undefined;
        left: string | null | undefined;
    };
    scheduleRender(): void;
    renderChild(): RedomElement[];
    updateChildren(): void;
    updateStyle(): void;
    render(): RedomElement;
}

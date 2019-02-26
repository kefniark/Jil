export declare const enum LayoutType {
    Default = "default",
    Horizontal = "horizontal",
    Vertical = "vertical",
    Grid = "grid"
}
export interface ILayoutProps {
    width?: number;
    height?: number;
}
export declare class Layout {
    private layout;
    private layoutProperties;
    resetLayout(): void;
    setLayout(layout: LayoutType, props?: ILayoutProps): void;
    refreshLayout(): void;
}

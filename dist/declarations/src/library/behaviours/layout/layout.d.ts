export interface ILayoutOption {
    preferedWidth?: number;
    preferedHeight?: number;
    paddingWidth?: number;
    paddingHeight?: number;
    scrollable?: boolean;
    rowNumber?: number;
    colNumber?: number;
}
export declare class Layout {
    layout: string;
    layoutParams: ILayoutOption;
    resetLayout(): void;
    setLayout(layout: string, params?: ILayoutOption): void;
    refreshLayout(): void;
}

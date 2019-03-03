export interface LayoutOption {
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
    layoutParams: LayoutOption;
    resetLayout(): void;
    setLayout(layout: string, params?: LayoutOption): void;
    refreshLayout(): void;
}

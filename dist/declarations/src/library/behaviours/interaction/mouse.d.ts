export declare class MouseEvents {
    /**
     * @ignore
     */
    private mousedownEvent?;
    private mouseupEvent?;
    private mouseenterEvent?;
    private mouseleaveEvent?;
    private mousemoveEvent?;
    private mousewheelEvent?;
    /**
     * @ignore
     */
    resetMouseEvent(): void;
    mousedown(ev: MouseEvent): void;
    mouseup(ev: MouseEvent): void;
    mouseenter(evt: MouseEvent): void;
    mouseleave(evt: MouseEvent): void;
    mousemove(evt: MouseEvent): void;
    mousewheel(evt: MouseEvent): void;
    onMouseup(cb: () => void): void;
    onMousedown(cb: () => void): void;
    onMouseenter(cb: () => void): void;
    onMouseleave(cb: () => void): void;
    onMousemove(cb: () => void): void;
    onMousewheel(cb: () => void): void;
}

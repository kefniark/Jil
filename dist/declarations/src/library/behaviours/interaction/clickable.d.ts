export declare class Clickable {
    /**
     * @ignore
     */
    private clickEvent?;
    private dbClickEvent?;
    /**
     * @ignore
     */
    resetClickable(): void;
    click(): void;
    doubleClick(): void;
    onClick(cb: () => void): void;
    onDbClick(cb: () => void): void;
}

export declare class Clickable {
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

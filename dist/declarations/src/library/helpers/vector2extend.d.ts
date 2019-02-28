/**
 * Variant of Vector2
 * This is used by the layout system to overwrite user settings (position, size)
 *
 * @export
 * @class Vector2Extend
 */
export declare class Vector2Extend {
    private origin;
    private overwrite;
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    set(x: number, y: number): void;
    enforce(x: number, y: number): void;
    clear(): void;
    toString(): string;
}

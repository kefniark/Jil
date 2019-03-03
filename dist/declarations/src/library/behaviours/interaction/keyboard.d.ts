export declare class KeyboardEvents {
    /**
     * @ignore
     */
    private keydownEvent?;
    private keypressEvent?;
    private keyupEvent?;
    private focusEvent?;
    private blurEvent?;
    private submitEvent?;
    /**
     * @ignore
     */
    resetKeyboardEvent(): void;
    keydown(evt: KeyboardEvent): void;
    keypress(evt: KeyboardEvent): void;
    keyup(evt: KeyboardEvent): void;
    focus(evt: FocusEvent): void;
    focusblur(evt: FocusEvent): void;
    submit(evt: Event): void;
    onKeydown(cb: () => void): void;
    onKeypress(cb: () => void): void;
    onKeyup(cb: () => void): void;
    onFocus(cb: () => void): void;
    onBlur(cb: () => void): void;
    onSubmit(cb: () => void): void;
}

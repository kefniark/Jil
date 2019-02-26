import * as Fatina from 'fatina';
export declare class TransformTween {
    private moveTween;
    private rotateTween;
    private fadeTween;
    private _moveTween;
    moveX(x?: number, duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
    moveY(y?: number, duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
    move(x?: number, y?: number, duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
    private _fadeTween;
    show(duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
    hide(duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
    private _rotateTween;
    rotate(duration?: number, autostart?: boolean, autokill?: boolean): Fatina.ITween;
}

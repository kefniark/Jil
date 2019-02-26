import { JilScene } from './components';
/**
 * Scene Manager Object (use UMD: Universal Module Definition)
 */
export declare class SceneManager {
    /**
     * Create the JIL root and append it to the document.body
     *
     * @param width Native width of the game
     * @param height Native height of the game
     */
    static init(width?: number, height?: number): void;
    /**
     * Create a new scene
     *
     * @param id SceneId (need to be unique)
     */
    static create(id: string): JilScene;
    /**
     * Switch to a different scene
     *
     * @param id SceneId
     */
    static use(id: string): void;
}

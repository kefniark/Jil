import { JilNode } from './node';
import { Layout } from '../layout/layout';
export declare function registerComponent(type: string, className: any): void;
export declare function registerLayout(id: string, className: (container: Layout, elements: JilNode[]) => void): void;
export declare function registerClassname(id: string, className: string): void;
export declare class Factory {
    /**
     * @ignore
     */
    createComponent(type: string, id: string, params?: any): any;
    getLayout(id: string): (container: Layout, elements: JilNode[]) => void;
    getClassname(id: string): string;
}

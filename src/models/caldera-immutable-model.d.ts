declare module 'caldera-immutable-model' {
    export class Model {
        constructor(data: any);
        public get(key: string): any;
        public set(key: string, value: any): any;
        public setIn(keyPath: [string], value: any): any;
    }

    export class Collection {
        constructor(data: any);
    }
}

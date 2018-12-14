export function getKeys<T extends {}>(arg: T): (keyof T)[] {
    return Object.keys(arg) as (keyof T)[];
}

export function getValues<T extends {}>(arg: T): T[(keyof T)][] {
    let keys = getKeys(arg);
    return keys.map(key => arg[key]);
}

export function pathHelper<TModel>(model: TModel) {

    function pathBuilder(...path: [keyof TModel]): string[]
    function pathBuilder<T1>(...path: [keyof TModel, keyof T1]): string[]
    function pathBuilder<T1, T2>(...path: [keyof TModel, (keyof T1), (keyof T2)]): string[]
    function pathBuilder<T1, T2, T3>(...path: [keyof TModel, (keyof T1), (keyof T2), (keyof T3)]): string[]
    function pathBuilder<T1, T2, T3, T4>(...path: [keyof TModel, (keyof T1), (keyof T2), (keyof T3), (keyof T4)]): string[]
    function pathBuilder(...path: any[]): any[] {
        return path;
    }

    return pathBuilder;
}

export function getValueAtPath(target: any, path: string[]): { pathExists: boolean, value: any } {
    let value = target;
    for (let prop of path) {
        if (value && value.hasOwnProperty(prop)) {
            value = value[prop];
        }
        else {
            return {
                pathExists: false,
                value: undefined
            };
        }
    }
    return {
        pathExists: true,
        value
    };
}

export function setValueAtPath(target: any, path: string[], value: any) {
    let lastPathIndex = path.length - 1;
    for (let i = 0; i < lastPathIndex; i++) {
        let prop = path[i];
        target = target[prop];
    }
    target[path[lastPathIndex]] = value;
}

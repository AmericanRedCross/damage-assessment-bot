export function getKeys<T extends {}>(arg: T): (keyof T)[] {
    return Object.keys(arg) as (keyof T)[];
}

export function getValues<T extends {}>(arg: T): T[(keyof T)][] {
    let keys = Object.keys(arg) as (keyof T)[];
    return keys.map(key => arg[key]);
}
export type JsonResult<TObj> = {
    [x in keyof TObj]: TObj[x] extends Date ? string : (TObj[x] extends object|(Date|object)[] ? TObj[x] : JsonResult<TObj[x]>);
}

export function jsonDate(value: string): Date {
    return value ? new Date(value) : <any>null;
}
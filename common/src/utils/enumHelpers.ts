export function enumContainsValue(enumType: any, value: string, caseSensitive = false) {
    let enumValues = enumKeys(enumType).map(x => enumType[x]).map(x => (caseSensitive || typeof x !== "string") ? x : x.toUpperCase());
    let possibleEnumValue = (caseSensitive || typeof value !== "string") ? value : value.toUpperCase();

    return enumValues.indexOf(possibleEnumValue) !== -1;
}

export function enumKeys(enumType: any): string[] {
    return Object.keys(enumType).filter(key => isNaN(Number(key)));
}

export function enumValues<TEnum extends string|number>(enumType: any): TEnum[] {
    return enumKeys(enumType).map(enumKey => enumType[enumKey]);
}

export function makeObjectWithEnumKeys<TEnum extends string|number, TValue>(enumValues: TEnum[], mapper: (x: TEnum) => TValue): { [x in TEnum]: TValue } {
    let result: { [x in TEnum]: TValue } = <any>{};
    enumValues.forEach(value => {
        result[value] = mapper(<any>value);
    });
    return result;
}
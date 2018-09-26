export default function enumContainsValue(enumType: {[k: string]: string }, value: string, caseSensitive = false) {
    let enumValues = Object.keys(enumType).map(x => enumType[x]).map(x => caseSensitive ? x : x.toUpperCase());
    let possibleEnumValue = caseSensitive ? value : value.toUpperCase();

    return enumValues.includes(possibleEnumValue)
}
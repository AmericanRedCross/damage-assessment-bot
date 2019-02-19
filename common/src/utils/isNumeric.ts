export function IsNumeric(x:string,base:number=10):boolean {
    const parsedInt = parseInt(x,base);
    if (isNaN(parsedInt)) {
        return false;
    } else {
        return true;
    }
}
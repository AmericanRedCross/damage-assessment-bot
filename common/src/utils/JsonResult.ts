type JSON<TObj> = {
    [x in keyof TObj]: TObj[x] extends Date ? string : JSON<TObj[x]>
}

export default JSON;
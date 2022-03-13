
// from https://stackoverflow.com/a/47385953
export function groupByKey<T>(list: T[], key: string): { [p: string]: T[] } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return list.reduce((hash: any, obj: any) => ({
        ...hash,
        [obj[key]]: (hash[obj[key]] || []).concat(obj)
    }), {});
}

export function zip<T, K>(a: T[], b: K[]): [T, K][] {
    return a.map((k, i) => [k, b[i]]);
}

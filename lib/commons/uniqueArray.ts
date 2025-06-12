export const uniqueArray = <T extends Record<string, any>>(
    visibleRows: T[],
    K: keyof T,
): Array<T> =>
    Array.from(new Map(visibleRows.map(item => [item[K], item])).values());
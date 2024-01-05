/**
 * return a new map with values transformed by the given transformer function
 * @param map
 * @param transformer
 * @returns {Map<any, any>}
 */
export const transformMap = (map, transformer) => {
    const newMap = new Map()
    map.forEach((value, key) => newMap.set(key, transformer(value)))
    return newMap
}
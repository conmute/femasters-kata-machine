export default function bs_list(haystack: number[], needle: number): boolean {
    // [1,10,20,30,40,59,60]
    //. f,      m          ,t

    // [from = 0, to - haystack.length], ex: [1...60] whcih is [0,6]
    // mid: from + floor((to - from) / 2), ex: 4 + floor( (6-4)/2 ), where mid will be 5

    // case one, needle > m
    // [1,10,20,30,40,59,60]
    //.            f  m    ,t

    // Case two, needle < m
    // [1,10,20,30,40,59,60]
    //. f,m    ,t

    let from = 0,
        to = haystack.length, 
        index = from + Math.floor((to - from) / 2), 
        value = haystack[index]

    do {
        if (needle === value) return true

        if (needle > value) {
            from = index + 1
        }

        if (needle < value) {
            to = index
        }

        index = from + Math.floor( (to - from) / 2 )
        value = haystack[index]
    } while (from < to)

    return false
}

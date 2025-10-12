// O( sqrt(n) ), because ours steps amount are not more significant sqrt(n)
export default function two_crystal_balls(breaks: boolean[]): number {
    // 1st ball...
    // [f,f,f,f, f,f,f,f, f,f,f,f, f,f,t,t, t]
    // length = 17, step = floor ( sqrt 17 = 4.zz) = 4
    // [f,f,f,f, f,f,f,f, f,f,f,f, f,f,t,t, t]
    //           1st step,2nd step,3d step, 4th step
    // [f,f,f,f, f,f,f,f, f,f,f,f, f,f,t,t, t]
    //.                            check from here... by making a step as 1

    // Option 1: use for loops for better space/time complexity determination

    let step = Math.floor( Math.sqrt(breaks.length) ),
        index = step;

    for (; index < breaks.length; index += step) {
        if (breaks[index]) break
    }

    index -= step

    for (let j = 0; j < step && index < breaks.length; j++, index++) {
        if (breaks[index]) return index
    }

    // // Option 2, simplifeid version of Option 3, doing single do.while

    // let step = Math.floor( Math.sqrt(breaks.length) ),
    //     index = 0,
    //     value = breaks[index];
    
    // do {
    //     if (step === 1 && value) {
    //         return index
    //     }

    //     if (value) {
    //         index = index - step
    //         step = 1
    //     }

    //     if (!value) {
    //         index += step
    //     }

    //     value = breaks[index]
    // } while (index < breaks.length)

    // // Option 3, more verbose but has repeated loop, which we condensed into code above

    // let step = Math.floor( Math.sqrt(breaks.length) ),
    //     indeces = [-1,-1],
    //     value = breaks[indeces[0]];

    // do {
    //     if (value) {
    //         indeces[1] = indeces[0] - step
    //         value = breaks[indeces[1]]
    //         break
    //     }

    //     if (!value) {
    //         indeces[0] += step
    //     }

    //     value = breaks[indeces[0]]
    // } while (indeces[0] < breaks.length)

    // do {
    //     if (value) {
    //         return indeces[1]
    //     }

    //     if (!value) {
    //         indeces[1] += 1
    //     }

    //     value = breaks[indeces[1]]
    // } while (indeces[1] < breaks.length)

    return -1
}
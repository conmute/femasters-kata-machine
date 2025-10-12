// Algorythm time complexity
// n + n-1, n-2, ... n-x this is n * (n-1) / 2, where it is n^2/2 - n/2 

import { matrix2 } from "__tests__/graph"

// and in O(n^2) becasue we drop the constant and do for the worst case scenario
export default function bubble_sort(arr: number[]): void {
    // [1,3,4,2,7,6]
    // => go 1by1 and swap if right is bigger
    // 1. [1,3, swap(2,4), swap(6, 7)]
    // 2, [1, swap(2, 3), 4, 6], 7
    // because we already did a previous iteration, the biggest number is in the end so cycle is reduced

    // its already sorted if one element only
    if (arr.length <= 1) return

    // option 0: clean algro without mangling the indeces
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j <= arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
            }
        }
    }

    // // Option 1: iterate the iteration
    // let to = arr.length;
    // // to - 1 becasue we need to have two last items in the single cycle!
    // for (let j = 0; j < to; j++) {
    //     for (let i = 0; i < to - 1; i++) {
    //         if (arr[i] > arr[i + 1]) {
    //             // // old style swap
    //             // const tmp = arr[i]
    //             // arr[i] = arr[i + 1]
    //             // arr[i + 1] = tmp

    //             // // use destruction operator isntead
    //             [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]
    //         }
    //     }
    //     to -= 1
    // }


    // // Option 2, using do while with flexibly looping

    // let ordered = 0,
    //     index = 0

    // do {
    //     // swap if applicable
    //     if (arr[index] > arr[index + 1]) {
    //         [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
    //     }

    //     index += 1
        
    //     if (index >= arr.length - ordered) {
    //         ordered += 1
    //         index = 0
    //     }
    // } while (ordered < arr.length)
}

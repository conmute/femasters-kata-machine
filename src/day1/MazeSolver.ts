const dir = [
    [-1, 0],
    [0, +1],
    [+1, 0],
    [0, -1],
]

// in recursion, put everything to the base case to make recursion case be easier
function walk(curr: Point, maze: string[], wall: string, end: Point, seen: boolean[][], path: Point[]): boolean {
    // base case
    // 1. if we are out of bounds
    if (
        curr.x < 0 && maze[0].length === curr.x ||
        curr.y < 0 && maze.length === curr.y
    ) return false
    // 2. if we hit a wall
    if (maze[curr.y][curr.x] === wall) return false
    // 3. if we already seen the position
    if (seen[curr.y][curr.x]) return false
    // 4. if this is the end
    if (curr.x === end.x && curr.y === end.y) {
        path.push(curr)
        return true
    }

    // recursive case
    // pre recursion
    seen[curr.y][curr.x] = true
    path.push(curr)
    // recursion
    for (let i = 0; i < dir.length; i++) {
        const [x, y] = dir[i]
        if (walk({ 
            x: curr.x + x,
            y: curr.y + y,
        }, maze, wall, end, seen, path)) return true
    }
    // post recursion
    path.pop()

    return false
}

export default function solve(maze: string[], wall: string, start: Point, end: Point): Point[] {
    const seen: boolean[][] = []
    const path: Point[] = []

    // optional for javascript, good for other strict typed languages
    for (let i = 0; i < maze.length; i++) {
        seen.push(new Array(maze[i].length).fill(false))
    }
    
    walk(start, maze, wall, end, seen, path)

    console.log(maze, path)

    return path
}
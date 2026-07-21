"""
Graph helper functions for LeetCode-style graph problems.

Graph is represented as an adjacency list using a dict:
    {1: [2, 3], 2: [4, 5], 4: [5]}

BFS uses a queue (FIFO)  -> level-by-level traversal
DFS uses a stack (LIFO)  -> deep traversal down one path first

Time:  O(V + E) - every vertex is popped/processed once,
       every edge is processed once when extending the queue/stack
Space: O(V) - up to all vertices in the queue/stack/traversal list
"""

from collections import deque


class Graph:
    def __init__(self):
        self.graph = {}

    def add_edge(self, from_vertex, to_vertex, bidirectional=False):
        # add edge
        if from_vertex in self.graph:
            self.graph[from_vertex].append(to_vertex)
        else:
            self.graph[from_vertex] = [to_vertex]

        # make sure to_vertex has an entry too (even if empty)
        # so lookups like `vertex in self.graph` behave consistently
        if to_vertex not in self.graph:
            self.graph[to_vertex] = []

        if bidirectional:
            self.graph[to_vertex].append(from_vertex)

    def bfs(self, start_vertex):
        # Check if the start_vertex exists in the graph
        if start_vertex not in self.graph:
            return []  # If not, return an empty list

        queue = deque([start_vertex])  # Initialize a queue with the start_vertex
        visited = {start_vertex}       # track visited to avoid re-adding to queue
        traversal = []                 # Initialize an empty list to store the BFS traversal result

        while queue:  # Continue until the queue is empty
            vertex = queue.popleft()  # Remove and retrieve the first vertex from the queue (FIFO)
            traversal.append(vertex)  # Add the vertex to the traversal result

            for neighbor in self.graph.get(vertex, []):  # Check the vertex's neighbors
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)  # Add unvisited neighbors to the queue

        return traversal  # Return the BFS traversal result

    def dfs(self, start_vertex):
        # Check if the start_vertex exists in the graph
        if start_vertex not in self.graph:
            return []  # If not, return an empty list

        stack = [start_vertex]  # Initialize a stack with the start_vertex
        visited = set()
        traversal = []          # Initialize an empty list to store the DFS traversal result

        while stack:  # Continue until the stack is empty
            vertex = stack.pop()  # Remove and retrieve the last vertex from the stack (LIFO)
            if vertex not in visited:  # Check if the vertex has not been visited
                visited.add(vertex)
                traversal.append(vertex)  # Add the vertex to the traversal result
                # reversed() keeps neighbor visit order consistent with BFS
                stack.extend(reversed(self.graph.get(vertex, [])))

        return traversal  # Return the DFS traversal result

    def bfs_levels(self, start_vertex):
        """Bonus helper: BFS but grouped by level/depth.
        Useful for questions like 'minimum depth' or 'average per level'.
        Returns a list of lists, one per level.
        """
        if start_vertex not in self.graph:
            return []

        queue = deque([start_vertex])
        visited = {start_vertex}
        levels = []

        while queue:
            level_size = len(queue)
            level = []
            for _ in range(level_size):
                vertex = queue.popleft()
                level.append(vertex)
                for neighbor in self.graph.get(vertex, []):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            levels.append(level)

        return levels

    def has_cycle(self):
        """Detect a cycle in a directed graph using DFS + recursion stack.
        Use this version for DIRECTED graphs.
        """
        visited = set()
        in_stack = set()

        def dfs_visit(vertex):
            visited.add(vertex)
            in_stack.add(vertex)
            for neighbor in self.graph.get(vertex, []):
                if neighbor not in visited:
                    if dfs_visit(neighbor):
                        return True
                elif neighbor in in_stack:
                    return True
            in_stack.remove(vertex)
            return False

        for vertex in list(self.graph):
            if vertex not in visited:
                if dfs_visit(vertex):
                    return True
        return False

    def find_largest_node(self, start_vertex):
        # Iterative BFS - traverses entire graph keeping track of the
        # largest node and making comparisons at each node.
        # Starting at a node with no edges to traverse returns None -
        # which is expected (not a problem for non-directed graphs).
        if start_vertex not in self.graph:
            return None

        queue = [start_vertex]
        traversal = []
        largest_node = start_vertex

        while queue:
            vertex = queue.pop(0)

            if vertex not in traversal:
                traversal.append(vertex)

                if vertex > largest_node:
                    largest_node = vertex

                if vertex in self.graph:
                    queue.extend(self.graph[vertex])

        return largest_node

    def find_cycle(self, start_vertex):
        """Iterative DFS - stack to traverse graph and visited set to
        identify a cycle. Use this version for UNDIRECTED graphs.
        The parent check is necessary here so we don't treat the edge
        we just came from as a cycle; omit it for directed graphs
        (use has_cycle instead).
        """
        if start_vertex not in self.graph:
            return False  # No cycle if the start vertex is not in the graph

        stack = [(start_vertex, -1)]  # Stack of (vertex, parent)
        visited = set()  # Set to store visited vertices

        while stack:
            vertex, parent = stack.pop()
            if vertex in visited:
                return True  # A cycle is found if the vertex is already visited

            visited.add(vertex)

            # Get neighbors, or an empty list if the vertex is not explicitly listed
            for neighbor in self.graph.get(vertex, []):
                if neighbor != parent:
                    stack.append((neighbor, vertex))

        return False

    def count_edges(self):
        """Easily count the total number of edges in the graph by
        iterating through each vertex and summing up the lengths of
        their adjacency lists.
        """
        edge_count = 0  # Initialize the edge count to zero
        for vertex in self.graph:  # iterate over each vertex in the graph
            edge_count += len(self.graph[vertex])  # add the number of edges from this vertex
        return edge_count


if __name__ == "__main__":
    g = Graph()
    g.add_edge(1, 2)
    g.add_edge(1, 3)
    g.add_edge(2, 4)
    g.add_edge(2, 5)
    g.add_edge(4, 5)

    print("Graph:", g.graph)
    print("BFS from 1:", g.bfs(1))
    print("DFS from 1:", g.dfs(1))
    print("BFS levels from 1:", g.bfs_levels(1))
    print("Has cycle (directed):", g.has_cycle())
    print("Edge count:", g.count_edges())
    print("Largest node from 1:", g.find_largest_node(1))

    # find_cycle expects an undirected graph (edges added both ways)
    undirected = Graph()
    undirected.add_edge(1, 2, bidirectional=True)
    undirected.add_edge(2, 3, bidirectional=True)
    print("\nUndirected graph:", undirected.graph)
    print("Find cycle (no cycle yet):", undirected.find_cycle(1))

    undirected.add_edge(3, 1, bidirectional=True)  # closes the loop 1-2-3-1
    print("Undirected graph with cycle:", undirected.graph)
    print("Find cycle (cycle present):", undirected.find_cycle(1))

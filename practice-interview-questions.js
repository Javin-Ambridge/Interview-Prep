--------------------------------------------------------------------------------------------------------------
Question #1:
Alien Dictionary
Where: Airbnb
Who: Joyee
Time: ? -> 1h
What: Given a sorted dictionary (array of words) of an alien language, find order of characters in the language.
Examples:
Input:  words[] = {"baa", "abcd", "abca", "cab", "cad"}
Output: Order of characters is 'b', 'd', 'a', 'c'
Note that words are sorted and in the given language "baa" 
comes before "abcd", therefore 'b' is before 'a' in output.
Similarly we can find other orders.

Input:  words[] = {"caa", "aaa", "aab"}
Output: Order of characters is 'c', 'a', 'b'


--------------------------------------------------------------------------------------------------------------
Rundown:
Make a conenctions list that contains all of the characters in total, and then start comparing the words.
Compare words that are beside eachother and then at the first missmatch make a connection from the character 
that missmatched from word i to the character that missmatched from word i + 1. So you are saying that this character
NEEDS to come before the this other character.
Once you have all of these connections run a topological sort on this final graph. (Ie. run DFS on it and keep track 
	of finishing times, then from highest to lowest will be the order of characters that works.)

--------------------------------------------------------------------------------------------------------------
Actual Code:


var solver = function(list) {
	var simpleList = [];
	var connections = [];
	for(var i = 0; i < list.length; i++) {
		for(var k = 0; k < list[i].length; k++) {
			if (simpleList.indexOf(list[i][k] < 0)) {
				simpleList.push(list[i][k]);
				connections.push({
					c: list[i][k],
					connect: [],
					visited: false
				});
			}
		}
	}
	for(var i = 0; i < list.length; i++) {
		if (i + 1 < list.length) {
			for(var k = 0; k < Math.min(list[i].length, list[i + 1].length); k++) {
				if (list[i][k] != list[i + 1][k]) {
					connections[simpleList.indexOf(list[i][k])].connect.push(list[i + 1][k]);
					break;
				}
			}
		}
	}
	var finalArr = [];
	dfs(finalArr, connections, simpleList, 0);
	for(var i = finalArr.length - 1; i >= 0; i--) {
		console.log(finalArr[i]);
	}
}

var dfs = function(arr, connections, simple, curr) {
	connections[curr].visited = true;
	for(var i = 0; i < connections[curr].connect.length; i++) {
		var ind = simple.indexOf(connections[curr].connect[i]);
		if (!connections[ind].visited) {
			var tmp = dfs(arr, connections, simple, ind);
		}
	}
	arr.push(connections[curr].c);
	return 1;
}


--------------------------------------------------------------------------------------------------------------
Question #2:
Path Finding
Where: Airbnb
Who: Nico
Time: 50min/1h
What: Given a list of cities connected by flight connections, determine which is the cheapest route using up to k (0, 1, 2, 3, 4, …) connections. 
Follow-up: What is the time complexity?

--------------------------------------------------------------------------------------------------------------
Rundown:
Initially get the list into a form where you have nodes with connections to other nodes.
Then start running Dikstras algorithm on it (always look for shortest path to a not visited node)
Make sure to check that if your looking at a path to the end node that the current length of the path is
not higher than the max allowed connections.

--------------------------------------------------------------------------------------------------------------
Actual Code:

var solver = function(list, start, end, k) {
	var nodes = [];
	var simpleList = [];
	for(var i = 0; i < list.length; i++) {
		var ind = simpleList.indexOf(list[i].o);
		if (ind < 0) {
			simpleList.push(list[i].o);
			nodes.push({
				loc: list[i].o,
				visited: false,
				connections: [{
					dest: list[i].i,
					cost: list[i].cost
				}]
			});
		} else {
			nodes[ind].connections.push({
				dest: list[i].i,
				cost: list[i].cost
			});
		}
		if (simpleList.indexOf(list[i].i) < 0) {
			simpleList.push(list[i].i);
			nodes.push({
				loc: list[i].i,
				visited: false,
				connections: []
			});
		}
	}
	nodes[simpleList.indexOf(start)].visited = true;
	var p = dikstras(simpleList, nodes, start, end, k);
	for(var i = 0; i < p.length; i++) {
		console.log(p[i]);
	}
}

var dikstras = function(simpleList, nodes, start, e, max) {
	var visited = [];
	visited.push({
		init: start,
		val: 0,
		endVal: start,
		path: [start]
	});
	while(true) {
		var visitedInd = -1;
		var destInd = -1;
		var minVal = 100000000;
		for(var i = 0; i < visited.length; i++) {
			var tmpInd = simpleList.indexOf(visited[i].endVal);
			for(var k = 0; k < nodes[tmpInd].connections.length; k++) {
				var tmpInd2 = simpleList.indexOf(nodes[tmpInd].connections[k].dest);
				if (nodes[tmpInd2].visited || (nodes[tmpInd2].loc == e && ((visited[i].path.length + 1) > max))) {
					continue;
				} else {
					if (visited[i].val + nodes[tmpInd].connections[k].cost < minVal) {
						visitedInd = i;
						destInd = tmpInd2;
						minVal = visited[i].val + nodes[tmpInd].connections[k].cost;
					}
				}
			}
		}

		if (destInd < 0) {
			console.log("Error! This path does not exist!");
			return [];
		}

		//Now update visited array.
		var tmpArray = visited[visitedInd].path.slice();
		tmpArray.push(nodes[destInd].loc);
		visited.push({
			init: start,
			val: minVal,
			endVal: nodes[destInd].loc,
			path: tmpArray
		});
		nodes[destInd].visited = true;
		if (nodes[destInd].loc == e) {
			return visited[visited.length - 1].path;
		}
	}
}

--------------------------------------------------------------------------------------------------------------
Question #3:
Bijection exist
Where: Uber
Time: 50min/1h
What: Given a Pattern and a String find out if there exists a bijection between the pattern and the string.

Example:
Pattern = "abab";
String = "redblueredblue";

Answer: true
Bijection is:
a -> r
b -> edblue

OR 
a -> red 
b -> blue

--------------------------------------------------------------------------------------------------------------
Rundown:
Start by doing the smallest possible bijection (the first element in the pattern is the first element in the string) and then try to keep 
building off of that, if you ever get stuck (ie. the pattern already exists but wont fit, pattern is already used so cant expand) then backtrack.

--------------------------------------------------------------------------------------------------------------
Actual Code:

var solver = function(pattern, str) {
	var array = new Array(pattern.length);
	for(var i = 0; i < pattern.length; i++) {
		array[i] = new Array(str.length);
		for(var k = 0; k < str.length; k++) {
			array[i][k] = false;
		}
	}
	var x = 0;
	var y = 0;
	var patternObj = {};
	while(true) {
		if (x >= str.length) {
			break;
		}
		if (y >= pattern.length) {
			break;
		}
		if (patternObj[pattern[y]] != undefined) {
			if (array[y][x - 1] == true) {
				var alreadyUsed = false;
				for(var i = 0; i < y; i++) {
					if (pattern[i] == pattern[y]) {
						alreadyUsed = true;
						break;
					}
				}
				if (alreadyUsed) {
					for(var i = 0; i < str.length; i++) {
						array[y][i] = false;
					}
					y--;
					x -= patternObj[pattern[y]].length;
					console.log("Pattern can't continue here! Already used!");
					console.log("New position, x: " + x + ", y: " + y);
				} else {
					array[y][x] = true;
					patternObj[pattern[y]] += str[x];
					x++;
					y++;
					console.log("Pattern not already used, so extend it! Now: " + patternObj[pattern[y - 1]]);
					console.log("New position, x: " + x + ", y: " + y);
				}
			} else {
				if (str[x] == patternObj[pattern[y]][0]) {
					for(var i = 0; i < patternObj[pattern[y]].length; i++) {
						array[y][x] = true;
						x++;
					}
					y++;
					console.log("Pattern can be applied easily!");
					console.log("New position, x: " + x + ", y: " + y);
				} else {
					y--;
					console.log("Pattern exists but can't place it here!");
					console.log("New position, x: " + x + ", y: " + y);
				}
			}
		} else {
			if (y + 1 >= pattern.length) {
				for(var i = x; i < str.length; i++) {
					array[y][i] = true;
				}
				patternObj[pattern[y]] = str.slice(x);
				y++;
			} else {
				array[y][x] = true;
				array[y][x + 1] = true;
				patternObj[pattern[y]] = str.slice(x, x + 1);
				x++;
				y++;
			}
			console.log("Created pattern: " + patternObj[pattern[y - 1]] + ', for: ' + pattern[y - 1]);
			console.log("New position, x: " + x + ", y: " + y);
		}
	}
	console.log("Is there a bijection between '" + pattern + "' and '" + str + "'? " + array[pattern.length - 1][str.length - 1]);
	if (array[pattern.length - 1][str.length - 1]) {
		console.log("The Bijection found is: ");
		for(var i = 0; i < pattern.length; i++) {
			console.log(pattern[i] + " ---> " + patternObj[pattern[i]]);
		}
	}
};
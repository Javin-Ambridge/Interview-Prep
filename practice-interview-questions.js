Notes:
	1) Make sure to write tests first! Then start coding!

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

--------------------------------------------------------------------------------------------------------------
Question #4:
Path Finding
Where: Uber
Who: Nico
Time: 30min/50min
Misc: Started on the whiteboard, ended coding on my own computer.

After solving, the interviewer asked if the code works with "unreachable" nodes and cycles in the graph.

--------------------------------------------------------------------------------------------------------------
Rundown:
Start by defining tests. Then start by defining how the object is going to be oriented, adding the function for making connections. Then work on the getPath function
because once this is done this is used for the isConnected function.

--------------------------------------------------------------------------------------------------------------
Actual Code:

var test1 = function() {
	var graph = createGraph();
	graph.connect("A", "B");
	if (graph.isConnected("A", "B")) {
		console.log("Success! test1 has passed");
		return;
	}
	console.log("Unfortunate! test1 has failed");
}

var test2 = function() {
	var graph = createGraph();
	graph.connect("A", "B");
	if (graph.isConnected("B", "A")) {
		console.log("Success! test2 has passed");
		return;
	}
	console.log("Unfortunate! test2 has failed");
}

var test3 = function() {
	var graph = createGraph();
	graph.connect("A", "B");

	var path = graph.getPath("A", "B");
	if (path == "A->B") {
		console.log("Success! test3 has passed");
		return;
	}
	console.log("Unfortunate! test3 has failed");
}

var test4 = function() {
	var graph = createGraph();
	graph.connect("A", "B");
	graph.connect("A", "X");
	graph.connect("B", "C");
	graph.connect("X", "C");

	if (graph.getPath("A", "C") == "A->B->C") {
		console.log("Success! test4 has passed");
		return;
	}
	console.log("Unfortunate! test4 has failed");
}

var runTests = function() {
	test1();
	test2();
	test3();
	test4();
}

var createGraph = function() {
	return {
		nodes: {},
		getPath: function(s, e) {
			var arr = dfs(this.nodes, s, e, []);
			if (arr === undefined) {
				return arr;
			}
			var str = "";
			var first = true;
			for(var i = 0; i < arr.length; i++) {
				if (first) {
					first = false;
				} else {
					str += "->";
				}
				str += arr[i];
			}
			return str;
		},
		isConnected: function(s, e) {
			return this.getPath(s, e) != undefined;
		},
		connect: function(a, b) {
			if (this.nodes[a] === undefined) {
				this.nodes[a] = [b];
			} else if (this.nodes[a].indexOf(b) < 0) {
				this.nodes[a].push(b);
			}
			if (this.nodes[b] === undefined) {
				this.nodes[b] = [a];
			} else if (this.nodes[b].indexOf(a) < 0) {
				this.nodes[b].push(a);
			}
		}
 	};
}

var dfs = function(nodes, curr, end, arr) {
	arr.push(curr);
	if (nodes[curr].indexOf(end) >= 0) {
		arr.push(end);
		return arr;
	} else {
		for(var i = 0; i < nodes[curr].length; i++) {
			if (arr.indexOf(nodes[curr][i]) >= 0) {
				continue;
			}
			var tmp = dfs(nodes, nodes[curr][i], end, arr);
			if (tmp != undefined) {
				return tmp;
			}
		}
		return undefined;
	}
}

--------------------------------------------------------------------------------------------------------------
Question #5:
Numbers can be regarded as product of its factors. For example,

8 = 2 x 2 x 2;
  = 2 x 4.
Write a function that takes an integer n and return all possible combinations of its factors.

Note: 
You may assume that n is always positive.
Factors should be greater than 1 and less than n.
Examples: 
input: 1
output: 
[]
input: 37
output: 
[]
input: 12
output:
[
  [2, 6],
  [2, 2, 3],
  [3, 4]
]
input: 32
output:
[
  [2, 16],
  [2, 2, 8],
  [2, 2, 2, 4],
  [2, 2, 2, 2, 2],
  [2, 4, 4],
  [4, 8]
]

--------------------------------------------------------------------------------------------------------------
Rundown:
Starting finding factors, and keeping track of current found factors, sort then put in the map so you can see if that factor set has already been found.

--------------------------------------------------------------------------------------------------------------
Actual Code:

var getFactors = function(n) {
    var arr = [];
    var myMap = new Map();
    for(var i = 2; i < n; i++) {
        if (n % i === 0) {
            var right = (n / i);
            var tmpArray = [i, right];
            tmpArray = tmpArray.sort();
            if (myMap.get(tmpArray.toString()) != true) {
                arr.push(tmpArray);
                myMap.set(tmpArray.toString(), true);
                var rightF = getFactors(right);
                for(var k = 0; k < rightF.length; k++) {
                    var tmp = [i];
                    for(var j = 0; j < rightF[k].length; j++) {
                        tmp.push(rightF[k][j]);
                    }
                    tmp = tmp.sort();
                    if (myMap.get(tmp.toString()) != true) {
                        arr.push(tmp);
                        myMap.set(tmp.toString(), true);
                    }
                }
            }
        }
    }
    return arr;
};

--------------------------------------------------------------------------------------------------------------
Question #6:
Google Question

Suppose we abstract our file system by a string in the following manner:

The string "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext" represents:

dir
    subdir1
    subdir2
        file.ext
The directory dir contains an empty sub-directory subdir1 and a sub-directory subdir2 containing a file file.ext.

The string "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext" represents:

dir
    subdir1
        file1.ext
        subsubdir1
    subdir2
        subsubdir2
            file2.ext
The directory dir contains two sub-directories subdir1 and subdir2. subdir1 contains a file file1.ext and an empty second-level sub-directory subsubdir1. subdir2 contains a second-level sub-directory subsubdir2 containing a file file2.ext.

We are interested in finding the longest (number of characters) absolute path to a file within our file system. For example, in the second example above, the longest absolute path is "dir/subdir2/subsubdir2/file2.ext", and its length is 32 (not including the double quotes).

Given a string representing the file system in the above format, return the length of the longest absolute path to file in the abstracted file system. If there is no file in the system, return 0.

Note:
The name of a file contains at least a . and an extension.
The name of a directory or sub-directory will not contain a ..
Time complexity required: O(n) where n is the size of the input string.

Notice that a/aa/aaa/file1.txt is not the longest file path, if there is another path aaaaaaaaaaaaaaaaaaaaa/sth.png.

--------------------------------------------------------------------------------------------------------------
Rundown:
Convert it into a form you can work with easily, then as you are doing the nesting (to make it look more like a graph) keep count of the length of the 
path so far, and if the item your adding is a file, check to see if the length of the path is greater then the maxval length yet.

--------------------------------------------------------------------------------------------------------------

Actual Code:
var maxVal = -1;

var doNesting = function(curr, name, count, max) {
    if (count == 0) {
        if (name.indexOf(".") >= 0) {
            max += name.length;
            if (max > maxVal) {
                maxVal = max;
            }
        }
    } else if (count == 1) {
        curr.neighbours.push({
            neighbours: [],
            name: name
        });
        if (name.indexOf(".") >= 0) {
            max += (curr.name.length + 1);
            max += name.length;
            if (max > maxVal) {
                maxVal = max;
            }
        }
    } else {
        max += (curr.name.length + 1);
        doNesting(curr.neighbours[curr.neighbours.length - 1], name, count - 1, max);
    }
} 

var lengthLongestPath = function(input) {
    maxVal = 0;
    if (input.indexOf(".") < 0) {
        return 0;
    }
    var arr = input.split("\n");
    if (arr.length == 1) {
        return arr[0].length;
    }
    for(var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].split("\t");
    }
    var root = {
        neighbours: [],
        name: arr[0][0]
    };
    var roots = [root];
    for(var i = 1; i < arr.length; i++) {
        if (arr[i].length - 1 == 0 && arr[i][0].indexOf(".") < 0) {
            var tmp = {
                neighbours: [],
                name: arr[i][0]
            };
            roots.push(tmp);
        } else {
            doNesting(roots[roots.length - 1], arr[i][arr[i].length - 1], arr[i].length - 1, 0);
        }
    }
    return maxVal;
};

--------------------------------------------------------------------------------------------------------------
Question #6:
Google Question

Given a string, find the length of the longest substring T that contains at most k distinct characters.

For example, Given s = “eceba” and k = 2,

T is "ece" which its length is 3.

--------------------------------------------------------------------------------------------------------------
Rundown:
Set it up so that it is a dynamic programming questions.

--------------------------------------------------------------------------------------------------------------

Actual Code:

var lengthOfLongestSubstringKDistinct = function(s, k) {
    if (k == 0) {
        return 0;
    }
    var arr = new Array(s.length);
    for(var i = 0; i < s.length; i++) {
        arr[i] = new Array(s.length);
        arr[i][i] = 1;
    }
    for(var y = 0; y < s.length; y++) {
        var foundLetters = [s[y]];
        for(var x = y + 1; x < s.length; x++) {
            if (s[y] == s[x] || foundLetters.indexOf(s[x]) >= 0) {
                arr[y][x] = arr[y][x - 1];
            } else {
                arr[y][x] = arr[y][x - 1] + 1;
                foundLetters.push(s[x]);
            }
        }
    }
    var max = 0;
    for(var y = 0; y < s.length; y++) {
        var tmp = 1;
        for(var x = y + 1; x < s.length; x++) {
            if (arr[y][x] <= k) {
                tmp++;
            } else {
                break;
            }
        }
        if (tmp > max) {
            max = tmp;
        }
    }
    return max;
};

--------------------------------------------------------------------------------------------------------------
Question #7:
Uber Question

Given n pairs of parentheses, write a functiona to generate all combinations of well-formed parentheses.

For example, given n = 3, a solution set is: ["((()))", "(()())", "(())()", "()(())", "()()()"]

--------------------------------------------------------------------------------------------------------------
Rundown:
Generate a tree structure splitting off at each node by adding either or both of ')' '('

--------------------------------------------------------------------------------------------------------------

var allowedBrackets = function(item, n) {
    var opening = 0;
    var closing = 0;
    for(var i = 0; i < item.length; i++) {
        if (item[i] == '(') {
            opening++;
        }
        if (item[i] == ')') {
            closing++;
        }
    }
    return [(n - opening), (opening - closing)];
} 

var recursiveGeneration = function(nodes, constN, n) {
    if (n == 1) {
        return nodes;
    }
    var tmp = [];
    for (var i = 0; i < nodes.length; i++) {
        var allowed = allowedBrackets(nodes[i], constN);
        for(var k = 0; k < 2; k++) {
            if (allowed[k] == 0) continue;
            if (k == 0) { // '('
                tmp.push(nodes[i] + '(');
            } else { // ')'
                tmp.push(nodes[i] + ')');
            }
        }
    }
    return recursiveGeneration(tmp, constN, n - 1);
}
 
var generateParenthesis = function(n) {
    var nodes = ['('];
    return recursiveGeneration(nodes, n, n * 2);
};

--------------------------------------------------------------------------------------------------------------
Question #8:
Uber Question

Design a Deck object where you can shuffle, and deal cards.

--------------------------------------------------------------------------------------------------------------
Rundown:
Define the initial Deck strucutre, then write functions that are needed.

--------------------------------------------------------------------------------------------------------------

function Deck() {
    this.cards = [];
    var types = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
    var suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds']
    var ind = 0;
    for(var i = 0; i < types.length; i++) {
        for(var k = 0; k < 4; k++) {
            this.cards.push({
                type: types[i],
                suit: suits[k]
            });
        }
    }
    this.shuffle();
}

Deck.prototype.shuffle = function() {
    var shuffleCount = Math.floor(((Math.random() * 200) + 80));
    while(shuffleCount > 0) {
        var swap1 = Math.floor(((Math.random() * 51) + 1));
        var swap2 = Math.floor(((Math.random() * 51) + 1));
        while(swap2 == swap1) {
            swap2 = Math.floor(((Math.random() * 51) + 1));
        }
        var tmpCard = this.cards[swap1];
        this.cards[swap1] = this.cards[swap2];
        this.cards[swap2] = tmpCard;
        shuffleCount--;
    }
};

Deck.prototype.deal = function(number) {
    console.log("cards in deck: " + this.cards.length);
    for(var i = 0; i < number; i++) {
        var tmpCard = this.cards[i];
        console.log("Dealt: " + tmpCard.type + " of " + tmpCard.suit);
    }
    for(var i = 0; i < number; i++) {
        var tmpCard = this.cards[i];
        this.cards.shift();
        this.cards.push(tmpCard);
    }
}

--------------------------------------------------------------------------------------------------------------
Question #9:
Uber Question

Design Excel

--------------------------------------------------------------------------------------------------------------
Rundown:
This is the majority of the solution, a few bugs here and there though so not perfect.

--------------------------------------------------------------------------------------------------------------

var ExcelSheet = function() {
    this.sheet = new Map();
    this.cachedValues = new Map();
    this.dependencies = new Map();
}

var setupDependencies = function(dependencies, row, val) {
    var arr = val.split(" ");
    for(var i = 0; i < arr.length; i++) {
        if (!isNaN(arr[i])) continue;
        if (arr[i] == '+') continue;
        if (dependencies.get(arr[i]) != undefined) {
            if (dependencies.get(arr[i]).indexOf(row) < 0) {
                dependencies.set(arr[i], dependencies.get(arr[i]).push(row));
                console.log("Dependency for " + arr[i] + " is ", dependencies.get(arr[i]));
            }
        } else {
            dependencies.set(arr[i], [row]);
            console.log("Dependency for " + arr[i] + " is ", dependencies.get(arr[i]));
        }
    }
}

var recomputeAfterCalculation = function(dependencies, cached, sheet, row) {
    if (!dependencies.get(row)) {
        return;
    }
    for(var i = 0; i < dependencies.get(row).length; i++) {
        var val = sheet.get(dependencies.get(row)[i]);
        var arr = val.split(" ");
        if (attemptCompute(cached, dependencies, sheet, dependencies.get(row)[i], sheet.get(row), arr)) {
            console.log("Success! ")
            dependencies.get(row).splice(i, 1);
        }
    }
}

var cacheValueHelper = function(cached, dependencies, sheet, row, val) {
    cached.set(row, val);
    recomputeAfterCalculation(dependencies, cachedValues, sheet, row);
}

var attemptCompute = function(cached, dependencies, sheet, row, val, arr) {
    var cachedVal = 0;
    if (!isNaN(arr[0])) {
        cachedVal += parseInt(arr[0]);
    } else {
        console.log("cached: " + cached.get(arr[0]) + " of: " + arr[0]);
        if (cached.get(arr[0]) != undefined) {
            cachedVal += cached.get(arr[0]);
        } else {
            setupDependencies(dependencies, row, val);
            return false;
        }
    }
    for(var i = 1; i < arr.length; i++) {
        if (arr[i] == '+') {
            i++;
            if (!isNaN(arr[i])) {
                cachedVal += parseInt(arr[i]);
            } else if (cached.get(arr[i]) != undefined) {
                cachedVal += cached.get(arr[i]);
            } else {
                setupDependencies(dependencies, row, val);
                return false;
            }
        } else {
            setupDependencies(dependencies, row, val);
            return false;
        }
    }
    cacheValueHelper(this.cachedValues, this.dependencies, this.sheet, row, cachedVal);
    return true;
}

ExcelSheet.prototype.addValue = function(row, val) {
    this.sheet.set(row, val);
    var arr = val.split(" ");
    if (arr.length == 1) {
        if (!isNaN(arr[0])) {
            this.sheet.set(row, parseInt(arr[0]));
            cacheValueHelper(this.cachedValues, this.dependencies, this.sheet, row, parseInt(arr[0]));
        } else {
            if (this.cachedValues.get(arr[0]) != undefined) {
                cacheValueHelper(this.cachedValues, this.dependencies, this.sheet, row, this.cachedValues.get(arr[0]));
            } else {
                setupDependencies(this.dependencies, row, val);
            }
        }
    } else {
        attemptCompute(this.cachedValues, this.dependencies, this.sheet, row, val, arr);
    }
}

ExcelSheet.prototype.getValue = function(row) {
    if (this.cachedValues.get(row) != undefined) {
        console.log("Value for: " + row + " is: " + this.cachedValues.get(row));
    } else if (this.sheet.get(row) != undefined) {
        console.log("This value cannot be computed: " + this.sheet.get(row));
    } else {
        console.log("This row has not had a value set..");
    }
}

--------------------------------------------------------------------------------------------------------------
Question #9:
DFS

--------------------------------------------------------------------------------------------------------------
Rundown:
This is the DFS algorithm, both in recursive form as well as iterative form.

--------------------------------------------------------------------------------------------------------------

var tests = function() {
	var node1 = {
		val: 1,
		left: {
			val: 2,
			left: {
				val: 5,
				left: null,
				right : {
					val: 6,
					left: null,
					right: null
				}
			}, 
			right: null
		},
		right: {
			val: 9,
			left: null,
			right: {
				val: 10,
				left: {
					val: 11,
					left: null,
					right: null
				},
				right: {
					val: 12,
					left: {
						val: 17,
						left: null,
						right: null
					},
					right: null
				}
			}
		}
	};
	console.log("Is 12 present = " + dfs(node1, 12));
	console.log("Is 12 present = " + dfs(node1, 10));
	console.log("Is 12 present = " + dfs(node1, 3));
	console.log("Is 12 present = " + dfs(node1, 17));
	console.log("Is 12 present = " + dfsIter(node1, 12));
	console.log("Is 12 present = " + dfsIter(node1, 10));
	console.log("Is 12 present = " + dfsIter(node1, 3));
	console.log("Is 12 present = " + dfsIter(node1, 17));
	return;
}

var dfs = function(curr, val) {
	if (curr == null) return false;
	if (curr.val == val) return true;
	if (dfs(curr.left, val)) return true;
	if (dfs(curr.right, val)) return true;
	return false;
}

var dfsIter = function(node, val) {
	if (node == null) return false;
	var stack = [];
	stack.push(node);
	while(stack.length > 0) {
		var item = stack.pop();
		if (item.val == val) return true;
		if (item.left != null) {
			stack.push(item.left);
		}
		if (item.right != null) {
			stack.push(item.right);
		}
	}
	return false;
}

--------------------------------------------------------------------------------------------------------------
Question #10:
BFS

--------------------------------------------------------------------------------------------------------------
Rundown:
This is the BFS algorithm, only in iterative form.

--------------------------------------------------------------------------------------------------------------

var tests = function() {
	var node1 = {
		val: 1,
		left: {
			val: 2,
			left: {
				val: 5,
				left: null,
				right : {
					val: 6,
					left: null,
					right: null
				}
			}, 
			right: null
		},
		right: {
			val: 9,
			left: null,
			right: {
				val: 10,
				left: {
					val: 11,
					left: null,
					right: null
				},
				right: {
					val: 12,
					left: {
						val: 17,
						left: null,
						right: null
					},
					right: null
				}
			}
		}
	};
	console.log("Is 12 present = " + bfs(node1, 12));
	console.log("Is 12 present = " + bfs(node1, 10));
	console.log("Is 12 present = " + bfs(node1, 3));
	console.log("Is 12 present = " + bfs(node1, 17));
	return;
}

var bfs = function(node, val) {
	if (node == null) return false;
	var visited = [];
	var queue = [];
	queue.push(node);
	while(queue.length > 0) {
		var item = queue.shift();
		if (item.val == val) return true;
		if (visited.indexOf(item.val) < 0) {
			visited.push(item.val);
			if (item.left != null && visited.indexOf(item.left.val) < 0) {
				queue.push(item.left);
			}
			if (item.right != null && visited.indexOf(item.right.val) < 0) {
				queue.push(item.right);
			}
		}
	}
	return false;
}

--------------------------------------------------------------------------------------------------------------
Question #11:
Serialize and Deserialize a tree

--------------------------------------------------------------------------------------------------------------
Rundown:
The best approach for this is doing a BFS approach.

--------------------------------------------------------------------------------------------------------------

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

var bfs = function(root, arr) {
    if (root == null) return arr;
    var queue = [];
    queue.push(root);
    while(queue.length > 0) {
        var item = queue.shift();
        if (item == null) {
            arr.push(null);
        } else {
            arr.push(item.val);
            queue.push(item.left);
            queue.push(item.right);
        }
    }
};

var removeTrailingNulls = function(arr) {
    for(var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == null) {
            arr.pop();
        } else {
            break;
        }
    }
};

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    var arr = [];
    bfs(root, arr);
    removeTrailingNulls(arr);
    return JSON.stringify(arr);
};

var createNode = function(val) {
    return {
        val: val,
        left: {},
        right: {}
    }
};

var bfsCreate = function(arr) {
    var root = null;
    var stack = [];
    stack.push(null);
    while(arr.length > 0) {
        var item = arr.shift();
        var updatePlace = stack.shift();
        if (root == null) {
            updatePlace = createNode(item);
            root = updatePlace;
        } else {
            if (item == null) {
                updatePlace = null;
            } else {
                updatePlace.val = item;
                updatePlace.left = {};
                updatePlace.right = {};
            }
        }
        if (updatePlace != null) {
            stack.push(updatePlace.left);
            stack.push(updatePlace.right);
        }
    }
    return root;
};

var dfsFix = function(node) {
    if (node == null) return;
    if (typeof(node.left) == "object" && node.left.val == undefined) {
        node.left = null;
    } else {
        dfsFix(node.left);
    }
    if (typeof(node.right) == "object" && node.right.val == undefined) {
        node.right = null;
    } else {
        dfsFix(node.right);
    }
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    var tree = bfsCreate(JSON.parse(data));
    dfsFix(tree);
    return tree;
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */

 --------------------------------------------------------------------------------------------------------------
Question #12:
Dijkstras algorithm for shortest path between two nodes.

--------------------------------------------------------------------------------------------------------------
Rundown:
Just run the Dijkstras algorithm.

--------------------------------------------------------------------------------------------------------------

var test = function() {
	var nodes = [
		{
			val: 'A',
			connections: [
				{
					dest: 'B',
					cost: 10
				},
				{
					dest: 'C',
					cost: 15
				}
			]
		},
		{
			val: 'B',
			connections: [
				{
					dest: 'E',
					cost: 25
				}
			]
		},
		{
			val: 'C',
			connections: [
				{
					dest: 'F',
					cost: 4
				}, 
				{
					dest: 'D',
					cost: 12
				}
			]
		},
		{
			val: 'D',
			connections: [
				{
					dest: 'E',
					cost: 6
				}
			]
		},
		{
			val: 'E',
			connections: []
		}, 
		{
			val: 'F',
			connections: [
				{
					dest: 'D',
					cost: 2
				}
			]
		}
	];
	console.log("min path val (A -> E): " + dijkstra(nodes, 'A', 'E'));
	console.log("min path val (A -> D): " + dijkstra(nodes, 'A', 'D'));
	console.log("min path val (A -> F): " + dijkstra(nodes, 'A', 'F'));
	return;
};

var dijkstra = function(nodes, start, end) {
	var startInd = 0;
	var visited = [];
	var lookup = new Map();
	for(var i = 0; i < nodes.length; i++) {
		if (nodes[i].val == start) startInd = i;
		nodes[i].minVal = Number.MAX_SAFE_INTEGER;
		visited.push(nodes[i].val);
		lookup.set(nodes[i].val, i);
	}
	var currNode = nodes[startInd];
	currNode.minVal = 0;
	while(visited.length > 0) {
		var nextNodeInd = -1;
		var nextNodeDist = Number.MAX_SAFE_INTEGER;
		for(var i = 0; i < currNode.connections.length; i++) {
			var dest = currNode.connections[i].dest;
			var dist = currNode.connections[i].cost;
			var combinedDist = (currNode.minVal + dist);
			if (nodes[lookup.get(dest)].minVal > combinedDist) {
				nodes[lookup.get(dest)].minVal = combinedDist;
			}
			if (combinedDist < nextNodeDist) {
				nextNodeDist = combinedDist;
				nextNodeInd = lookup.get(dest);
			}
		}
		visited.splice(visited.indexOf(currNode.val), 1);
		if (nextNodeInd == -1) {
			currNode = nodes[lookup.get(visited[0])];
		} else {
			currNode = nodes[nextNodeInd];
		}
	}
	return nodes[lookup.get(end)].minVal;
}

 --------------------------------------------------------------------------------------------------------------
Question #13:
Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST.

Basically, the deletion can be divided into two stages:

Search for a node to remove.
If the node is found, delete the node.
--------------------------------------------------------------------------------------------------------------
Rundown:
Find the node you are looking for while keeping track of the previous node.
Once found you need to conditionally check where it is in one of 3 cases:
1) Leaf Node -> delete
2) Has one child -> swap with child
3) has two children -> swap with smallest on right subtree, then delete from right subtree after swap.

--------------------------------------------------------------------------------------------------------------

var tests = function() {
	var node1 = {
		val: 5,
		left: {
			val: 3,
			left: {
				val: 2,
				left: null,
				right: null
			},
			right: {
				val: 4,
				left: null,
				right: null
			}
		},
		right: {
			val: 6,
			left: null,
			right: {
				val: 7,
				left: null,
				right: null
			}
		}
	};
	console.log("delete node: ", deleteNode(node1, 5));
	return;
}

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
 
 var findSmallestOnRight = function(curr, key) {
    var visited = [];
    var queue = [];
    var smallest = Number.MAX_SAFE_INTEGER;
    var smallestObj;
    queue.push(curr);
    while(queue.length > 0) {
        var item = queue.shift();
        if (item.val < smallest) {
            smallestObj = item;
            smallest = item.val;
        }
        if (visited.indexOf(item.val) < 0) {
            visited.push(item.val);
            if (item.left != null && visited.indexOf(item.left.val) < 0) {
                queue.push(item.left);
            }
            if (item.right != null && visited.indexOf(item.right.val) < 0) {
                queue.push(item.right);
            }
        }
    }
    smallestObj.val = key;
    return smallest;
 }
 
 var foundNode = function(prev, curr, dir) {
     if (prev == null && dir == null) {
         //this is the root node
         if (curr.left == null && curr.right == null) {
         	curr = null;
         	return;
         } else if (curr.left == null) {
         	curr = curr.right;
         	return;
         } else if (curr.right == null) {
         	curr = curr.left;
         	return;
         } else {
         	var tmpSwapVal = curr.val;
         	var replace = findSmallestOnRight(curr.right, tmpSwapVal);
         	curr.val = replace;
         	findNode(curr, curr.right, 'right', tmpSwapVal);
         }
     } else {
         if (curr.left == null && curr.right == null) {
             //leaf node
             if (dir == 'left') {
                prev.left = null;
                return;
             } else {
                prev.right = null;
                return;
             }
         } else if (curr.left == null) {
             //has right value
             if (dir == 'left') {
                prev.left = curr.right;
                return;
             } else {
                prev.right = curr.right;
                return;
             }
         } else if (curr.right == null) {
             //has left value
             if (dir == 'left') {
                prev.left = curr.left;
                return;
             } else {
                prev.right = curr.left;
                return;
             }
         } else {
            //has both left and right values
            var tmpSwapVal = curr.val;
            var replace = findSmallestOnRight(curr.right, tmpSwapVal);
            curr.val = replace;
            findNode(curr, curr.right, 'right', tmpSwapVal);
         }
     }
 }
 
 var findNode = function(prev, curr, dir, key) {
 	if (curr == null) return;
     if (curr.val == key) {
        return foundNode(prev, curr, dir);
     } else {
         if (curr.val > key) {
            return findNode(curr, curr.left, 'left', key);
         } else {
            return findNode(curr, curr.right, 'right', key);
         }
     }
 }
 
/**
 * @param {TreeNode} root
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function(root, key) {
    findNode(null, root, null, key);
    return root;
};

 --------------------------------------------------------------------------------------------------------------
Question #14:
Build a trie
--------------------------------------------------------------------------------------------------------------
Rundown:
--------------------------------------------------------------------------------------------------------------

var tests = function() {
	var words = ['talk', 'test', 'apple', 'airshow', 'art'];
	var trie1 = new Trie();
	for(var i = 0; i < words.length; i++) {
		trie1.insert(words[i]);
	}
	console.log("trie: ", trie1.root);
	console.log("talk inside: " + trie1.wordInside("talk"));
}

var Trie = function() {
	this.root = [];
};

var insertHelper = function(curr, val) {
	var found = -1;
	for(var i = 0; i < curr.length; i++) {
		if (curr[i].char == val) {
			found = i;
			break;
		}
	}
	if (found == -1) {
		curr.push({
			char: val,
			words: [],
			connections: []
		});
		return {
			next: curr[curr.length - 1].connections,
			words: curr[curr.length - 1].words
		};
	} else {
		return {
			next: curr[found].connections,
			words: curr[found].words
		};
	}
};

Trie.prototype.insert = function(str) {
	var strArr = str.split("");
	var curr = this.root;
	var words;
	for(var i = 0; i < strArr.length; i++) {
		var next = insertHelper(curr, strArr[i]);
		curr = next.next;
		words = next.words;
	}
	words.push(str);
};

var searchHelper = function(curr, item) {
	var found = -1;
	for(var i = 0; i < curr.length; i++) {
		if (curr[i].char == item) {
			found = i;
			break;
		}
	}
	if (found == -1) {
		return {
			success: false,
			next: null,
			words: null
		}
	}
	return {
		success: true,
		next: curr[found].connections,
		words: curr[found].words
	}
};

Trie.prototype.wordInside = function(str) {
	var strArr = str.split("");
	var curr = this.root;
	var words;
	for(var i = 0; i < strArr.length; i++) {
		var tmp = searchHelper(curr, strArr[i]);
		if (!tmp.success) return false;
		curr = tmp.next;
		words = tmp.words;
	}
	if (words.indexOf(str) >= 0) return true;
	return false;
};

 --------------------------------------------------------------------------------------------------------------
Question #15:
Given a binary search tree, write a function kthSmallest to find the kth smallest element in it.

Note: 
You may assume k is always valid, 1 ? k ? BST's total elements.
--------------------------------------------------------------------------------------------------------------
Rundown:
Run an in-order traversal of the BST and push to a global stack.
--------------------------------------------------------------------------------------------------------------

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
var orderedStack = [];

var recurseToBottom = function(curr) {
    if (curr.left == null && curr.right == null) {
        //leaf node
        orderedStack.push(curr.val);
        return;
    } else if (curr.left == null) {
        //only right
        orderedStack.push(curr.val);
        return recurseToBottom(curr.right);
    } else if (curr.right == null) {
        //only left
        recurseToBottom(curr.left);
        orderedStack.push(curr.val);
        return;
    } else {
        //none are null
        recurseToBottom(curr.left);
        orderedStack.push(curr.val);
        recurseToBottom(curr.right);
        return;
    }
};
 
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
    recurseToBottom(root);
    return orderedStack[k - 1];
};

 --------------------------------------------------------------------------------------------------------------
Question #15:
Given a set of candidate numbers (C) (without duplicates) and a target number (T), find all unique combinations in C where the candidate numbers sums to T.

The same repeated number may be chosen from C unlimited number of times.

Note:
All numbers (including target) will be positive integers.
The solution set must not contain duplicate combinations.
For example, given candidate set [2, 3, 6, 7] and target 7, 
--------------------------------------------------------------------------------------------------------------
Rundown:
Dynamic programming where you check same level for multiples as well as previous level for additional sums.
--------------------------------------------------------------------------------------------------------------


/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var tests = function() {
    console.log("combinations: ", combinationSum([2,3,6,7], 7));
} 

var canCreate = function(arr, val, yPos, sum) {
    var sumContainer = [];
    for(var y = yPos; y >= 0; y--) {
        if (arr[y][sum - val]) {
            for(var k = 0; k < arr[y][sum - val].length; k++) { 
                var tmp = arr[y][sum - val][k].concat(val);
                sumContainer.push(tmp);
            }
        }
    }
    return sumContainer;
}

var combinationSum = function(candidates, target) {
    var arr = new Array(candidates.length + 1);
    for(var y = 0; y < arr.length; y++) {
        arr[y] = new Array(target + 1);
    }
    
    for(var y = 0; y < arr.length; y++) {
        for(var x = 0; x <= target; x++) {
            if (candidates[y] > x) continue;
            if (candidates[y] == x) {
                arr[y][x] = [[candidates[y]]];
            } else {
                var tmp = canCreate(arr, candidates[y], y, x);
                arr[y][x] = tmp;
            }
        }
    }
    var returnVal = [];
    for(var y = 0; y < arr.length; y++) {
        if (arr[y][target]) {
            for(var k = 0; k < arr[y][target].length; k++) {
                returnVal.push(arr[y][target][k]);
            }
        }
    }
    return returnVal;
};

 --------------------------------------------------------------------------------------------------------------
Question #16:
Reverse a singly linked list.
--------------------------------------------------------------------------------------------------------------
Rundown:
Done both recursively and iteratively.
--------------------------------------------------------------------------------------------------------------

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
 
var tests = function() {
    var list = {
        val: 1,
        next: {
            val: 2,
            next: {
                val: 3,
                next: null
            }
        }
    };
    var list2 = {
        val: 1,
        next: null
    };
    console.log("reveresed list: ", reverseList(list));
    console.log("reveresed list: ", reverseList(list2));
} 

var newHead;

var recurseReverse = function(prev, curr) {
    if (curr.next == null) {
        curr.next = prev;
        prev.next = null;
        newHead = curr;
        return;
    } else {
        recurseReverse(curr, curr.next);
        curr.next = prev;
        prev.next = null;
    }
} 

var reverseIterative = function(head) {
    var stack = [];
    stack.push(head);
    var curr = head.next;
    var foundBack = false;
    while (stack.length > 0) {
        if (foundBack) {
            var prev = stack.pop();
            curr.next = prev;
            prev.next = null;
            curr = prev;
        } else {
            if (curr.next == null) {
                var prev = stack.pop();
                curr.next = prev;
                prev.next = null;
                newHead = curr;
                curr = prev;
                foundBack = true;
            } else {
                stack.push(curr);
                curr = curr.next;
            }
        }
    }
}

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    if (head == null) return null;
    if (head.next == null) return head;
    newHead = undefined;
    //recurseReverse(head, head.next);
    reverseIterative(head);
    return newHead;
};

 --------------------------------------------------------------------------------------------------------------
Question #17:
Make a program that was able to store files, each file would come as a tuple with the information in it, 
a unique identifier and the creation date. You had to be able to store, update and retrieve each version of 
the file as changes happened.
--------------------------------------------------------------------------------------------------------------
Rundown:
--------------------------------------------------------------------------------------------------------------

var tests = function() {
	var store = new FileStore();
	store.insert("temp data 1. Wow this data is cool!", "firstfile.txt", new Date());
	console.log("get firstfile.txt", store.retrieve("firstfile.txt"));
	store.update("temp data 2. This should be v2", "firstfile.txt");
	console.log("get firstfile.txt", store.retrieve("firstfile.txt"));
	console.log("get firstfile.txt v1", store.retrieve("firstfile.txt", 1));
}

var FileStore = function() {
	this.store = new Map();
};

FileStore.prototype.insert = function(data, name, date) {
	if (this.store.get(name) != undefined) return false;
	this.store.set(name, [{
		stored_data: data,
		saved: date
	}]);
	return true;
};

FileStore.prototype.update = function(data, name) {
	if (this.store.get(name) == undefined) return false;
	var saved = this.store.get(name);
	saved.push({
		stored_data: data,
		saved: new Date()
	});
	return true;
};

FileStore.prototype.retrieve = function(name, ver = null) {
	if (this.store.get(name) == undefined) return false;
	var saved = this.store.get(name);
	if (ver) {
		return saved[ver - 1]; //probably subtract 1 since v1 is init.
	} else {
		return saved[saved.length - 1];
	}
};

 --------------------------------------------------------------------------------------------------------------
Question #18:
Given a non-empty string s and a dictionary wordDict containing a list of non-empty words, determine if s can be segmented into a space-separated sequence of one or more dictionary words. You may assume the dictionary does not contain duplicate words.

For example, given
s = "leetcode",
dict = ["leet", "code"].

Return true because "leetcode" can be segmented as "leet code".
--------------------------------------------------------------------------------------------------------------
Rundown:
Dynamic programming solution: Initially create a 2d array with the size of the string.
Base case: Check if single characters are in the dictionary if they are set up the diagonal initially.
Then start checking the ranges so: 0-1, 1-2, etc. Check if the whole string is in the dictionary if it is true, else
check if you can split the string your checking into smaller components that are in the dictionary (so refernce back to array)
Return [0][s.length - 1]
--------------------------------------------------------------------------------------------------------------

var tests = function() {
	console.log("arr: ", wordBreak("leetcode", ["leet", "code"]));
	console.log("arr: ", wordBreak("aaaaaaa", ["aaaa", "aaa"]));
};

var splitWithPrev = function(arr, y, x) {
	for(var k = y; k < x; k++) {
		if (arr[y][k] == true && arr[k + 1][x] == true) {
			return true;
		}
	}
	return false;
};

var wordBreak = function(s, dict) {
	var arr = new Array(s.length);
	for(var i = 0; i < s.length; i++) {
		arr[i] = new Array(s.length);
		if (dict.indexOf(s[i]) >= 0) {
			arr[i][i] = true;
		} else {
			arr[i][i] = false;
		}
	}
	for(var l = 1; l < s.length; l++) {
		for(var y = 0; y < s.length; y++) {
			var x = y + l;
			if ((dict.indexOf(s.slice(y, x + 1)) >= 0) || splitWithPrev(arr, y, x)) {
				arr[y][x] = true;
			} else {
				arr[y][x] = false;
			}
		}
	}

	return arr[0][s.length - 1];
};

 --------------------------------------------------------------------------------------------------------------
Question #19:
Design a data structure that supports all following operations in average O(1) time.

insert(val): Inserts an item val to the set if not already present.
remove(val): Removes an item val from the set if present.
getRandom: Returns a random element from current set of elements. Each element must have the same probability of being returned.
--------------------------------------------------------------------------------------------------------------
Rundown:
Have a map that is used to store index values, and then an array to store the actual values.
Insert: add it to the array, and track the index value in the map.
Remove: Check to see if the val is at the end of the array, if it is just remove from map and pop array.
If it is not at the end of the array, swap with whatever is at the end of the array (update the map value for this swap).
Then pop and delete from map.
getRandom: random number and return value in array.
--------------------------------------------------------------------------------------------------------------

/**
 * Initialize your data structure here.
 */
 
var tests = function() {
    var a = new RandomizedSet();
    console.log(a.insert(0)); //[0]
    console.log(a.insert(1)); //[0,1]
    console.log(a.remove(0)); //[1]
    console.log(a.insert(2)); //[1,2]
    console.log(a.remove(1)); //[2]
    console.log(a.getRandom()); // -> 2
}
 
var RandomizedSet = function() {
    this.store = [];
    this.indLookup = new Map();
};

/**
 * Inserts a value to the set. Returns true if the set did not already contain the specified element. 
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function(val) {
    if (this.indLookup.get(val) != undefined) return false;
    var tmp = this.store.push(val);
    this.indLookup.set(val, (tmp - 1));
    return true;
};

/**
 * Removes a value from the set. Returns true if the set contained the specified element. 
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function(val) {
    if (this.indLookup.get(val) == undefined) return false;
    var ind = this.indLookup.get(val);
    if (ind < this.store.length - 1) {
        //not the last one
        var tmpVal = this.store[this.store.length - 1];
        this.store[this.store.length - 1] = val;
        this.store[ind] = tmpVal;
        this.indLookup.set(tmpVal, ind);
    }
    this.indLookup.delete(val);
    this.store.pop();
    return true;
};

/**
 * Get a random element from the set.
 * @return {number}
 */
RandomizedSet.prototype.getRandom = function() {
    var rand = Math.floor(Math.random() * this.store.length);
    return this.store[rand];
};

/** 
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = Object.create(RandomizedSet).createNew()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */

 --------------------------------------------------------------------------------------------------------------
Question #20:
Determine if a Sudoku is valid, according to: Sudoku Puzzles - The Rules.

The Sudoku board could be partially filled, where empty cells are filled with the character '.'.
--------------------------------------------------------------------------------------------------------------
Rundown:
Go through the suduko board once, and when ever you see a value that is not '.' add it to the cols map,
rows map, and cube map. While adding to the maps check to see if it already exists, and if it does then the suduko
board is not valid.
--------------------------------------------------------------------------------------------------------------

/**
 * @param {character[][]} board
 * @return {boolean}
 */

var rows = new Map();
var cols = new Map();
var cubes = new Map();

var getRegionNumber = function(i) {
    if (i >= 0 && i <= 2) {
        return 1;
    } else if (i >= 3 && i <= 5) {
        return 2;
    } else {
        // i>= 6 && i<= 8
        return 3;
    }
}

var getRegion = function(y, x) {
    return getRegionNumber(y) + "-" + getRegionNumber(x);
}

var addValue = function(val, y, x) {
    var row = rows.get(y);
    if (row == undefined) {
        rows.set(y, []);
        rows.get(y).push(val);
    } else {
        if (row.indexOf(val) >= 0) return false;
        row.push(val);
    }
    var col = cols.get(x);
    if (col == undefined) {
        cols.set(x, []);
        cols.get(x).push(val);
    } else {
        if (col.indexOf(val) >= 0) return false;
        col.push(val);
    }
    var region = getRegion(y, x);
    var cube = cubes.get(region);
    if (cube == undefined) {
        cubes.set(region, []);
        cubes.get(region).push(val);
    } else {
        if (cube.indexOf(val) >= 0) return false;
        cube.push(val);
    }
    
    return true;
};

var processing = function(board) {
    for(var y = 0; y < board.length; y++) {
        for(var x = 0; x < board.length; x++) {
            if (board[y][x] != '.') {
                if (!addValue(board[y][x], y, x)) return false;
            }
        }
    }
    return true;
};

var isValidSudoku = function(board) {
    rows.clear();
    cols.clear();
    cubes.clear();
    return processing(board);
};

--------------------------------------------------------------------------------------------------------------
Question #21:
Rotate array by k.
--------------------------------------------------------------------------------------------------------------
Rundown:
unshift the pop
--------------------------------------------------------------------------------------------------------------

var rotate = function(arr, k) {
	var i = k % arr.length;
	while(i--) {
		arr.unshift(arr.pop());
	}
}

var rotateLeft = function(arr, k) {
	for(var i = 1; i <= k; i++) {
		arr.push(arr.shift());
	}
}
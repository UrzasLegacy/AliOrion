
const combo49s = initCombination([4,5,6,7,8,9,10],49)

function initCombination()
    {
    TextWindow.Open();
    TextWindow.Clear();
    var candidates = [4,5,6,7,8,9,10];
    var target = 49;
    var ans = [];
    var currComb = [];
    combination(candidates, target, currComb, 0, 0, ans);
    Orion.Print('Number of possible combinations: ' + ans.length);
    TextWindow.Print('[');
    ans.forEach(function(answer)
    	{
    	TextWindow.Print(JSON.stringify(ArrayFormat(answer)) + ',');
    	});
    TextWindow.Print(']');
    }

function CombinationCall(candidates,target)
    {
    var ans = [];
    var currComb = [];
    combination(candidates, target, currComb, 0, 0, ans);
    return ans;
    }

function combination(candidates, target, currComb, currSum, currIndex, ans)
    {
    var currCombClone = ArrayClone(currComb);
    if(currSum > target) return; //backtrack
    if(currSum == target)
        {
        ans.unshift(ArrayFormat(currCombClone)); //store the solution and backtrack
        return;
        }
    for(var i=currIndex;i<candidates.length;i++)
        { //try all possible options for the next level
        currCombClone.push(candidates[i]); //put 1 option into the combination
        currSum+=candidates[i];
        combination(candidates, target, currCombClone, currSum, i, ans); //try with this combination, whether it gives a solution or not.
        currCombClone.pop(); //when this option backtrack to here, remove this and go on to the next option.
        currSum-=candidates[i];
        }
    }

function ArrayClone(arr)
	{
	var clone = [];
	for(var i=0;i<arr.length;i++)
		clone[i] = arr[i];
	return clone;
	}

function ArrayFormat(arr)
    {
    var emptyArr = [0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0;i<arr.length;i++)
        {
        emptyArr[arr[i] - 1]++
        }
    return emptyArr;
    }
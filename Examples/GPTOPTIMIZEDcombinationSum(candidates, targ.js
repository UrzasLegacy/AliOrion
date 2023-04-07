function combinationSum(candidates, target)
    {
    var results = [];
    candidates.sort(function (a, b) { return a - b; });
    function backtrack(combination, currentSum, remainingTarget, start)
        {//TextWindow.Print("combination:" + combination + "currentSum:" + currentSum + "remainingTarget:" + remainingTarget + "start:" + start);
        if(remainingTarget === 0)
            {//TextWindow.Print("found combination:" + combination);
            results.push(ArrayFormat(combination));
            return;
            }
        for(var i = start; i < candidates.length; i++)
            {//TextWindow.Print("considering candidate:" +  candidates[i]);
            if (candidates[i] > remainingTarget)
                break; //TextWindow.Print("candidate too large, stopping loop");
            backtrack(combination.concat(candidates[i]), currentSum + candidates[i], remainingTarget - candidates[i], i);
            }
        }
    backtrack([], 0, target, 0);
    return results;
    }

function test() {
    var b = combinationSum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 50)
    Orion.Print(b.length);
    //TextWindow.Open();
    var c = JSON.stringify(b);
    var d = c.replace(/],/g, ']\n');
    TextWindow.Print(d)
}

function combinationSum(candidates, target)
    {
    var results = [];
    candidates.sort(function (a, b) { return a - b; });
    function backtrack(combination, currentSum, remainingTarget, start){
        if(remainingTarget === 0)
            return results.push(ArrayFormat(combination));
        for(var i = start; i < candidates.length; i++){
            if (candidates[i] > remainingTarget)
                break;
            backtrack(combination.concat(candidates[i]), currentSum + candidates[i], remainingTarget - candidates[i], i);
        }
    }
    backtrack([], 0, target, 0);
    return results;
}

function test()
	{
	var startTime = Orion.Now();
	var b = combinationSum([1,2,3,4,5,6,7,8,9,10], 50)
	Orion.Print(b.length);
	TextWindow.Open();
	var c = JSON.stringify(b);
	TextWindow.Print(c)
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
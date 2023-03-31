function elves()
    {
    var file = Orion.NewFile();
    file.Open(Orion.CurrentScriptDirPath() + '/adventdata.txt', true);
    var data = file.ReadAll();
    file.Close();
    var sortedMostCalories = data.split('\n\n').map(function(ele){return ele.split('\n').reduce(function(sum,current){return sum + +current},0)}).sort(function(a,b){return b - a});
    Orion.Print(sortedMostCalories[0]);
    Orion.Print(sortedMostCalories[0] + sortedMostCalories[1] + sortedMostCalories[2]);
    }

function RPS()
	{
    var file = Orion.NewFile();
    file.Open(Orion.CurrentScriptDirPath() + '/adventdata.txt', true);
    var data = file.ReadAll();
    file.Close();
    var obj = {
        'A': [1,3],
        'B': [2,1],
        'C': [3,2],
        'X': 1,
        'Y': 2,
        'Z': 3,
    }
	var arr = data.split('\n');
	TextWindow.Open();
    TextWindow.Print(JSON.stringify(arr));
    var map = arr.map(function(ele){return ele.split(' ')});
    var red = map.reduce(function(sum,current)
        {
        var points = 0;
        var opp = obj[current[0]];
        var me = obj[current[1]];
        if(opp[0] == me) points += 3;
        else if(opp[1] != me) points += 6;
        points += me;
        return points + sum;
        },0);
        Orion.Print(red);
	}

function RPS2()
	{
    var file = Orion.NewFile();
    file.Open(Orion.CurrentScriptDirPath() + '/adventdata.txt', true);
    var data = file.ReadAll();
    file.Close();
    var obj = {
        'A': [1,2,3],
        'B': [2,3,1],
        'C': [3,1,2],
        'X': 3,
        'Y': 1,
        'Z': 2,
        }
	var arr = data.split('\n').map(function(ele){return ele.split(' ')});
    var red = arr.reduce(function(sum,current)
        {
        var points = 0;
        var opp = obj[current[0]];
        var me = obj[current[1]];
        if(me == 1) points += 3;
        else if(me == 2) points += 6;
        points += opp[me-1];
        return points + sum;
        },0);
    Orion.Print(red);
	}

function rucksack()
    {
    var file = Orion.NewFile();
    file.Open(Orion.CurrentScriptDirPath() + '/adventdata.txt', true);
    var data = file.ReadAll();
    file.Close();
    var split = data.split('\n');
    var map = split.map(function(line)
        {
        var a = line.slice(0,line.length / 2);
        var b = line.slice(line.length / 2);
        for(var i=0;i<a.length;i++)
            {
            var sol = a[i]
            if(b.indexOf(sol) != -1)
                break;
            }
        return sol;
        })
    var lookup = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var total = map.reduce(function(sum,current)
        {
        var priority = lookup.indexOf(current);
        return sum + priority;
        },0);
    Orion.Print(total)
    }

function rucksack2()
    {
    var file = Orion.NewFile();
    file.Open(Orion.CurrentScriptDirPath() + '/adventdata.txt', true);
    var data = file.ReadAll();
    file.Close();
    var split = data.split('\n');
    var arr = [];
    for(var i=0;i<split.length; i += 3)
        {
        var line1 = split[i];
        var line2 = split[i+1];
        var line3 = split[i+2];
        arr.push([line1,line2,line3]);
        }
    var map = arr.map(function(groups)
        {
        var largest = groups.sort(function(a,b)
            {
            return b.length - a.length;
            });
        for(var i=0;i<largest[0].length;i++)
            {
            var sol = largest[0][i];
            if(largest[1].indexOf(sol) != -1 && largest[2].indexOf(sol) != -1)
                break;
            }
        return sol;
        })
    var lookup = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var total = map.reduce(function(sum,current)
        {
        var priority = lookup.indexOf(current);
        return sum + priority;
        },0);
    Orion.Print(total)
    }

function assignmentpairs()
    {
    var file = Orion.NewFile();
    file.Open(Orion.CurrentScriptDirPath() + '/adventdata.txt', true);
    var data = file.ReadAll();
    file.Close();
    var pairs = data.split('\n');
    var sol = 0;
    //pairs = ['10-74,9-73']
    for(var i=0;i<pairs.length;i++) 
        {
        var currPair = pairs[i];
        var currSplit = currPair.split(',');
        var pairA = currSplit[0].split('-');
        var pairB = currSplit[1].split('-');
        var pairAmin = +pairA[0];
        var pairAmax = +pairA[1];
        var pairBmin = +pairB[0];
        var pairBmax = +pairB[1];
        //Orion.Print(pairAmin + '-' + pairAmax + ',' + pairBmin + '-' + pairBmax);
        if(pairAmin >= pairBmin && pairAmin <= pairBmax)
            sol++;
        else if(pairAmax <= pairBmin && pairAmax >= pairBmax)
            sol++;
        else if(pairBmin >= pairAmin && pairBmin <= pairAmax)
            sol++;
        else if(pairBmax <= pairAmin && pairBmax >= pairAmax)
            sol++;
        
        }
    Orion.Print(sol);
    }
function initScripts()
    {
    Orion.Exec('SuitGrab',true);
    Orion.Exec('StayLoggedIn', true);
    }

function SuitGrab()
    {
    Orion.CharPrint(self, 1159, 'Target container to put assembled suits.\nIt should contain empty backpacks for each suit.');
    Orion.WaitForAddObject('myTarget');
    var parentContainer = Orion.GetSerial('myTarget');
    while(true)
        {
        var suit = GetSuit(); //
        Orion.Wait(1000);
        Orion.PauseScript('StayLoggedIn');
        Orion.Wait(1000);
        for(var i=0;i<suit.length;i++)
            {
            Orion.MoveItem(suit[i][5]);
            Orion.Wait(2000);
            }
        Orion.Wait(1000);
        Orion.ResumeScript('StayLoggedIn');
        Orion.Wait(1000);
        }
    }

function StayLoggedIn()
    {
    while(true)
        {
        Orion.UseObject(backpack);
        Orion.Wait(120000);
        }
    }

function ShallowCopy(arr)
    {
    var copy = JSON.stringify(arr);
    return JSON.parse(copy);
    }

function GetSuit(_)
    {
    var targetResists = [42,42,42,41,37];
    var targetLows = [1,1,1,2,1];
    var helmPiece;
    var gorgetPiece;
    var tunicPiece;
    var armsPiece;
    var glovesPiece;
    var legsPiece;
    var helmLows;
    var gorgetLows;
    var tunicLows;
    var armsLows;
    var glovesLows;
    var i = 0;
    var helmArr = GetResistArrays('Helm', targetLows); //this is an array of all armor pieces of this type that have a necessary low resist. [phys,fire,cold,poison,energy,serialNumber,[lowPhys,lowFire,lowCold,lowPoison,lowPoison]]
    for(var helm = 0;helm<helmArr.length;helm++)
        {
        Orion.Print('Helm Loop');
        helmLows = ShallowCopy(targetLows); //this is the array that tracks which low resists are still necessary for a suit. ShallowCopy creates a new array reference in memory
        helmPiece = helmArr[helm]; //this is the current armor piece being evaluated in each iteration of a loop
        var pieceLows = helmPiece[6]; //this is an array of the necessary target lows updated at each loop layer [0,0,0,0,0]
        for(var low = 0;low<pieceLows.length;low++)
            {
            if(pieceLows[low] > 0) //this logic determines which low resist is being covered by this armor piece
                helmLows[low]--; //and decrements the corresponding resist in the lows array accordingly
            }
        var gorgetArr = GetResistArrays('Gorget', helmLows); //the updated targetLows array is passed into the function that finds armor pieces of the next type, which can then exclude pieces that have a low resist we dont need.
        for(var gorget = 0;gorget<gorgetArr.length;gorget++)
            {
            Orion.Print('Gorget Loop');
            gorgetLows = ShallowCopy(helmLows);
            gorgetPiece = gorgetArr[gorget];
            var pieceLows = gorgetPiece[6];
            for(var low = 0;low<pieceLows.length;low++)
                {
                if(pieceLows[low] > 0)
                    gorgetLows[low]--
                }
            var tunicArr = GetResistArrays('Tunic', gorgetLows);
            for(var tunic = 0;tunic<tunicArr.length;tunic++)
                {
                Orion.Print('Tunic Loop');
                tunicLows = ShallowCopy(gorgetLows);
                tunicPiece = tunicArr[tunic];
                var pieceLows = tunicPiece[6];
                for(var low = 0;low<pieceLows.length;low++)
                    {
                    if(pieceLows[low] > 0)
                        tunicLows[low]--
                    }
                var armsArr = GetResistArrays('Arms', tunicLows);
                for(var arms = 0;arms<armsArr.length;arms++)
                    {
                    Orion.Print('Arms Loop');
                    armsLows = ShallowCopy(tunicLows);
                    armsPiece = armsArr[arms];
                    var pieceLows = armsPiece[6];
                    for(var low = 0;low<pieceLows.length;low++)
                        {
                        if(pieceLows[low] > 0)
                            armsLows[low]--
                        }
                    var glovesArr = GetResistArrays('Gloves', armsLows);
                    for(var gloves = 0;gloves<glovesArr.length;gloves++)
                        {
                        Orion.Print('Gloves Loop');
                        glovesLows = ShallowCopy(armsLows);
                        glovesPiece = glovesArr[gloves];
                        var pieceLows = glovesPiece[6];
                        for(var low = 0;low<pieceLows.length;low++)
                            {
                            if(pieceLows[low] > 0)
                                glovesLows[low]--
                            }
                        var legsArr = GetResistArrays('Legs', glovesLows);
                        for(var legs = 0;legs<legsArr.length;legs++)
                            {
                            Orion.Print('Legs Loop');
                            Orion.PrintFast(self, 1159, 0, i++);
                            legsPiece = legsArr[legs];
                            var suitArr = [helmPiece, gorgetPiece, tunicPiece, armsPiece, glovesPiece, legsPiece];
                            var sumArr = ArrayAdder(suitArr);
                            if(ArrayCompare(targetResists, sumArr))
                                {
                                return suitArr;
                                }
                            }
                        }
                    }
                }
            }
        Orion.PauseScript('StayLoggedIn');
        Orion.Wait(1000);
        Orion.MoveItem(helmPiece[5]);
        Orion.Wait(1000);
        Orion.ResumeScript('StayLoggedIn');
        }        
    }

function AdderTest()
    {
    var a = [ [1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1] ]
    var b = ArrayAdder(a);
    Orion.Print(JSON.stringify(b))
    }

function CompareTest()
    {
    var a = [6,7,5,4,5]
    var b = [6,7,5,4,5]
    Orion.Print(ArrayCompare(a,b))
    }

function ArrayCompare(targetArr, currentArr)
    {
    var resists = currentArr[0];
    var lows = currentArr[1];
    for(var i=0;i<targetArr.length;i++)
        {
        if(resists[i] < targetArr[i])
            {
            return false;
            }
        }
    for(var i=0;i<lows.length;i++)
        {
        if(i == 3)
            var check = 2;
        else
            var check = 1;
        if(lows[i] < check)
            {
            return false;
            }
        }
    return true;
    }

function ArrayAdder(arr)
    {
    var resistArr = [0,0,0,0,0];
    var lowRollArr = [0,0,0,0,0];
    for(var i=0;i<arr.length;i++)
        {
        var itemObj = Orion.FindObject(arr[i][5]);
        var parse = PlatemailParse(itemObj);
        resistArr[0] += arr[i][0];
        if(parse.Physical)
            lowRollArr[0]++
        resistArr[1] += arr[i][1];
        if(parse.Fire)
            lowRollArr[1]++;
        resistArr[2] += arr[i][2];
        if(parse.Fire)
            lowRollArr[2]++;
        resistArr[3] += arr[i][3];
        if(parse.Poison)
            lowRollArr[3]++;
        resistArr[4] += arr[i][4];
        if(parse.Energy)
            lowRollArr[4]++;
        }
    return [resistArr, lowRollArr];
    }

function GetResistArrays(layerName, targetLows)
    {
    var parentContainer = Orion.FindTypeEx(any, any, ground, 'item', 2).filter(function(chest)
        {
        return Orion.Contains(chest.Properties(), 'Engraved: ' + layerName);
        })[0];
    if(!parentContainer || parentContainer.Distance() > 2)
        return Orion.Print('Parent Container not found! Halting...');
    while(!Orion.GumpExists('container', parentContainer.Serial()))
        {
        Orion.CharPrint(self,1159,'Opening Destination Container');
        Orion.UseObject(parentContainer.Serial());
        Orion.Wait(1300);
        }
    var subContainerPerfect = Orion.FindTypeEx('0x0E75','0x0000',parentContainer.Serial()).filter(function(backpack)
        {
        return Orion.Contains(backpack.Properties(), 'Engraved: Perfect');
        })[0];
    var subContainerAcceptable = Orion.FindTypeEx('0x0E75','0x0000',parentContainer.Serial()).filter(function(backpack)
        {
        return Orion.Contains(backpack.Properties(), 'Engraved: Acceptable');
        })[0];
    while(!Orion.GumpExists('container', subContainerPerfect.Serial()))
        {
        Orion.CharPrint(self,1159,'Opening Perfect Subcontainer');
        Orion.UseObject(subContainerPerfect.Serial());
        Orion.Wait(1300);
        }
    while(!Orion.GumpExists('container', subContainerAcceptable.Serial()))
        {
        Orion.CharPrint(self,1159,'Opening Acceptable Subcontainer');
        Orion.UseObject(subContainerAcceptable.Serial());
        Orion.Wait(1300);
        }
    if(targetLows.every(function(low){ return low <= 0 }))
        var itemsRaw = Orion.FindTypeEx('!0x0E75', any, parentContainer.Serial(), 'item', '2', '', true);
    else
        {
        var itemsRaw = Orion.FindTypeEx('!0x0E75', any, parentContainer.Serial(), 'item', '2', '', true).filter(function(item)
            { //[1,1,1,2,1]
            var check = false;
            var lows = ResistParse(item)[6]; //[2,0,0,0,0]
            for(var i=0;i<lows.length;i++)
                {
                if(lows[i] > 0 && targetLows[i] > 0)
                    {
                    check = true;
                    break;
                    }
                }
            return check;
            })
        }
    var items = itemsRaw.map(function(item)
            {
            return ResistParse(item);
            });
    return items;
    }

function ResistParseTest()
    {
    Orion.WaitForAddObject('myTarget');
    var a = Orion.FindObject('myTarget');
    var b = ResistParse(a);
    TextWindow.Open();
    TextWindow.Clear();
    TextWindow.Print(b);
    }

function ResistParse(itemObj)
    {
    var itemProperties = itemObj.Properties();
    var itemGraphic = itemObj.Graphic();
    var graphicList = {
        '0x140E': 'Helm', //norse helm
        '0x1413': 'Gorget', //plate gorget
        '0x13EC': 'Tunic', //ringmail tunic
        '0x1410': 'Arms', //plate arms
        '0x1414': 'Gloves', //plate gloves
        '0x13BE': 'Legs', //chainmail legs
        }
    var itemType = graphicList[itemGraphic];
    if(itemType == 'Helm')
        {
        var idealResists = [4,1,4,4,2];
        var acceptableResists = [5,2,5,5,3];
        }
    else if(itemType == 'Tunic')
        {
        var idealResists = [3,3,1,5,3];
        var acceptableResists = [4,4,2,6,4];
        }
    else if(itemType == 'Legs')
        {
        var idealResists = [4,4,4,1,2];
        var acceptableResists = [5,5,5,2,3];
        }
    else
        {
        var idealResists = [5,3,2,3,2];
        var acceptableResists = [6,4,3,4,3];
        }
    var resists = itemProperties.match(/Physical Resist (\d+)%\nFire Resist (\d+)%\nCold Resist (\d+)%\nPoison Resist (\d+)%\nEnergy Resist (\d+)%\n/) || [];
    var resultArr = [];
    var lowArr = [0,0,0,0,0]
    if(resists.shift())
        {
        for(var i = 0;i<resists.length;i++)
            {
            var resist = +resists[i];
            resultArr[i] = resist;
            if(resist <= idealResists[i])
                lowArr[i] = 2;
            else if(resist <= acceptableResists[i])
                lowArr[i] = 1;
            else
                lowArr[i] = 0;
            }
        }
    else
        return Orion.CharPrint(self,1159,'Error in ItemParse!');
    resultArr.push(itemObj.Serial())
    resultArr.push(lowArr)
    return resultArr;
    }

function PlatemailCheck()
    {
    Orion.WaitForAddObject('myTarget');
    var itemObj = Orion.FindObject('myTarget');
    var parse = PlatemailParse(itemObj);
    Orion.Print('Type: ' + parse.Type + '\nGraphic: ' + parse.Graphic + '\nExceptional: ' + parse.Exceptional + '\nAcceptable: ' + parse.Acceptable + '\nPerfect: ' + parse.Perfect
    + '\nPhysical: ' + parse.Physical + '\nFire: ' + parse.Fire + '\nCold: ' + parse.Cold + '\nPoison: ' + parse.Poison + '\nEnergy: ' + parse.Energy + '\nTotal Resists: ' + parse.TotalResists);
    }
    
function PlatemailParse(itemObj)
    {
    var itemProperties = itemObj.Properties();
    var itemGraphic = itemObj.Graphic();
    var graphicList = {
        '0x140E': 'Helm', //norse helm
        '0x1413': 'Gorget', //plate gorget
        '0x13EC': 'Tunic', //ringmail tunic
        '0x1410': 'Arms', //plate arms
        '0x1414': 'Gloves', //plate gloves
        '0x13BE': 'Legs', //chainmail legs
        }
    var itemType = graphicList[itemGraphic];
    if(itemType == 'Helm')
        {
        var idealResists = [4,1,4,4,2];
        var acceptableResists = [5,2,5,5,3];
        }
    else if(itemType == 'Tunic')
        {
        var idealResists = [3,3,1,5,3];
        var acceptableResists = [4,4,2,6,4];
        }
    else if(itemType == 'Legs')
        {
        var idealResists = [4,4,4,1,2];
        var acceptableResists = [5,5,5,2,3];
        }
    else
        {
        var idealResists = [5,3,2,3,2];
        var acceptableResists = [6,4,3,4,3];
        }
    var itemExceptional = Orion.Contains(itemProperties,'Exceptional');
    var resists = itemProperties.match(/Physical Resist (\d+)%\nFire Resist (\d+)%\nCold Resist (\d+)%\nPoison Resist (\d+)%\nEnergy Resist (\d+)%\n/) || [];
    var resultArr = [];
    if(resists.shift())
        {
        for(var i = 0,totalResists = 0;i<resists.length;i++)
            {
            var resist = +resists[i];
            totalResists += resist;
            if(resist <= idealResists[i])
                resultArr[i] = 2;
            else if(resist <= acceptableResists[i])
                resultArr[i] = 1;
            else
                resultArr[i] = 0;
            }
        }
    else
        return Orion.CharPrint(self,1159,'Error in ItemParse!');
    var numAcceptable = CountElements(resultArr, 1);
    var numPerfect = CountElements(resultArr, 2);
    return {
        Type: itemType,
        Graphic: itemGraphic,
        Exceptional: itemExceptional,
        Acceptable: numAcceptable,
        Perfect: numPerfect,
        Physical: resultArr[0],
        Fire: resultArr[1],
        Cold: resultArr[2],
        Poison: resultArr[3],
        Energy: resultArr[4],
        TotalResists: totalResists,
        }
    }

function CountElements(arr, ele)
    {
    for(var i=0,t=0;i<arr.length;i++)
        {
        if(arr[i] === ele)
            t++;
        }
    return t;
    }
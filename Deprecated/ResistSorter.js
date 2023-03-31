function SuitGrab()
    {
    var suit = GetSuit();
    for(var i=0;i<suit.length;i++)
        {
        Orion.MoveItem(suit[i][5]);
        Orion.Wait(2000);
        }
    }

function GetSuit()
    {
    var targetResists = [43,43,43,42,37];
    var helmArr = GetResistArrays('Helm');
    var gorgetArr = GetResistArrays('Gorget');
    var tunicArr = GetResistArrays('Tunic');
    var armsArr = GetResistArrays('Arms');
    var glovesArr = GetResistArrays('Gloves');
    var legsArr = GetResistArrays('Legs');
    var helmPiece;
    var gorgetPiece;
    var tunicPiece;
    var armsPiece;
    var glovesPiece;
    var legsPiece;
    var i = 0
    while(true)
        {
        for(var helm = 0;helm<helmArr.length;helm++)
            {
            helmPiece = helmArr[helm];
            for(var gorget = 0;gorget<gorgetArr.length;gorget++)
                {
                gorgetPiece = gorgetArr[gorget];
                for(var tunic = 0;tunic<tunicArr.length;tunic++)
                    {
                    tunicPiece = tunicArr[tunic];
                    for(var arms = 0;arms<armsArr.length;arms++)
                        {
                        armsPiece = armsArr[arms];
                        for(var gloves = 0;gloves<glovesArr.length;gloves++)
                            {
                            glovesPiece = glovesArr[gloves];
                            for(var legs = 0;legs<legsArr.length;legs++)
                                {
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
            }        
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

function GetResistArrays(layerName)
    {
    var parentContainer = Orion.FindTypeEx('0x0E41', '0x0000', ground, 'item', 2).filter(function(chest)
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
    var items = Orion.FindTypeEx('!0x0E75', any, parentContainer.Serial(), 'item', '2', '', true).map(function(item)
        {
        return ResistParse(item);
        });
    return items;
    }

function ResistParse(itemObj)
    {
    var itemProperties = itemObj.Properties();
    var resists = itemProperties.match(/Physical Resist (\d+)%\nFire Resist (\d+)%\nCold Resist (\d+)%\nPoison Resist (\d+)%\nEnergy Resist (\d+)%\n/) || [];
    var resultArr = [];
    if(resists.shift())
        {
        for(var i = 0;i<resists.length;i++)
            {
            var resist = +resists[i];
            resultArr[i] = resist;
            }
        }
    else
        return Orion.CharPrint(self,1159,'Error in ItemParse!');
    resultArr.push(itemObj.Serial())
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
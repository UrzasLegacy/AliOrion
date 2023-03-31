//Repair Bench Filler
//Written by Ali
//Apr 18, 2022
//Stand next to a repair bench with appropriate tools in your pack and a nearby container filled with blank scrolls and start FillRepairBench().
//Script will only attempt to fill a category if you have maximum skill for that particular deed.
//Masonry and Glassblowing disabled as I dont have a character to test them, but should work as long as you have the correct specialization

function FillRepairBench()
    {
    Orion.CharPrint(self, 1159, 'Select supply container. It should contain blank scrolls');
    Orion.WaitForAddObject('myTarget');
    var supplyContainer = Orion.GetSerial('myTarget');
    var bench = Orion.FindType('0xA278|0xA277|0xA27F|0xA27E', any, ground, '', 2)[0];
    if(!bench || Orion.GetDistance(bench) > 2)
        return Orion.CharPrint(self, 1159, 'No repair bench close enough! Halting...');
    if(!supplyContainer || Orion.GetDistance(supplyContainer) > 2)
        return Orion.CharPrint(self, 1159, 'Supply container missing or too far away! Halting...');
    Fill('Tinker', 'Tinkering', 100, '0x1EB9|0x1EBC', supplyContainer, bench, 1);
    Fill('Blacksmith', 'Blacksmithy', 180, '0x0FBC|0x13E3|0x0FB5', supplyContainer, bench, 3);
    Fill('Carpenter', 'Carpentry', 100, '0x10E4|0x102E|0x1030|0x1032|0x102C|0x102A|0x1034|0x1029|0x10E6|0x10E7|0x10E5', supplyContainer, bench, 5);
    Fill('Tailor', 'Tailoring', 120, '0x0F9D', supplyContainer, bench, 7);
    //Fill('Mason', 'Carpentry', 100, '0x12B3', supplyContainer, bench, 9); //works, but no check for Masonry Specialization in place
    //Fill('Alchemist', 'Alchemy', 100, '0x0E8A', supplyContainer, bench, 11); //untested, also no check for Glassblowing Specialization in place
    Fill('Fletcher', 'Bowcraft/Fletching', 100, '0x1022', supplyContainer, bench, 13);
    }

function Fill(profString, skillString, skillValue, toolGraphic, containerSerial, benchSerial, textInd)
    {
    while(true)
        {
        WaitForObjectTimeout();
        Orion.UseObject(benchSerial);
        lastObjectUsedTime = Orion.Now();
        var benchGump = WaitForSpecificGump(2000, 'generic', benchSerial, '0x00002415');
        if(benchGump)
            {
            var have = Orion.FindTypeEx('0x14F0').filter(function(deed)
                {
                return Orion.Contains(deed.Properties(), profString);
                }).length;
            var needed = Math.min(500 - +benchGump.TextList()[textInd] - have, 25);
            if(needed < 1)
                return Orion.CharPrint(self, 1159, skillString + ' charges filled');
            if(Orion.SkillValue(skillString, 'base') < skillValue*10) 
                return Orion.CharPrint(self, 1159, skillString + " skill isn't high enough");
            var tool = Orion.FindType(toolGraphic)[0];
            if(!tool)
                return Orion.CharPrint(self, 1159, profString + ' tool not found');
            Restock('Blank Scroll', '0x0EF3', containerSerial, needed);
            Orion.CharPrint(self, 1159, 500 - +benchGump.TextList()[textInd] + ' deeds needed');
            Orion.CharPrint(self, 1159, 'Making batch of ' + needed + ' ' + profString + ' deeds');
            for(var i=0;i<needed;i++)
                {
                if(!Orion.GumpExists('generic', tool, '0x000001CC'))
                    {
                    WaitForObjectTimeout();
                    Orion.UseObject(tool);
                    lastObjectUsedTime = Orion.Now();
                    }
                var toolGump = WaitForSpecificGump(2000, 'generic', tool, '0x000001CC');
                if(toolGump)
                    {
                    toolGump.Select(Orion.CreateGumpHook(8000));
                    if(Orion.WaitForTarget(2000))
                        Orion.TargetType('0x0EF3');
                    }
                Orion.Wait(200);
                //WaitForSpecificGump(2000, 'generic', tool, '0x000001CC'); //faster but causes problems if window isn't in focus or fps is low
                }
            Orion.Wait(500);
            var deeds = Orion.FindTypeEx('0x14F0').filter(function(deed)
                {
                return Orion.Contains(deed.Properties(), profString);
                });
            if(deeds[0])
                {
                Orion.CloseGump('generic', tool, '0x000001CC');
                Orion.CharPrint(self, 1159, 'Adding charges to bench');
                WaitForObjectTimeout();
                Orion.UseObject(benchSerial);
                lastObjectUsedTime = Orion.Now();
                benchGump = WaitForSpecificGump(2000, 'generic', benchSerial, '0x00002415');
                if(benchGump)
                    {
                    benchGump.Select(Orion.CreateGumpHook(100));
                    for(var i=0;i<deeds.length;i++)
                        {
                        if(Orion.WaitForTarget(2000))
                            Orion.TargetObject(deeds[i].Serial());
                        }
                    if(Orion.WaitForTarget(2000))
                        Orion.CancelTarget();
                    Orion.Wait(200);
                    }
                }          
            }
        Orion.CloseGump('generic', benchSerial, '0x00002415');
        Orion.Wait(200);
        }
    }

function WaitForSpecificGump(delay, type, serial, id)
    {
    var startTime = Orion.Now();
    while(Orion.Now() < startTime + delay && !Orion.GumpExists(type, serial, id))
        Orion.Wait(10);
    if(Orion.GumpExists(type, serial, id))
        return Orion.GetGump(serial, id);
    return false;
    }

var lastObjectUsedTime = 0;
function WaitForObjectTimeout()
    {
    var nowTime = Orion.Now();
    var deltaTime = nowTime - lastObjectUsedTime;
    if(deltaTime < 1300)
        Orion.Wait(1300 - deltaTime);
    }

function Restock(itemName, graphicID, supplyContainerSerial, amount)
    {
    while(!Orion.GumpExists('container', supplyContainerSerial))
        {
        WaitForObjectTimeout();
        Orion.UseObject(supplyContainerSerial);
        lastObjectUsedTime = Orion.Now();
        Orion.Wait(500);
        }
    var needed = amount - Orion.Count(graphicID);
    var restockItem = Orion.FindType(graphicID, any, supplyContainerSerial);
    if(needed > 0 && !restockItem[0])
        {
        TextWindow.Open();
        TextWindow.Print("Couldn't restock item: " + itemName);
        return Orion.Terminate('all');
        }
    if(amount === 0)
        {
        WaitForObjectTimeout();
        Orion.MoveItem(restockItem[0]);
        lastObjectUsedTime = Orion.Now();
        }
    else if(needed > 0)
        {
        WaitForObjectTimeout();
        Orion.MoveItem(restockItem[0], needed);
        lastObjectUsedTime = Orion.Now();
        }
    Orion.Wait(200);
    }
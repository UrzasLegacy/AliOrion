function LegendaryCount()
    {
    Orion.WaitForAddObject('myTarget');
    var corpseSerial = Orion.GetSerial('myTarget');
    TextWindow.Open();
    var instanceSerials = Orion.FindType(any,any,corpseSerial);
    do
        {
        Orion.UseObject(corpseSerial);
        Orion.Wait(1300);
        instanceSerials = Orion.FindType(any,any,corpseSerial);
        } while(instanceSerials.length == 0)
    TextWindow.Clear()
    if(instanceSerials.length)
        {
        var test = Orion.FindObject(instanceSerials[0]);
        if(test && test.Graphic() !== '0x2006')
            {
            Orion.CharPrint(self,1159,'Corpse is public');
            while(Orion.GumpExists('container',corpseSerial))
                {
                Orion.Print(true)
                Orion.Wait(1000)
                }
            return [false,Orion.FindType(any, any, corpseSerial)];
            }
        else
            {  
            var myInstanceSerial = instanceSerials.pop();
            Orion.CharPrint(self,1159,'Corpse is private');
            var myLoot = Orion.FindTypeEx(any,any,myInstanceSerial);
            TextWindow.Print('==========MY LOOT:==========\n')
            for(var i=0;i<myLoot.length;i++)
                {
                TextWindow.Print(myLoot[i].Properties() + '\n')
                }
            TextWindow.Print('==========THEIR LOOT:==========\n')
            for(var i=0;i<instanceSerials.length;i++)
            	{
                var instanceSerial = instanceSerials[i];
            	TextWindow.Print('----------Instance ' + i + ':----------\n')
                var items = Orion.FindTypeEx(any,any,instanceSerial)
                for(var j=0;j<items.length;j++)
                    {
                    TextWindow.Print(items[i].Properties() + '\n')
                    }
            	}
            return [true,Orion.FindType(any,any,myInstanceSerial)]
            }
        }    
    }

function LegendaryCount()
    {
    Orion.WaitForAddObject('myTarget');
    var corpseSerial = Orion.GetSerial('myTarget');
    var instanceSerials = Orion.FindType(any,any,corpseSerial);
    
    var totals = {};
    do
        {
        Orion.UseObject(corpseSerial);
        Orion.Wait(1300);
        instanceSerials = Orion.FindType(any,any,corpseSerial);
        } while(instanceSerials.length == 0)
    if(instanceSerials.length)
        {
        var test = Orion.FindObject(instanceSerials[0]);
        if(test && test.Graphic() !== '0x2006')
            {
            Orion.CharPrint(self,1159,'Corpse is public');
            return;
            }
        else
            {
            for(var i=0;i<instanceSerials.length;i++)
                {
                var corpseInstance = instanceSerials[i];
                var items = Orion.FindTypeEx(any,any,corpseInstance);
                for(var j=0;j<items.length;j++)
                    {
                    var item = items[j];
                    var itemProps = item.Properties();
                    var lastLine = itemProps.match(/.+$/) || '';
                    Orion.Print(lastLine)

                    if(lastLine.length == 0 || !Orion.Contains(lastLine,'Artifact|Magic Item'))
                        {
                        continue;
                        }
                    if(totals[lastLine])
                        totals[lastLine]++;
                    else
                        totals[lastLine] = 1;
                    }
                }
            }
        }
    TextWindow.Open();
    TextWindow.Clear();
    TextWindow.Print(JSON.stringify(totals))
    }
function BlockSweeper() //actively run to and pick up block items within 20 tiles
    {
    var blockItemGraphics = '0x0A27|0x2257|0x2256';
    while(true)
        {
        Orion.Wait(500);
        var container = Orion.FindTypeEx(any).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps,'Contents: ') && !Orion.Contains(itemProps,'Contents: 125')
            })[0];
        var item = Orion.FindTypeEx(blockItemGraphics,any,ground,'item|near',20)[0];
        if(!item)
            {
            var itemInPack = Orion.FindType(blockItemGraphics).filter(function(item)
                {
                return item != container.Serial()
                })[0];
            if(container && itemInPack)
                {
                Orion.MoveItem(itemInPack,0,container.Serial());
                Orion.Wait(500);
                }
            //if(Orion.ScriptRunning('StaticAutoFarm') < 0)
                Orion.ResumeScript('all');
            continue;
            }
        Orion.PauseScript('all','BandieBot|AutoAttack|JournalScan|BlockSweeper')
        if(item)
            {
               if(item.Distance() > 2)
                   Orion.WalkTo(item.X(),item.Y());
               if(container)
                Orion.MoveItem(item.Serial(),0,container.Serial());
            else
                Orion.MoveItem(item.Serial());
            Orion.Wait(1000);
            }
        }
    }

function BlockScooper() //passively pick up block items that happen to be nearby
    {
    var blockItemGraphics = '0x0A27|0x2257|0x2256';
    while(true)
        {
        var container = Orion.FindTypeEx(any).filter(function(item)
            {
            var itemProps = item.Properties();
            return Orion.Contains(itemProps,'Contents: ') && !Orion.Contains(itemProps,'Contents: 125')
            })[0];
        var item = Orion.FindType(blockItemGraphics,any,ground,'item|near',2)[0];
        var itemInPack = Orion.FindType(blockItemGraphics)[0];
        if(item)
            {
               if(container)
                Orion.MoveItem(item,0,container.Serial());
            else
                Orion.MoveItem(item);
            Orion.Wait(1000);
            }
        else if(itemInPack && container)
            {
               Orion.MoveItem(itemInPack,0,container.Serial());
            Orion.Wait(1000);
            }
        Orion.Wait(500)
        }
    }
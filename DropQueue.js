function AddToDropQueue()
    {
    Shared.AddArray('dropQueue',[]);
    while(true)
        {
        var check = Orion.WaitForAddObject('myTarget');
        if(check != 1)
            break;
        Orion.Exec('DropFromQueue',true);
        var serial = Orion.GetSerial('myTarget');
        var tempArr = Shared.GetArray('dropQueue');
        //Orion.Print(tempArr);
        var ind = tempArr.indexOf(serial);
        if(ind == -1)
            {
            tempArr.push(serial);
            Orion.TestItemColor(serial, '1159');
            }
        else
            {
            tempArr.splice(ind,1);
            Orion.TestItemColor(serial, '0');
            }
        Shared.AddArray('dropQueue',tempArr);
        Orion.Wait(1);
        }
    }

function DropFromQueue(_)
    {
    var endStamp = Orion.Now() + 5000;
    while(true)
        {
        var tempArr = Shared.GetArray('dropQueue');
        if(tempArr[0])
            {
            var itemSerial = tempArr.shift();
            Shared.AddArray('dropQueue',tempArr);
            while(Orion.FindType(any).indexOf(itemSerial) > -1)
                {
                var validTiles = Orion.GetTilesInRect('land', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
                    .filter(function(tile)
                        {
                        Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
                        var mobCheck = Orion.FindType(any,any,ground,'live').length == 0;
                        var itemCheck = Orion.FindType(any,any,ground,'item').length < 8;
                        return mobCheck && itemCheck;
                        });
                Orion.ResetSearchArea();
                var validTile = null;
                for(var i=0;i<validTiles.length;i++)
                    {
                    if(Orion.GetPathArray(validTiles[i].X(),validTiles[i].Y(),validTiles[i].Z(),0,2,2,0)[0])
                        {
                        validTile = validTiles[i];
                        break;
                        }
                    }
                if(validTile)
                    {
                    var validTileX = validTile.X();
                    var validTileY = validTile.Y();
                    var validTileZ = validTile.Z();
                    //Orion.AddFakeMapObject(0, '0x051A', 1159, validTileX, validTileY, validTileZ);
                    Orion.Drop(itemSerial, 0, validTileX, validTileY, validTileZ);
                    }
                Orion.Wait(250);  
                }
            endStamp = Orion.Now() + 5000;
            }
        if(Orion.Now() > endStamp)
            break;
        Orion.Wait(1);
        }
    }

function DropDraggedHereCall(serial)
    {
    var validTiles = Orion.GetTilesInRect('land', Player.X()-1,Player.Y()-1, Player.X()+1,Player.Y()+1)
        .filter(function(tile)
            {
            Orion.SetSearchArea(tile.X(),tile.Y(),tile.X(),tile.Y());
            var mobCheck = Orion.FindType(any,any,ground,'live').length == 0;
            var itemCheck = Orion.FindType(any,any,ground,'item').length < 8;
            return mobCheck && itemCheck;
            });
    Orion.ResetSearchArea();
    var validTile = null;
    for(var i=0;i<validTiles.length;i++)
        {
        if(Orion.GetPathArray(validTiles[i].X(),validTiles[i].Y(),validTiles[i].Z(),0,2,2,0)[0])
            {
            validTile = validTiles[i];
            break;
            }
        }
    if(validTile)
        {
        var validTileX = validTile.X();
        var validTileY = validTile.Y();
        var validTileZ = validTile.Z();
        //Orion.AddFakeMapObject(0, '0x051A', 1159, validTileX, validTileY, validTileZ);
        Orion.Drop(serial, 0, validTileX, validTileY, validTileZ);
        }
    Orion.Wait(250);
    if(Orion.FindType(any).indexOf(serial) == -1)
        return true;
    else
        return DropDraggedHereCall(serial);
    }

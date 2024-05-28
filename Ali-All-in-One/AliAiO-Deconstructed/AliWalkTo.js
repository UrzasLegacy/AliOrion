/**
 * Improved walking versatility. Breaks projected route up into smaller chunks and calls a "start" and "end" function for each chunk as you travel.
 * @example AliWalkTo(1000,1200)
 * @example AliWalkTo(1000,1200,0)
 * @example AliWalkTo(1000,1200,0,0)
 * @example AliWalkTo(1000,1200,0,0,255)
 * @example AliWalkTo(1000,1200,0,0,255,7)
 * @example AliWalkTo(1000,1200,0,0,255,7,1)
 * @example AliWalkTo(1000,1200,0,0,255,7,1,1)
 * @example AliWalkTo(1000,1200,0,0,255,7,1,1,30000,true)
 * @example AliWalkTo(1000,1200,0,0,255,7,1,1,30000,true,AvoidMob)
 * @example AliWalkTo(1000,1200,0,0,255,7,1,1,30000,true,AvoidMob,LeashMob)
 * @param {number} x - x coordinate to walk to.
 * @param {number} y - y coordinate to walk to.
 * @param {number} [z=Player.Z()] z - z coordinate to walk to.
 * @param {number} [distanceXY=0] distanceXY - acceptable distance from final location.
 * @param {number} [distanceZ=255] - acceptable distance from final z layer.
 * @param {number} [chunkSize=5] - number of tiles in each chunk.
 * @param {number} [run=2] - running mode, 0 - only walking, 1 - only running, 2 - use client Always Run setting.
 * @param {number} [openDoor=2] - open doors mode, 0 - do not open doors, 1 - always open, 2 use client Auto Open Doors setting.
 * @param {number} [maxWalkingTime=300000] - maximum walking time in ms.
 * @param {boolean} [pathMarkers=false] - show visual indicator of travel path.
 * @param {function} [startCallBackFn=undefined] - function called at the beginning of each chunk.
 * @param {function} [endCallBackFn=undefined] - function called at the end of each chunk.
 * @returns {boolean} True if destination reached, false if destination is unreachable.
 */
function AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn)
    {
    if(z === undefined) z = Player.Z();
    if(distanceXY === undefined) distanceXY = 0;
    if(distanceZ === undefined) distanceZ = 255;
    if(chunkSize === undefined) chunkSize = 5;
    if(run === undefined) run = 1;
    if(openDoor === undefined) openDoor = 1;
    if(maxWalkingTime === undefined) maxWalkingTime = 300000;
    if(pathMarkers === undefined) pathMarkers = false;
    
    if(typeof startCallBackFn == 'function')
        startCallBackFn();
    var playerX = Player.X();
    var playerY = Player.Y();
    var zeroDistanceDestination = playerX == x && playerY == y;
    var pathTiles = Orion.GetPathArray(x, y, z, distanceXY, distanceZ, run, openDoor);
    if(pathMarkers)
        Orion.ClearFakeMapObjects();
    if(pathTiles.length === 0 && !zeroDistanceDestination)
        {
        Orion.CharPrint(self,1159,"Destination unreachable!")
        return false;
        }
    if(!zeroDistanceDestination)
        {
        var shortStop = pathTiles[pathTiles.length - 1];
        var shortX = shortStop.X();
        var shortY = shortStop.Y();
        if(pathMarkers)
            {
            pathTiles.forEach(function(tile,i)
                {
                Orion.AddFakeMapObject(i, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
                })
            Orion.Print('Tiles: ' + pathTiles.length + '\nChunks: ' + Math.floor(pathTiles.length / chunkSize));
            }
        if(pathTiles.length >= chunkSize)
            var chunk = pathTiles[chunkSize - 1];
        else
            var chunk = shortStop;
        var chunkX = chunk.X(), chunkY = chunk.Y(), chunkZ = chunk.Z();
        if(pathMarkers)
            {
            Orion.AddFakeMapObject(10000, '0x051A', 32, x,y,z);
            Orion.AddFakeMapObject(10001, '0x051A', 32, chunkX,chunkY,chunkZ);
            }
        Orion.WalkTo(chunkX,chunkY,chunkZ,0,distanceZ,run,openDoor,maxWalkingTime);
        Orion.Wait(1); // This being so low will make your computer lag if you try to manually move while pathfinding
        }
    if(typeof endCallBackFn == 'function')
        endCallBackFn();
    if(!zeroDistanceDestination && Orion.GetDistance(shortX,shortY) > 0)
        return AliWalkTo(x,y,z,distanceXY,distanceZ,chunkSize,run,openDoor,maxWalkingTime,pathMarkers,startCallBackFn,endCallBackFn);
    return true;
    }


/**
 * Walks to the border of a specified radius around a target.
 * @example WalkToRadiusBorder('0x12345678', 5)
 * @param {string} targetSerial - Serial of the target object.
 * @param {number} distance - Distance from the target to walk to.
 * @returns {void} Does not return a value.
 */
function WalkToRadiusBorder(targetSerial, distance) 
    {
    var target = Orion.FindObject(targetSerial);
    if(target) 
        {
        var x = target.X();
        var y = target.Y();
        var tiles = Orion.GetTilesInRect('land', x - distance, y - distance, x + distance, y + distance)
            .filter(function(tile) 
                {
                var tileX = tile.X();
                var tileY = tile.Y();
                return (x == (tileX - distance))
                    || (x == (tileX + distance))
                    || (y == (tileY - distance))
                    || (y == (tileY + distance));
                }).sort(function (a,b) 
                    {
                    return Orion.GetDistance(a.X(), a.Y()) - Orion.GetDistance(b.X(), b.Y());
                    });
        tiles.forEach(function(tile,ind)
            {
            Orion.AddFakeMapObject(ind + 40000, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
            })
        for(var i=0;i<tiles.length;i++)
            {             
            var closest = tiles[i]; 
            Orion.AddFakeMapObject(55555, '0x051A', 32, closest.X(), closest.Y(), closest.Z());
            if(Orion.WalkTo(closest.X(),closest.Y(),closest.Z(),0))
                break;
            }
        }
    }


/**
 * Callback function example for AliWalk. Defines areas to avoid by creating rectangular boundaries.
 * @example AvoidAreas()
 * @param _ - Unused parameter, helper function.
 * @returns {void} Does not return a value.
 */
function AvoidAreas(_)
    {
    AvoidRectangle(3299,1705,3302,1710);
    AvoidRectangle(3305,1705,3308,1710);
    AvoidRectangle(3299,1713,6302,1718);
    AvoidRectangle(3305,1713,3308,1718);
    AvoidRectangle(3305,1713,3308,1718);

    AvoidTile(1010,1718);
    AvoidTile(900,1718);
    }


/**
 * Callback function example for AliWalk. Avoids a specific tile by marking it as a bad location and highlights it.
 * @example AvoidTile(100, 200)
 * @param {number} x - x coordinate of the tile to avoid.
 * @param {number} y - y coordinate of the tile to avoid.
 * @returns {void} Does not return a value.
 */
function AvoidTile(x,y)
    {
    Orion.SetBadLocation(x,y);
    Orion.AddFakeMapObject(Orion.Random(100000,1000000), '0x051A', 32, x, y, 0);
    }


/**
 * Defines a rectangular area to avoid by marking all tiles within it as bad locations.
 * @example AvoidRectangle(100, 100, 200, 200)
 * @example AvoidRectangle(100, 100, 200, 200, false)
 * @example AvoidRectangle(100, 100, 200, 200, false, true)
 * @param {number} minX - Minimum x coordinate of the rectangle.
 * @param {number} minY - Minimum y coordinate of the rectangle.
 * @param {number} maxX - Maximum x coordinate of the rectangle.
 * @param {number} maxY - Maximum y coordinate of the rectangle.
 * @param {boolean} [borderOnly=false] - Whether to only mark the border of the rectangle.
 * @param {boolean} [clearFakeMapObjects=false] - Whether to clear fake map objects before setting bad locations.
 * @returns {void} Does not return a value.
 */
function AvoidRectangle(minX,minY,maxX,maxY,borderOnly,clearFakeMapObjects)
    {
    if(borderOnly === undefined) borderOnly = false;
    if(clearFakeMapObjects === undefined) clearFakeMapObjects = false;
    
    if(clearFakeMapObjects)
        Orion.ClearFakeMapObjects();
    var tiles = Orion.GetTilesInRect('land', minX, minY, maxX, maxY);
    if(borderOnly)
        {
        tiles = tiles.filter(function(tile) 
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            return (minX == tileX)
                || (maxX == tileX)
                || (minY == tileY)
                || (maxY == tileY);
            });
        }
    for(var i=0,len=tiles.length;i<len;i++)
        {
        var tile = tiles[i];
        var tileX = tile.X();
        var tileY = tile.Y();
        var tileZ = tile.Z();
        Orion.SetBadLocation(tileX,tileY);
        Orion.AddFakeMapObject(i + 30000, '0x051A', 32, tileX, tileY, tileZ);
        }
    }

/**
 * Draws a square on ground by highlighting tiles within the specified rectangular area.
 * @example DrawSquare(100, 100, 200, 200)
 * @example DrawSquare(100, 100, 200, 200, false)
 * @example DrawSquare(100, 100, 200, 200, false, true)
 * @param {number} minX - Minimum x coordinate of the rectangle.
 * @param {number} minY - Minimum y coordinate of the rectangle.
 * @param {number} maxX - Maximum x coordinate of the rectangle.
 * @param {number} maxY - Maximum y coordinate of the rectangle.
 * @param {boolean} [borderOnly=false] - Whether to only draw the border of the rectangle.
 * @param {boolean} [clearFakeMapObjects=false] - Whether to clear existing highlighted tiles before drawing.
 * @returns {void} Does not return a value.
 */
function DrawSquare(minX,minY,maxX,maxY,borderOnly,clearFakeMapObjects)
    {
    if(borderOnly === undefined) borderOnly = false;
    if(clearFakeMapObjects === undefined) clearFakeMapObjects = false;

    if(clearFakeMapObjects)
        Orion.ClearFakeMapObjects();
    var tiles = Orion.GetTilesInRect('land', minX, minY, maxX, maxY)
    if(borderOnly)
        {
        tiles = tiles.filter(function(tile)
            {
            var tileX = tile.X();
            var tileY = tile.Y();
            return (minX == tileX)
                || (maxX == tileX)
                || (minY == tileY)
                || (maxY == tileY);
            })
        }
    tiles.forEach(function (tile,ind)
        {
        Orion.AddFakeMapObject(ind, '0x051A', 1159, tile.X(), tile.Y(), tile.Z());
        });
    }


/**
 * Callback function example for AliWalkTo. Checks for mobs of a specified graphic type within a certain range and kills em.
 * @example MobPatrolWalk('0x0001')
 * @param {string} mobGraphic - Graphic serial of the mob(s) to kill.
 * @param {number} [searchDistance=8] - Graphic serial of the mob(s) to kill.
 * @returns {void} Does not return a value.
 */
function MobPatrolWalk(mobGraphic,searchDistance)
    {
    if(searchDistance === undefined) searchDistance = 8;

    Orion.ClearBadLocations();
    var mobs = Orion.FindTypeEx(mobGraphic,any,ground,'live',searchDistance);
    if(mobs.length)
        {
        var mob = mobs[0];
        while(!Player.Dead() && mob.Exists())
            {
            if(mob.Distance() > 1)
                Orion.WalkTo(mob.X(),mob.Y());
            Orion.Attack(mob.Serial());
            Orion.Wait(150);
            }
        }
    }


/**
 * Callback function example for AliWalkTo. Leashes a mob by maintaining a certain distance from it and handling mob interactions.
 * @example LeashMob()
 * @param {string} [mobGraphic="any"] - Graphic serial of the mob(s) to leash.
 * @param {number} [mobCheckDistance=24] - Radius to search for mobs.
 * @returns {void} Does not return a value.
 */
function LeashMob(mobGraphic,mobCheckDistance)
    {
    if(mobCheckDistance === undefined) mobCheckDistance = 24;
    if(mobGraphic === undefined) mobGraphic = 'any';

    Orion.ClearFakeMapObjects();
    Orion.ClearBadLocations();
    AvoidAreas();
    if(!Shared.GetVar('leashing',false))
        {
        var mobs = Orion.FindTypeEx(mobGraphic,any,ground,'live',mobCheckDistance).sort(function(a,b)
            {
            return a.Y() - b.Y();
            });
        var mob = mobs[0];
        Debug('Attempt leash');
        switch(mobs.length)
            {
            case 0:
                Debug('No mobs');
                break;
            case 1:
                Debug('1 mob');
            case 2:
                Debug('Two mobs found: Lure northern mob first');
                Orion.WalkTo(mob.X(),mob.Y(),0,5);
                //AliWalkTo(mob.X(),mob.Y(),0,5);
                var startDist = mob.Distance();
                var currDist = startDist;
                var endTime = Orion.Now() + 4000;
                Debug('Attack mob');
                Orion.Attack(mob.Serial());
                while(mob.Distance() >= startDist && Orion.Now() < endTime)
                    {
                    Debug('start: ' + startDist + ', curr: ' + currDist);
                    Orion.Wait(100);
                    currDist = mob.Distance();
                    }
                if(currDist != startDist)
                    {
                    Debug('Mob leashed');
                    Shared.AddVar('leashing',mob.Serial());
                    }
                else
                    {
                    var tempX = Player.X();
                    var tempY = Player.Y();
                    Orion.Cast('Magic Arrow');
                    Orion.WaitForTarget(500);
                    Orion.WalkTo(mob.X(),mob.Y(),0,0);
                    Orion.TargetObject(mob.Serial());
                    Orion.WalkTo(tempX,tempY,0,0);
                    }
                break
            default:
                break;
            }
        }
    var leash = Shared.GetVar('leashing',false);
    Debug('leash: ' + leash);
    if(!leash)
        return MobLeash();
    while(leash && Orion.GetDistance(leash) > 8 && Orion.FindType(mobGraphic,any,ground,'live',3).length == 0)
        {
        if(Player.Hits('%') < 90)
            {
            Orion.CancelTarget();
            Orion.Cast('Greater Heal');
            if(Orion.WaitForTarget(3000))
                Orion.TargetObject(self);
            }
        if(!Orion.HaveTarget() && !Player.Frozen())
            {
            Orion.Wait(200);
            Orion.Cast('Invisibility');
            }
        Debug('Distance to mob: ' + Orion.GetDistance(leash));
        Orion.Wait(200);
        }
    Orion.ClearBadLocations();    
    }


/**
 * Callback function example for AliWalk. Avoids mobs of a specified graphic type.
 * @example AvoidMob()
 * @example AvoidMob("0x0001")
 * @example AvoidMob("0x0001",2)
 * @param {string} [mobGraphic="any"] - Graphic serial of the mob(s) to avoid.
 * @param {number} [avoidRadius=1] - Tile radius around mob to avoid.
 * @returns {void} Does not return a value.
 */
function AvoidMob(mobGraphic, avoidRadius)
    {
    Orion.ClearBadLocations();
    AvoidDropdowns();
    var ind = 20000;
    var mobs = Orion.FindTypeEx(mobGraphic,any,ground,'live',23);
    mobs.forEach(function(mob)
        {
        var x = mob.X();
        var y = mob.Y();
        if(Orion.GetDistance(x,y) > avoidRadius) // necessary to avoid trapping yourself next to the mob on accident!
            {
            var avoidTiles = Orion.GetTilesInRect('land',x - avoidRadius, y - avoidRadius, x + avoidRadius, y + avoidRadius);
            avoidTiles.forEach(function(tile)
                {
                var tileX = tile.X();
                var tileY = tile.Y();
                Orion.SetBadLocation(tileX,tileY);
                Orion.AddFakeMapObject(ind++, '0x051A', 32, tileX, tileY, tile.Z());
                });
            }
        });
    }

/**
 * Logs a debug message if debugging is enabled.
 * @example Debug('This is a debug message')
 * @param {string} msg - The message to log.
 * @returns {void} Does not return a value.
 */
debug = false
function Debug(msg)
    {
    if(!debug) return;
    if(!TextWindow.IsOpened())TextWindow.Open();
    TextWindow.Print(Orion.Time() + '  ' + Player.Name() +': ' + msg);
    }
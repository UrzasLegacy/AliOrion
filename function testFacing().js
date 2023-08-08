function testFacing()
    {
    Orion.Print(isPlayerFacingMe(772,757,132))
    }

function isPlayerFacingMe(otherPlayerX,otherPlayerY,otherPlayerDirection)
    {
    var myX = Player.X();
    var myY = Player.Y();
    var dx = otherPlayerX - myX;
    var dy = otherPlayerY - myY;
    var relativeDirection;

    if (dx === 0 && dy < 0) relativeDirection = 0;      // North
    else if (dx > 0 && dy < 0) relativeDirection = 1; // NorthEast
    else if (dx > 0 && dy === 0) relativeDirection = 2; // East
    else if (dx > 0 && dy > 0) relativeDirection = 3; // SouthEast
    else if (dx === 0 && dy > 0) relativeDirection = 4; // South
    else if (dx < 0 && dy > 0) relativeDirection = 5; // SouthWest
    else if (dx < 0 && dy === 0) relativeDirection = 6; // West
    else if (dx < 0 && dy < 0) relativeDirection = 7; // NorthWest

    // Add 4 to the relative direction and modulo by 8 to get the direction the other player would need to face your player
    var requiredDirection = (relativeDirection + 4) % 8;

    return otherPlayerDirection === requiredDirection;
    }
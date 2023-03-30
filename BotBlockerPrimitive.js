function BotBlocker()
    {
    var serial = '0x03356418';
    var blockItems = '0x0F36';
    var timer = 0;
    var botX;
    var botY;
    var botZ;
    var botPos = {};
    TextWindow.Open();
    while(!Player.Dead())
        {
        var bot = Orion.FindObject(serial);
        if(bot)
            {
            botX = bot.X();
            botY = bot.Y();
            botZ = bot.Z();
            botName = bot.Name();
            botPos[bot.Serial()] = [botName,botX,botY,botZ];
            TextWindow.Print(botName + ':' + botX + ':' +botY);
            timer = Orion.Now() + 60000;
            while(bot.Exists() && !Player.Dead())
                {
                Orion.Wait(100);
                Orion.CharPrint(self,1159,'Waiting for bot to leave');
                }
            Orion.Wait(500);
            Orion.WalkTo(botX, botY);
            Orion.Wait(1200);
            do
                {
                Orion.DropType(blockItems, any, backpack, 0, botX, botY, botZ);
                Orion.Wait(500);
                Orion.SetSearchArea(botX, botY, botX, botY);
                var confirm = Orion.FindType(blockItems, any, ground, '', 6)[0];
                Orion.ResetSearchArea();
                } while(!confirm)
            }
        Orion.Wait(100);
        }
    }
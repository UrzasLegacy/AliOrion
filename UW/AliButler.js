function Butler()
    {
    var butleeList = 
        {
        '0x02F464AE': true,
        }
    while(true)
        {
        var butlees = Orion.FindTypeEx(any,any,ground,'mobile',5).filter(function(mob)
            {
            return butleeList[mob.Serial()];
            });
        if(butlees.length)
            {
            if(Player.Hidden())
                Orion.SayWhisper('Hello! Is there anything I can help you with?');
            //accept trades
            if(Orion.TradeCheckState('0','left') && butleeList[Orion.TradeOpponent('0')])
                {
                Orion.TradeCheck('0', true);
                Orion.Wait(1000);
                }
            //give requested goods
            }
        else
            {
            if(!Player.Hidden())
                Orion.UseSkill('Hiding');
            }
        Orion.Wait(500);
        }
    }
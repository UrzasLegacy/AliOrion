function Autostart()
    {
    while(!Orion.GumpExists('container', backpack))
        {
        Orion.UseObject(backpack);
        Orion.Wait(1300);
        }
    var coin = Orion.FindType('0x0F87','0x0496')[0];
    while(!coin)
        {
        Orion.CharPrint(self,1159,'Looking nearby for Lucky Coin...');
        var groundCoins = Orion.FindType('0x0F87','0x0496','ground','item',2)[0];
        Orion.MoveItem(groundCoins, 1);
        Orion.Wait(1300);
        coin = Orion.FindType('0x0F87')[0];
        }
    Orion.Wait(1000);
    var fountain = Orion.FindType('0x173B',any,'ground','',5)[0];
    if(!fountain)
        return Orion.CharPrint(self,1159,'Fountain not nearby!');
    Orion.UseObject(coin);
    if(Orion.WaitForTarget(3000))
        Orion.TargetObject(fountain);
    }
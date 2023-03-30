function RedCandleMonitor()
    {
    Orion.RemoveDisplayTimer('revertTimer');
    var candleGraphics = '0x1853|0x1854|0x1855|0x1856|0x1857|0x1858|0x1859|0x185A'
    var altar = Orion.FindTypeEx('0x1F18',any,ground,'',20)[0];
    while(!altar)
        {
        Orion.Wait(1000);
        altar = Orion.FindTypeEx('0x1F18',any,ground,'',20)[0];
        }
    var searchArea = [altar.X() - 2,altar.Y() - 2, altar.X() + 2, altar.Y() + 2];
    var redMonitor = 0;
    var firstPass = true;
    while(true)
        {
        if(Orion.FindType('0x03FA|0x03F7|0x03F9|0x03F8','0x0452',ground,'',24).length == 4)
            {
            Orion.SetSearchArea(searchArea[0],searchArea[1],searchArea[2],searchArea[3]);
            var redCandles = Orion.FindType(candleGraphics,'0x0026',ground,'item',24).length;
            var whiteCandles = Orion.FindType(candleGraphics,'!0x0026',ground,'item',24).length; 
            Orion.ResetSearchArea();
            if(redMonitor != redCandles && !firstPass)
                {
                DiscordPush('Candles');
                Orion.AddDisplayTimer('revertTimer', 600000, 'AboveChar', 'bar', 'Candle Revert');
                }
            firstPass = false;
            redMonitor = redCandles;
		    var gump = Orion.CreateCustomGump(15001);
		    gump.Clear();
		    gump.AddResizepic(0, 0, 0xDAC, 100, 80);
		    gump.AddText(15,15,0,'Red: ' + redCandles)
		    gump.AddText(15,40,0,'White: ' + whiteCandles)
		    gump.Update();
            }
        Orion.Wait(1000);
        }
    }

function DiscordPush(message)
	{
	var bot = "https://discordapp.com/api/webhooks/" //private notification channel
	+ '887268637315047444'//hook
	+ "/"
	+ 'SJfWniY7dpD9URmrvXSPb3EFs7DzrZiVH5_Wd4f16Tg695utEVXeLc7quvb8Gwjmg_0Z'; //key
	Orion.HttpPost(bot, "content=" + message);
	}

function AltarMonitor()
    {
    var candleGraphics = '0x1853|0x1854|0x1855|0x1856|0x1857|0x1858|0x1859|0x185A'
    var altar = Orion.FindTypeEx('0x1F18',any,ground,'',20)[0];
    while(!altar)
        {
        Orion.Wait(1000);
        altar = Orion.FindTypeEx('0x1F18',any,ground,'',20)[0];
        }
    var searchArea = [altar.X() - 2,altar.Y() - 2, altar.X() + 2, altar.Y() + 2];
    while(true)
        {
        if(altar.Distance() < 20)
            {
            Orion.SetSearchArea(searchArea[0],searchArea[1],searchArea[2],searchArea[3]);
            var redCandles = Orion.FindType(candleGraphics,'0x0026',ground,'item',20).length;
            var whiteCandles = Orion.FindType(candleGraphics,'!0x0026',ground,'item',20).length; 
            Orion.ResetSearchArea();
		    var gump = Orion.CreateCustomGump(15001);
		    gump.Clear();
		    gump.AddResizepic(0, 0, 0xDAC, 100, 80);
		    gump.AddText(15,15,0,'Red: ' + redCandles)
		    gump.AddText(15,40,0,'White: ' + whiteCandles)
		    gump.Update();
            }
        Orion.Wait(1000);
        }
    }
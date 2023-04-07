//4000 recall
//2000 gate
//5000 sacred journey

//3 set default
//4 back page
//5 forward page

//50000-50047 rune button index
function test()
	{
	var runeItem = Orion.FindTypeEx('0x9C16').filter(function(part)
                {
                return part.Properties().match(/.+$/) == runeName
                });
	Orion.Print(runeItem.length);
	}

function atlas()
	{
	AtlasByName('Training', 'testicle', '2', 'Malas');
	}

function AtlasByName(bookName,runeName,backupBook,backupRune) 
	{
	if(backupBook == undefined)
		var backupBook = bookName;
	if(backupRune == undefined)
		var backupRune = runeName;
    var x = Player.X();
	var y = Player.Y();
	var runeItem = Orion.FindTypeEx('0x9C16').filter(function(part)
                {
                return part.Properties().match(/.+$/) == bookName
                });
    if(!runeItem[0])
        {
        Orion.Print("Atlas named '" + bookName + "' not found!");
        return;    
        }
    if(Orion.SkillValue('Magery', 'base') >= 650)
    	var recallType = 4000; //recall index
	else
		var recallType = 5000; //sacred journey index
    Orion.CharPrint(self, 1159, "Recalling to: '" + runeName + "' in Atlas: '" + bookName + "'");
	Orion.UseObject(runeItem[0].Serial());
	 if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            while(gump.TextList().indexOf(runeName) == -1 && gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50000 ') == -1)
            	{
            	AtlasPushButton(4);
            	Orion.Wait(500);
            	gump = Orion.GetGump(any, '0x000001F2');
	        	}
	        while(gump !== null)
	        	{
	        	Orion.Wait(500);
		        if(gump.TextList().indexOf(runeName) !== -1)
		        	{
		        	var textList = gump.TextList();
			        var index = textList.indexOf(runeName);
			        var buttonList = gump.ButtonList();
			        if(buttonList.length == 25)
			        	index++;	    
			        var buttonText = buttonList[index];
			        var splitText = Orion.Split(buttonText, ' ');
			        var buttonCode = splitText.pop();
			        break;
		    		}
		    	if(gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50032 ') !== -1)
		    		return Orion.Print('debug');
		    	AtlasPushButton(5);
			    Orion.Wait(500);
			    gump = Orion.GetGump(any, '0x000001F2');
		    	}
        	}
        }
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(buttonCode));
            Orion.Wait(100);
            }
        }
    Orion.Wait(500);
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(recallType));
            Orion.Wait(100);
            }
        }
	var check = Orion.WaitJournal('Something is blocking the location.', Orion.Now()-1000, Orion.Now()+4000, 'sys');
	if(check)
		{
        var backup = Orion.FindTypeEx('0x9C16').filter(function(part)
            {
            return part.Properties().match(/.+$/) == backupBook
            });
		Orion.Wait(2000);
        if(backup)
            return AtlasByName(backupBook,backupRune);
        else
            Orion.Print("No backup atlas named '" + backupBook + "' found!");
		}
	if(x == Player.X() && y == Player.Y()) 
        AtlasByName(bookName,runeName,backupBook,backupRune);
	}

function AtlasPushButton(button)
    {
    if (Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            gump.Select(Orion.CreateGumpHook(button));
            Orion.Wait(100);
            }
        }
    }

function AtlasFindButton(string)
    {
    if(Orion.WaitForGump(1000))
        {
        var gump = Orion.GetGump(any, '0x000001F2');
        if(gump !== null)
            {
            while(gump.TextList().indexOf(string) == -1 && gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50000 ') == -1)
            	{
            	AtlasPushButton(4);
            	Orion.Wait(500);
            	gump = Orion.GetGump(any, '0x000001F2');
	        	}
	        while(gump !== null)
	        	{
	        	Orion.Wait(500);
		        if(gump.TextList().indexOf(string) !== -1)
		        	{
		        	var textList = gump.TextList();
			        var index = textList.indexOf(string);
			        var buttonList = gump.ButtonList();
			        if(buttonList.length == 25)
			        	index++;	    
			        var buttonText = buttonList[index];
			        var splitText = Orion.Split(buttonText, ' ');
			        var buttonCode = splitText.pop();
			        return buttonCode;
		    		}
		    	if(gump.ButtonList().indexOf(' button 46 55 2103 2104 1 0 50032 ') !== -1)
		    		return Orion.Print('debug');
		    	AtlasPushButton(5);
			    Orion.Wait(500);
			    gump = Orion.GetGump(any, '0x000001F2');
		    	}
        	}
        }
    }


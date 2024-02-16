from google.oauth2.service_account import Credentials
import gspread

test_array = [["Ring","","","","","Resisting Spells 15","","","","","","",25,15,"","",1,8,"",25,10,35]]

def send_to_google(data):
    scopes = ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']
    try:
        creds = Credentials.from_service_account_file('C:/Users/Sean/Desktop/UO/Orion Script Backups/VSC Orion Workspace/AliOrion/AliAiO-ToBeAdded/AliCatalogue/uo-item-catalogue-b61a5306332c.json', scopes=scopes)
    except Exception as e:
        print("Couldn't open file: ", e)

    client = gspread.authorize(creds)
    sheet = client.open("Item Catalogue").worksheet("Dataset")

    range_start = 'A2'
    sheet.update(range_name=range_start, values=data)

send_to_google(test_array)
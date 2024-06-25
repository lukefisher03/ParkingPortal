from bs4 import BeautifulSoup
import requests
import json

"""
Use web scraping to interface with the cincinnati citation portal
"""

def beginSession():
    s = requests.session()
    set_session_cookies = s.get("https://cincinnati.citationportal.com/")

    soup = BeautifulSoup(set_session_cookies.content, "html.parser")
    token = soup.find("input", attrs={"name":"__RequestVerificationToken", "type":"hidden"}).attrs["value"]
    return [s, token]

def parsePlateData(data:BeautifulSoup, test=False):
    outputData = {}

    if test:
        with open("utils/citation_schema.json") as f:
            outputData = json.load(f)
            return outputData

    table = data.find("table")
    headings = [heading.string.strip() for heading in table.find_all("th") if heading.string.strip() != ""]
    table_rows = [row for row in table.find_all("tr")]

    table_rows.pop(0) # The table has a header row. This row contains no data, remove from row list.

    for row in table_rows:
        citation_data = {}
        d = [i.text.strip() for i in row.find_all("td")]
        for i, heading in enumerate(headings):
            if heading == "Pay Citation(s)":
                citation_data["Citation Link"] = "https://cincinnati.citationportal.com" + row.find("a").attrs["href"]
            else:
                v = " ".join(d[i].split())
                citation_data[heading] = v if v not in ["", "-"] else "None" # Remove doubled whitespace from text
        outputData[d[0]] = citation_data
    print(outputData)
    return outputData

def getVehicleInfoByPlate(plate, session_info, test=False):
    payload = {
        "__RequestVerificationToken": session_info[1],
        "Type": "PlateStrict",
        "Term": plate
    }

    get_plate_data = session_info[0].post("https://cincinnati.citationportal.com/Citation/Search", data=payload)
    soup = BeautifulSoup(get_plate_data.text, "html.parser")
    return parsePlateData(soup, test)

if __name__ == "__main__":
    session_info = beginSession()
    print(getVehicleInfoByPlate("JJN4759", session_info))
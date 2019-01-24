import fastCsv = require("fast-csv");

export default class CsvUtility {

    async parse(csv: string): Promise<{ headers: string[], rows: string[][] }> {
        
        let headers: string[] = null;
        let rows: string[][] = [];
        await new Promise<void>(function(resolve, reject) {
            fastCsv.fromString(csv, {
                objectMode: true,
                headers: false, // the file has headers, but we want to handle the first row ourselves
                trim: true
            }).on("data", (data: string[]) => {
                if (!headers) {
                    headers = data;
                }
                else {
                    rows.push(data);
                }
            }).on("end", resolve).on("error", reject);
        });

        // remove trailing empty headers, assume this was a mistake
        while (headers.length > 0 && headers[headers.length - 1] === "") {
            headers.pop();
        }

        return {
            headers,
            rows
        };
    }

    async parseAsObjects(csv: string, objectPathDelimiter = ":"): Promise<{ headers: string[], items: any[] }> {
        let { headers, rows } = await this.parse(csv);

        var items = [];
        for (var row of rows) {
            var item = {};
            for (var headerIndex in headers) {   
                let header = headers[headerIndex];  
                let value = row[headerIndex];

                if (header === "" || value === "") {
                    continue;
                }

                let objectPathSegments = header.split(objectPathDelimiter);
                let activeValue = item;
                let propIndex = 0;
                for (let prop of objectPathSegments) {
                    let isLastPathSegment = propIndex === (objectPathSegments.length - 1);
                    if (!isLastPathSegment) {
                        if (!activeValue.hasOwnProperty(prop)) {
                            activeValue[prop] = {};
                        }
                        activeValue = activeValue[prop];
                    }
                    else {
                        activeValue[prop] = value;
                    }
                    propIndex += 1;
                }
                let lastPath = objectPathSegments.slice(-1)[0];
                activeValue[lastPath] = value;
            }
            items.push(item);
        }
        console.log(JSON.stringify(items));
        return {
            headers,
            items
        }
    }
}
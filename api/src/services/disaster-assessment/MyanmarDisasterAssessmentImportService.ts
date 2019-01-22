import fastCsv = require("fast-csv");
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import { enumValues } from "@common/utils/enumHelpers";
import MyanmarDisasterAssessmentReportModel from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";
import DisasterAssessmentRepo from "@/repo/DisasterAssessmentRepo";
import MyanmarDisasterAssessmentService from "@/services/disaster-assessment/MyanmarDisasterAssessmentService";

export default class MyanmarDisasterAssessmentImportService {
    
    constructor(private disasterAssessmentService: MyanmarDisasterAssessmentService) {}

    public static getInstance() {
        return new MyanmarDisasterAssessmentImportService(MyanmarDisasterAssessmentService.getInstance());
    }

    // TODO validate duplicate headers
    private readonly csvHeaderPaths = [
        ["location", "townshipCode"],
        ["disasterType"],
        ["geographicalSetting"],
        ["people", "numberBeforeDisaster"],
        ["people", "numberLeftArea"],
        ["people", "numberReturned"],
        ["people", "numberStayedInArea"],
        ["people", "numberAffected"],
        ["people", "numberDisplaced"],
        ["people", "numberNotDisplaced"],
        ["people", "numberOfCasualties"],
        ["rankings", "responseModalities", ["1", "2", "3"]],
        ["rankings", "vulnerableGroups", ["1", "2", "3"]],
        ["rankings", "affectedGroups", ["1", "2", "3"]],
        ["rankings", "prioritySectors", ["1", "2", "3"]],
        ["sectors", enumValues(MyanmarSectors), "severity"],
        ["sectors", enumValues(MyanmarSectors), "basicNeedsConcern"],
        ["sectors", enumValues(MyanmarSectors), "factors", enumValues(MyanmarSectorFactors)]
    ];

    public getCsvTemplate() {

        let headers: string[] = [];
        function addPath(path: (string|(string|number)[])[], result: (string|number)[] = [], index: number = 0) {
            if (index < path.length) {
                let item = path[index];
                if (Array.isArray(item)) {
                    for (let option of item) {
                        addPath(path, [...result, option], index + 1);
                    }
                }
                else {
                    result.push(item);
                    addPath(path, result, index + 1);
                }
            }
            else {
                // end of path, store in headers collection
                headers.push(result.join(":"));
            }
        }
        for (let header of this.csvHeaderPaths) {
            addPath(header);
        }
        return headers.join(",");
    }

    private validateHeaderPath(header: string): boolean {
        let paths = header.split(".");
        let validPaths = this.csvHeaderPaths;
        for (let index in paths) {
            validPaths = validPaths.filter((validPath: any[]) => {
                let pathValue = paths[index];
                if (typeof validPath[index] === "string") {
                    return validPath[index] === pathValue;
                }

                return validPath[index].indexOf(paths[index]) !== -1;
            });
        }
        return validPaths.length === 1 && validPaths[0].length === paths.length;
    }

    private validateCsvHeaders(headers: string[]): void {
        console.log(JSON.stringify(headers));
        let invalidHeaders: string[] = [];
        for (let header of headers) {
            if (!this.validateHeaderPath(header)) {
                invalidHeaders.push(header);
            }
        }
        if (invalidHeaders.length > 0) {
            console.log("!!!");
            console.log(JSON.stringify(invalidHeaders));
            throw new RcdaError(RcdaErrorTypes.ClientError, "The request CSV file contains invalid headers", invalidHeaders);
        }
    }

    private convertCsvRowToModel(row: string[], headers: string[]): MyanmarDisasterAssessmentReportModel {
        let result: MyanmarDisasterAssessmentReportModel = <any>{};
        for (let index in headers) {
            this.applyRowColumnToObject(headers[index], row[index], result);
        }

        for (let prop in result.rankings) {
            result.rankings[prop] = this.mapNumericKeyObjectToArray(result.rankings[prop]);
        }

        return result;
    }

    private mapNumericKeyObjectToArray(numericKeyObject: {[x: number]: any}): any[] {
        let result: any[] = [];
        for (let index in numericKeyObject) {
            result[Number(index) - 1] = numericKeyObject[index];
        }
        return result.filter(x => x !== undefined);
    }

    private applyRowColumnToObject(header: string, value: string, target: any) {
        if (!value) {
            return;
        }
        let path = header.split(".");
        let activeValue = target;
        for (let i = 0; i < path.length; i++) {
            let prop = path[i];
            if (!activeValue[prop]) {
                activeValue[prop] = (i === (path.length - 1)) ? value : {};
            }
            activeValue = activeValue[prop];
        }        
    }

    public async importCsv(csvText: string): Promise<void> {
    
        let headers: string[] = null;
        let items: MyanmarDisasterAssessmentReportModel[] = [];
        let _this = this;
        await new Promise<void>(function(resolve, reject) {
            fastCsv.fromString(csvText, {
                objectMode: true,
                headers: false, // the file has headers, but we need to handle the first row manually
                trim: true
            }).on("data", (data: string[]) => {
                if (!headers) {
                    _this.validateCsvHeaders(data);
                    // if no error thrown, these are valid
                    headers = data;
                }
                else {
                    items.push(_this.convertCsvRowToModel(data, headers));
                }                
            }).on("end", resolve).on("error", reject);
        });

        await this.import(items);
    }

    public async import(items: MyanmarDisasterAssessmentReportModel[]): Promise<void> {
        
        let validationErrors: any[] = [];
        for (let i = 0; i < items.length; i++) {
            // TODO: consider validate first, normalize second?
            let item = this.disasterAssessmentService.normalizeModel(items[i]);
            let validationResult = this.disasterAssessmentService.validateModel(item);
            if (validationResult.hasErrors) {
                validationErrors.push({
                    itemNumber: i + 1,
                    errors: validationResult.errors
                });
            }
        }

        if (validationErrors.length > 0) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "One or more records have validation issues", { 
                count: validationErrors.length, 
                items: validationErrors
            });
        }

        for (let item of items) {
            await this.disasterAssessmentService.create(item, { validate: false });
        }
    }
}
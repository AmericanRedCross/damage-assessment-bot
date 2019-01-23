import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import RcdaError, { RcdaErrorTypes } from "@common/system/RcdaError";
import { enumValues } from "@common/utils/enumHelpers";
import MyanmarDisasterAssessmentReportModel from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";
import DisasterAssessmentRepo from "@/repo/DisasterAssessmentRepo";
import MyanmarDisasterAssessmentService from "@/services/disaster-assessment/MyanmarDisasterAssessmentService";
import CsvUtility from "@/services/utils/CsvUtility";

export default class MyanmarDisasterAssessmentImportService {
    
    constructor(private disasterAssessmentService: MyanmarDisasterAssessmentService, private csvUtility: CsvUtility) {}

    public static getInstance() {
        return new MyanmarDisasterAssessmentImportService(MyanmarDisasterAssessmentService.getInstance(), new CsvUtility());
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

    private readonly headerPathDelimiter = ":";

    public async importCsv(csvText: string): Promise<void> {
    
        let { headers, items } = await this.csvUtility.parseAsObjects(csvText);

        this.validateCsvHeaders(headers);

        let reports = this.normalizeRowItems(items);

        await this.import(reports);
    }

    private validateCsvHeaders(headers: string[]): void {
        let invalidHeaders: string[] = [];
        for (let header of headers) {
            if (!this.validateHeaderPath(header)) {
                invalidHeaders.push(header);
            }
        }
        if (invalidHeaders.length > 0) {
            throw new RcdaError(RcdaErrorTypes.ClientError, "The request CSV file contains invalid headers", invalidHeaders);
        }
    }
    
    private validateHeaderPath(header: string): boolean {
        let paths = header.split(this.headerPathDelimiter);
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

    private normalizeRowItems(items: any[]): MyanmarDisasterAssessmentReportModel[] {
        for (let item of items) {
            for (let rankingsObjectKey in item.rankings) {
                let result: any[] = [];
                for (let index in item.rankings[rankingsObjectKey]) {
                    result[index] = item.rankings[rankingsObjectKey][index];
                }
                item.rankings[rankingsObjectKey] = result.filter(x => x !== undefined);
            }
        }
        return items;
    }
    
    public getCsvTemplate() {
        let headers: string[] = [];
        const addPath = (function(path: (string|(string|number)[])[], result: (string|number)[] = [], index: number = 0) {
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
                headers.push(result.join(this.headerPathDelimiter));
            }
        }).bind(this);

        for (let header of this.csvHeaderPaths) {
            addPath(header);
        }

        console.log(JSON.stringify(headers));
        return headers.join(",");
    }
}
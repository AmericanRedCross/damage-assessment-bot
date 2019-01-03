import RcdaApiClient from "@/services/utils/RcdaApiClient";
import RcdaStorageClient from "@/services/utils/RcdaStorageClient";
import GenerateMyanmarDisasterAssessmentSummaryRequest from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryRequest";
import GenerateMyanmarDisasterAssessmentSummaryResponse from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryResponse";
import { JsonResult, jsonDate } from "@common/utils/jsonHelpers";
import { makeObjectWithEnumKeys, enumValues } from "@common/utils/enumHelpers";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";

export default class MyanmarDashboardService {

    constructor(private apiClient: RcdaApiClient, private storageClient: RcdaStorageClient) { }
    
    public async generateSummary(request: GenerateMyanmarDisasterAssessmentSummaryRequest): Promise<GenerateMyanmarDisasterAssessmentSummaryResponse> {
        

        let apiSession = this.storageClient.apiSessionToken;
        let headers = { "Authorization": `Bearer ${apiSession}` };
        let response = await this.apiClient.post<JsonResult<GenerateMyanmarDisasterAssessmentSummaryResponse>>("api/v1/myanmar/disasterAssessment/summary", request, { headers });
        
        return {
            ...response.data,
            startDate: new Date(response.data.startDate),
            endDate: new Date(response.data.endDate)
        };
    }

    public async importFile(file: File) {
    
        let content = await new Promise((resolve, reject) => {
            try {
                let reader = new FileReader();
                reader.onload = (event) => resolve((<any>event.target).result);
                reader.onerror = reject;
                reader.readAsText(file);
            }
            catch (error) {
                reject(error);
            }
        });

        let fileType = file.type;
        if (file.name.toLowerCase().endsWith(".csv")) {
            fileType = "text/csv";
        }
        if (fileType.includes("json")) {
            fileType = "application/json";
        }

        let response = await this.apiClient.post("api/v1/myanmar/disasterAssessment/import", content, { 
            headers: { 
                "Authorization": `Bearer ${this.storageClient.apiSessionToken}`,
                "Content-Type": fileType
             }
        });
        
        return response.data;
    }

    async downloadImportTemplate() {

        let response = await this.apiClient.get("api/v1/myanmar/disasterAssessment/import/template", { 
            headers: {
                "Authorization": `Bearer ${this.storageClient.apiSessionToken}`
            } 
        });

        this.downloadData("DamageAssessmentImportTemplate.csv", response.data);
    }

    private downloadData(name: string, data: any) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    public static getEmptySummaryResponse(): GenerateMyanmarDisasterAssessmentSummaryResponse {
        return {
            count: 0,
            startDate: new Date(),
            endDate: new Date(),
            disasterType: <any>null,
            location: {
                regionCode: <any>null,
                districtCode: <any>null,
                townshipCode: <any>null
            },
            sectors: makeObjectWithEnumKeys(enumValues<MyanmarSectors>(MyanmarSectors), () => ({
                severity: 0,
                basicNeedsConcern: 0,
                factors: makeObjectWithEnumKeys(enumValues<MyanmarSectorFactors>(MyanmarSectorFactors), () => 0)
            })),
            people: {
                numberBeforeDisaster: 0,
                numberLeftArea: 0,
                numberReturned: 0,
                numberStayedInArea: 0,
                numberAffected: 0,
                numberDisplaced: 0,
                numberNotDisplaced: 0,
                numberOfCasualties: 0
            },
            rankings: {
                responseModalities: [MyanmarResponseModalities.Foods, MyanmarResponseModalities.Misc, MyanmarResponseModalities.NFIs, MyanmarResponseModalities.Foods, MyanmarResponseModalities.Misc, MyanmarResponseModalities.NFIs],
                prioritySectors: [MyanmarSectors.Health, MyanmarSectors.ShelterNFI, MyanmarSectors.Wash, MyanmarSectors.Health, MyanmarSectors.ShelterNFI, MyanmarSectors.Wash],
                vulnerableGroups: [MyanmarVulnerableGroups.ChronicallyIll, MyanmarVulnerableGroups.FemaleHeadOfHousehold, MyanmarVulnerableGroups.MothersWithInfants, MyanmarVulnerableGroups.ChronicallyIll, MyanmarVulnerableGroups.FemaleHeadOfHousehold, MyanmarVulnerableGroups.MothersWithInfants],
                affectedGroups: [MyanmarAffectedGroups.DisplacedIdp, MyanmarAffectedGroups.DisplacedOthers, MyanmarAffectedGroups.NonDisplacedNonHost, MyanmarAffectedGroups.DisplacedIdp, MyanmarAffectedGroups.DisplacedOthers, MyanmarAffectedGroups.NonDisplacedNonHost]
            }
        }
    }
}
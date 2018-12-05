import RcdaApiClient from "@/services/utils/RcdaApiClient";
import GenerateMyanmarDisasterAssessmentSummaryRequest from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryRequest";
import GenerateMyanmarDisasterAssessmentSummaryResponse from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryResponse";

export default class MyanmarDashboardService {

    constructor(private apiClient: RcdaApiClient) { }
    
    public async generateSummary(request: GenerateMyanmarDisasterAssessmentSummaryRequest): Promise<GenerateMyanmarDisasterAssessmentSummaryResponse> {
        
        let sessionToken = localStorage.getItem("sessionToken");
        let headers = { "Authorization": `Bearer ${sessionToken}` };
        let response = await this.apiClient.post<GenerateMyanmarDisasterAssessmentSummaryResponse>("api/myanmar/disasterAssessment/summary", request, { headers });
        
        return response.data;
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

        let sessionToken = localStorage.getItem("sessionToken");
        let headers = { 
            "Authorization": `Bearer ${sessionToken}`,
            "Content-Type": fileType
        };
        
        let response = await this.apiClient.post("api/myanmar/disasterAssessment/import", content, { headers });
        
        return response.data;
    }

    async downloadImportTemplate() {
        let sessionToken = localStorage.getItem("sessionToken");
        let headers = { "Authorization": `Bearer ${sessionToken}` };
        
        let response = await this.apiClient.get("api/myanmar/disasterAssessment/import/template", { headers });

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
}
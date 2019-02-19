import RcdaCountries from "@common/system/RcdaCountries";

type ISODateString = string;

export default interface DisasterAssessmentReportModel {
    id: string;
    userId: string;
    creationDate: ISODateString;
    country: RcdaCountries
}
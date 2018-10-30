type ISODateString = string;

export default class DisasterAssessmentReportModel<TReportType> {

    id!: string;
    userId!: string;
    creationDate!: ISODateString;
    lastModifiedDate!: ISODateString;
    report!: TReportType;
}
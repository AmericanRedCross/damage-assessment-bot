import rcdaChatDialog from "@/chat/utils/rcdaChatDialog";
import { askUserInfoDialog } from "@/chat/dialogs/myanmar/disaster-assessment/questions/askUserInfo";
import { selectFormSectionDialog } from "@/chat/dialogs/myanmar/disaster-assessment/selectFormSectionDialog";
import { reviewAndSubmitDialog } from "@/chat/dialogs/myanmar/disaster-assessment/reviewAndSubmitDialog";
import MyanmarDisasterAssessmentModel from "@common/models/resources/disaster-assessment/myanmar/MyanmarDisasterAssessmentModel";
import MyanmarConversationData from "@/chat/models/MyanmarConversationData";
import { makeObjectWithEnumKeys, enumValues } from "@common/utils/enumHelpers";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import MyanmarDisasterAssessmentService from "@/services/disaster-assessment/MyanmarDisasterAssessmentService";
import { myanmarTownships } from "@common/system/countries/myanmar/MyanmarAdminStack";
import { getUserId } from "@/chat/utils/getUserId";

export const createReportDialog = rcdaChatDialog(
    "/createReport",
    () => ({
        disasterAssessmentService: MyanmarDisasterAssessmentService.getInstance()
    }),
    [
        ({ session }) => {
            session.beginDialog(askUserInfoDialog.id);
        },
        ({ session }) => {
            session.beginDialog(selectFormSectionDialog.id);
        },
        ({ session }) => {
            session.beginDialog(reviewAndSubmitDialog.id);
        },
        async ({ session, localizer }, { disasterAssessmentService }) => {
            
            // Save the report
            let model = getMyanmarDisasterAssessmentModel(session.conversationData.mm, getUserId(session));
            //TODO verify user id in middleware
            console.log(JSON.stringify(model));
            try {
                await disasterAssessmentService.create(model);
                session.endDialog(localizer.mm.confirmReportSubmitted);
            }
            catch (ex) {
                console.log(JSON.stringify(ex));
                session.endDialog("Sorry, something went wrong...")
            }
        }
    ],
    {
        references: [askUserInfoDialog, selectFormSectionDialog, reviewAndSubmitDialog]
    });

function getMyanmarDisasterAssessmentModel(myanmarData: MyanmarConversationData, userId: string): MyanmarDisasterAssessmentModel {

    let sectors = makeObjectWithEnumKeys(myanmarData.sectors.selectedSectorIds, sectorId => myanmarData.sectors.completedSectors.find(x => x.id === sectorId));
    let township = myanmarTownships[myanmarData.townshipId];

    let report: MyanmarDisasterAssessmentModel = {
        id: null,
        creationDate: null,
        country: null,
        userId: userId,
        location: {
            regionCode: township.regionCode,
            districtCode: township.districtCode,
            townshipCode: township.code
        },
        disasterType: myanmarData.disasterTypeId,
        geographicalSetting: myanmarData.geographicalSettingId,
        people: {
            numberBeforeDisaster: myanmarData.people.numberOfPeopleBeforeDisaster,
            numberLeftArea: myanmarData.people.numberOfPeopleLeftArea,
            numberReturned: myanmarData.people.numberOfPeopleReturned,
            numberStayedInArea: myanmarData.people.numberOfPeopleLivingCurrently,
            numberAffected: myanmarData.people.numberOfPeopleAffected,
            numberDisplaced: myanmarData.people.numberOfPeopleDisplaced,
            numberNotDisplaced: myanmarData.people.numberOfPeopleNotDisplaced,
            numberOfCasualties: myanmarData.people.numberOfCasualties
        },
        sectors: makeObjectWithEnumKeys(myanmarData.sectors.selectedSectorIds, sectorId => ({
            severity: sectors[sectorId].severity,
            basicNeedsConcern: sectors[sectorId].basicNeedsConcern,
            factors: makeObjectWithEnumKeys(enumValues<MyanmarSectorFactors>(MyanmarSectorFactors), factorId => sectors[sectorId].factors.find(x => x.id === factorId).factorScore)
        })),
        rankings: {
            responseModalities: myanmarData.rankings.responseModalities.filter(x => x.value).sort((a, b) => a.rank - b.rank).map(x => x.value),
            vulnerableGroups: myanmarData.rankings.vulnerableGroups.filter(x => x.value).sort((a, b) => a.rank - b.rank).map(x => x.value),
            affectedGroups: myanmarData.rankings.affectedGroups.filter(x => x.value).sort((a, b) => a.rank - b.rank).map(x => x.value),
            prioritySectors: myanmarData.rankings.prioritySectors.filter(x => x.value).sort((a, b) => a.rank - b.rank).map(x => x.value),
        }
    }

    return report;
}
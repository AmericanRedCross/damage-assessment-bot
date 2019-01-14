<script lang="ts">
import RcdaBaseComponent from "@/components/RcdaBaseComponent";
import { Component, Inject } from "vue-property-decorator";
import MyanmarDashboardService from "@/services/MyanmarDashboardService";
import MyanmarDashboardFilterPanel from "@/components/pages/myanmar-dashboard/MyanmarDashboardFilterPanel.vue";
import MyanmarDashboardRanking from "@/components/pages/myanmar-dashboard/MyanmarDashboardRanking.vue";
import MyanmarDashboardFileImport from "@/components/pages/myanmar-dashboard/MyanmarDashboardFileImport.vue";
import MyanmarDashboardSectorHeatmap from "@/components/pages/myanmar-dashboard/MyanmarDashboardSectorHeatmap.vue";
import GenerateMyanmarDisasterAssessmentSummaryResponse from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryResponse";
import { getKeys } from "@common/utils/objectHelpers";
import { makeObjectWithEnumKeys, enumValues } from "@common/utils/enumHelpers";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import { MyanmarResponseModalities } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarResponseModalities";
import { MyanmarVulnerableGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarVulnerableGroups";
import { MyanmarAffectedGroups } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarAffectedGroups";
import GenerateMyanmarDisasterAssessmentSummaryRequest from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryRequest";

@Component({
  components: {
    MyanmarDashboardFilterPanel,
    MyanmarDashboardRanking,
    MyanmarDashboardSectorHeatmap,
    MyanmarDashboardFileImport
  }
})
export default class MyanmarDashboardPage extends RcdaBaseComponent {

  @Inject()
  readonly myanmarDashboardService!: MyanmarDashboardService;

  summary: GenerateMyanmarDisasterAssessmentSummaryResponse = MyanmarDashboardService.getEmptySummaryResponse();

  showFilters = true;
  isProcessing = false;

  async getSummary(filters: GenerateMyanmarDisasterAssessmentSummaryRequest) {
    this.isProcessing = true;
    try {
      this.summary = await this.myanmarDashboardService.generateSummary(filters);
    }
    finally {
      this.isProcessing = false;
    }
  }

  get populationNumberDisplayItems() {
    if (!this.summary) {
      return [];
    }
    return getKeys(this.summary.people).map(key => ({ // probably want a more manual approach, for the sake of count and ordering
      label: key,
      value: this.summary.people[key]
    }));
  }

  get formattedDisasterTypeHeader(): string {
    if (!this.summary || !this.summary.disasterType) {
      return this.localizer.mm.dashboardSummaryHeadersAllDisasterTypes;
    }
    return this.localizer.mm.disasterTypes[this.summary.disasterType];
  }

  formatDate(dateString: string) {
    let date = new Date(dateString);
    return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
  }

  get formattedLocationHeader(): string {
    if (!this.summary || !this.summary.location) {
      return "";
    }
    if (!this.summary.location.regionCode) {
      return "All Regions";
    }
    let result = this.localizer.mm.regions[this.summary.location.regionCode];
    
    if (!this.summary.location.districtCode) {
      return result;
    }
    result += " > " + this.localizer.mm.districts[this.summary.location.districtCode];

    if (!this.summary.location.townshipCode) {
      return result;
    }
    result += " > " + this.localizer.mm.townships[this.summary.location.townshipCode];

    return result;
  }

  // hooks
  public async mounted() {
    var now = new Date();
    var weekPrevious = new Date();
    weekPrevious.setDate(now.getDate() - 7);

    // initiate population of actual results for the last week 
    await this.getSummary({
      startDate: weekPrevious,
      endDate: now
    });
  }
}
</script>

<template>
<div class="dashboard">
  <myanmar-dashboard-filter-panel :class="{'dashboard-filter-panel-hidden': !showFilters}" @apply-filters="getSummary" />
  <div class="dashboard-main-panel">
    <div class="dashboard-actions dashboard-row">
      <button class="rcda-button-primary" v-if="showFilters" @click="showFilters = false">{{localizer.mm.dashboardCloseFilterPanelButton}}</button>
      <button class="rcda-button-primary" v-else @click="showFilters = true">{{localizer.mm.dashboardOpenFilterPanelButton}}</button>
      <myanmar-dashboard-file-import />
      <button class="rcda-button-primary" @click="myanmarDashboardService.downloadImportTemplate()">{{localizer.mm.dashboardDownloadCsvTemplateButton}}</button>
    </div>
    <div class="dashboard-header dashboard-row">
      <p class="dashboard-header-disaster-type">{{formattedDisasterTypeHeader}}</p>
      <p class="dashboard-header-date-range">{{formatDate(summary.startDate)}} - {{formatDate(summary.endDate)}}</p>
      <p class="dashboard-header-location">{{formattedLocationHeader}}</p>
    </div>
    <div class="dashboard-featured-metrics dashboard-row">
      <div class="dashboard-featured-metric" v-for="(populationNumberItem, index) in populationNumberDisplayItems" :key="index">
          <div class="dashboard-featured-metric-label">{{localizer.mm.dashboardPeopleMetrics[populationNumberItem.label]}}</div>
          <div class="dashboard-featured-metric-value">{{populationNumberItem.value}}</div>
      </div>
    </div>
    <myanmar-dashboard-sector-heatmap :sector-data="summary.sectors" class="dashboard-row"/>
    <div class="dashboard-rankings">
      <myanmar-dashboard-ranking :name="localizer.mm.dashboardRankingAffectedGroupsTitle" :ranking-data="summary.rankings.affectedGroups" :localized-labels="localizer.mm.affectedGroups"/>
      <myanmar-dashboard-ranking :name="localizer.mm.dashboardRankingVulnerableGroupsTitle" :ranking-data="summary.rankings.vulnerableGroups" :localized-labels="localizer.mm.vulnerableGroups"/>
      <myanmar-dashboard-ranking :name="localizer.mm.dashboardRankingPrioritySectorsTitle" :ranking-data="summary.rankings.prioritySectors" :localized-labels="localizer.mm.sectors"/>
      <myanmar-dashboard-ranking :name="localizer.mm.dashboardRankingResponseModalitiesTitle" :ranking-data="summary.rankings.responseModalities" :localized-labels="localizer.mm.responseModalities"/>
    </div>
  </div>
  <a href="/chat" class="dashboard-webchat-link" @click.prevent="$router.push('/chat')">{{localizer.mm.dashboardChatbotLink}}</a>
</div>
</template>

<style>

.dashboard {  
  display: flex;
}

.dashboard > div {
  flex: 1;
  padding-bottom: 60px;
}

.dashboard-filter-panel-hidden {
  display: none;
}

.dashboard-actions {
  display: flex;
  flex-flow: row;
}

.dashboard-actions > * {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
}

.dashboard-actions > *:first-child {
  margin-right: auto;
}

.dashboard-actions > *:not(:first-child) {
  margin-left: 20px;
}

.dashboard-row {
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: #D7D7D8 1px solid;
}

.dashboard-main-panel {
  overflow-y: auto;
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
}

.dashboard-header-disaster-type {
  font-size: 24px;
  font-weight: bold;
}

.dashboard-header-date-range {
  font-size: 20px;
}

.dashboard-header-location {
  font-size: 16px;
}

.dashboard-featured-metrics {
  display: flex;
  flex-flow: wrap;
}

.dashboard-featured-metric {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  flex-grow: 1;
  width: 25%;
  margin-top: 20px;
}

.dashboard-featured-metric-label {
  font-size: 12px;
  font-weight: bold;
}

.dashboard-featured-metric-value {
  font-size: 36px;
  font-weight: bold;
  color: #ED1B2E;
}

.dashboard-rankings {  
  padding-top: 30px;
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.dashboard-rankings > div {  
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
  flex-grow: 1;
  width: 1px;
}

.dashboard-webchat-link {
    position: fixed;
    bottom: 0px;
    right: 40px;
    background-color: #ED1B2E;
    font-size: 14px;
    font-weight: bold;
    color: #FFFFFF;
    border: none;
    padding-top: 11px;
    padding-bottom: 13px;
    padding-left: 22.5px;
    padding-right: 22.5px;
    border-radius: 4px 4px 0px 0px;
    min-width: 115px;
    text-decoration: none;
}

.dashboard-webchat-link:hover {
    text-decoration: underline;
}

</style>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, Emit } from "vue-property-decorator";
import { enumValues } from "@common/utils/enumHelpers";
import { MyanmarDisasterTypes } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarDisasterTypes";
import { myanmarAdminStack } from "@common/system/countries/myanmar/MyanmarAdminStack";
import { getKeys } from "@common/utils/objectHelpers";
import GenerateMyanmarDisasterAssessmentSummaryRequest from "@common/models/services/myanmar-disaster-assessment-summary/GenerateMyanmarDisasterAssessmentSummaryRequest";
import Datepicker from 'vuejs-datepicker';

const disasterEventTypes = enumValues<MyanmarDisasterTypes>(MyanmarDisasterTypes);

@Component({
    components: {
        "v-datepicker": Datepicker
    }
})
export default class MyanmarDashboardFilterPanel extends Vue {

    constructor() {
        super();
        this.selectedStartDate = new Date();
        this.selectedStartDate.setDate(this.selectedStartDate.getDate() - 7);
        this.selectedEndDate = new Date();
    }

    @Emit()
    applyFilters(value: GenerateMyanmarDisasterAssessmentSummaryRequest) {}
    
    get formValues(): GenerateMyanmarDisasterAssessmentSummaryRequest {
        return {
            disasterType: this.selectedDisasterType,
            regionCode: this.selectedRegion,
            districtCode: this.selectedDistrict,
            townshipCode: this.selectedTownship,
            startDate: new Date(this.selectedStartDate),
            endDate: new Date(this.selectedEndDate),
        };
    }
    
    selectedDisasterType: MyanmarDisasterTypes = <any>null;
    selectedRegion: string = <any>null;
    selectedDistrict: string = <any>null;
    selectedTownship: string = <any>null;
    selectedStartDate: Date = <any>null;
    selectedEndDate: Date = <any>null;

    disasterEventTypes = disasterEventTypes;

    @Watch("selectedRegion")
    resetDistrict() {
        this.selectedDistrict = <any>null;
        this.selectedTownship = <any>null;
    }

    @Watch("selectedDistrict")
    resetTownship() {
        this.selectedTownship = <any>null;
    }

    get regionSelectList() {
        return getKeys(myanmarAdminStack.regions);
    }
    get districtSelectList() {
        if (this.selectedRegion) {
            return getKeys(myanmarAdminStack.regions[this.selectedRegion].districts);
        }
    }
    get townshipSelectList() {
        if (this.selectedRegion && this.selectedDistrict) {
            return getKeys(myanmarAdminStack.regions[this.selectedRegion].districts[this.selectedDistrict].townships);
        }
    }
}
</script>

<template>
<div class="dashboard-filter-panel">
    <div class="dashboard-filter-header">{{localizer.mm.dashboardFilterHeader}}</div>
    <div class="dashboard-filter-form">
        <div class="dashboard-filter-form-item">
            <div class="dashboard-filter-form-item-label">{{localizer.mm.dashboardFilterDisasterTypeInutLabel}}</div>
            <select class="dashboard-filter-form-item-input" v-model="selectedDisasterType">
                <option selected="selected" :value="null">{{localizer.common.dropdownInputSelectAllOption}}</option>
                <option v-for="disasterEventType of disasterEventTypes" :key="disasterEventType" :value="disasterEventType">{{localizer.mm.disasterTypes[disasterEventType]}}</option>
            </select>
        </div>
        <div class="dashboard-filter-form-group">
            <div class="dashboard-filter-form-group-label">{{localizer.mm.dashboardFilterLocationInputGroupLabel}}</div>
            <div class="dashboard-filter-form-group-item">
                <div class="dashboard-filter-form-group-item-label">{{localizer.mm.dashboardFilterRegionInputLabel}}</div>
                <select class="dashboard-filter-form-item-input" v-model="selectedRegion">
                    <option selected="selected" :value="null">{{localizer.common.dropdownInputSelectAllOption}}</option>
                    <option v-for="region in regionSelectList" :key="region" :value="region">{{localizer.mm.regions[region]}}</option>
                </select>
            </div>
            <div class="dashboard-filter-form-group-item" v-if="selectedRegion">
                <div class="dashboard-filter-form-group-item-label">{{localizer.mm.dashboardFilterDistrictInputLabel}}</div>
                <select class="dashboard-filter-form-item-input" v-model="selectedDistrict">
                    <option selected="selected" :value="null">{{localizer.common.dropdownInputSelectAllOption}}</option>
                    <option v-for="district in districtSelectList" :key="district" :value="district">{{localizer.mm.districts[district]}}</option>
                </select>
            </div>
            <div class="dashboard-filter-form-group-item" v-if="selectedDistrict">
                <div class="dashboard-filter-form-group-item-label">{{localizer.mm.dashboardFilterTownshipInputLabel}}</div>
                <select class="dashboard-filter-form-item-input" v-model="selectedTownship">
                    <option selected="selected" :value="null">{{localizer.common.dropdownInputSelectAllOption}}</option>
                    <option v-for="township in townshipSelectList" :key="township" :value="township">{{localizer.mm.townships[township]}}</option>
                </select>
            </div>
        </div>
        <div class="dashboard-filter-form-group">
            <div class="dashboard-filter-form-group-label">{{localizer.mm.dashboardFilterDateRangeInputGroupLabel}}</div>
            <div class="dashboard-filter-form-group-item">
                <div class="dashboard-filter-form-group-item-label">{{localizer.mm.dashboardFilterStartDateInputLabel}}</div>
                <v-datepicker class="dashboard-filter-form-item-input" v-model="selectedStartDate" />
            </div>
            <div class="dashboard-filter-form-group-item">
                <div class="dashboard-filter-form-group-item-label">{{localizer.mm.dashboardFilterEndDateInputLabel}}</div>
                <v-datepicker class="dashboard-filter-form-item-input" v-model="selectedEndDate" />
            </div>
        </div>
        <button class="rcda-button-primary" @click="applyFilters(formValues)">{{localizer.mm.dashboarFilterApplyButton}}</button>
    </div>
</div>
</template>

<style>

.dashboard-filter-panel {
    float: left;
    overflow-y: hidden;
    height: 170%;
    width: 270px;
    background-color: #EFEFEF;
    box-sizing: border-box;
    padding-top: 26px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    overflow: visible;
}

.dashboard-filter-header {
    font-size: 24px;
    padding-bottom: 26px;
    font-weight: bold;
}

.dashboard-filter-form-group {
    margin-bottom: 10px;
}

.dashboard-filter-form-group-label {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 15px;
    border-bottom: #9F9FA3 1px solid;
    margin-bottom: 15px;
}

.dashboard-filter-form-item-label {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 12px;
}

.dashboard-filter-form-group-item-label {
    font-size: 16px;
    padding-bottom: 10px;
}

.dashboard-filter-form-item-input:not(.vdp-datepicker) {
    font-size: 16px;
    height: 40px;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 4px;
    box-shadow: none;
    border: 1px #D7D7D8 solid;
}

.dashboard-filter-form-item-input {
    margin-bottom: 20px;
}

.dashboard-filter-form-item-input input {
    font-size: 16px;
    margin-bottom: 20px;
    height: 40px;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 4px;
    box-shadow: none;
    border: 1px #D7D7D8 solid;
    margin-bottom: 0px;
}

</style>
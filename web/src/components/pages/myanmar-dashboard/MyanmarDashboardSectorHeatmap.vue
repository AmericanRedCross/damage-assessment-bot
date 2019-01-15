<script lang="ts">
import Vue from "vue";
import { Component, Inject, Prop } from "vue-property-decorator";
import MyanmarDashboardService from "services/MyanmarDashboardService";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { enumValues } from "@common/utils/enumHelpers";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";

@Component
export default class MyanmarDashboardSectorHeatmap extends Vue {

    @Prop()
    sectorData!: { [sectors in MyanmarSectors]: any};

    readonly sectorIds = enumValues<MyanmarSectors>(MyanmarSectors)
    readonly sectorFactorIds = enumValues<MyanmarSectorFactors>(MyanmarSectorFactors);

    cellStyle(num: number) {
        let intensity = ((num / 5 ) * .8) + .2;

        return `background-color: rgba(236, 183, 49, ${intensity});`
    }
}
</script>

<template>
<div>
    <h2>{{localizer.mm.dashboardSectorHeatMapHeader}}</h2>
    <table class="dashboard-heatmap">
        <tr class="dashboard-heatmap-header-row">
            <th></th><!-- empty header -->
            <th v-for="sectorId of sectorIds" :key="sectorId">{{localizer.mm.sectors[sectorId]}}</th>
        </tr>
        <tr>
            <td class="dashboard-heatmap-row-header">{{localizer.mm.dashboardSectorHeatmapSeverityHeader}}</td>
            <td v-for="sectorId of sectorIds" :key="sectorId" :style="cellStyle(sectorData[sectorId].severity)">
                <div class="dashboard-heatmap-cell-value">{{sectorData[sectorId].severity}}</div>
            </td>
        </tr>
        <tr v-for="sectorFactorId of sectorFactorIds" :key="sectorFactorId">
            <td class="dashboard-heatmap-row-header">{{localizer.mm.sectorFactors[sectorFactorId]}}</td>
            <td v-for="sectorId of sectorIds" :key="sectorId" :style="cellStyle(sectorData[sectorId].factors[sectorFactorId])">
                <div class="dashboard-heatmap-cell-value">{{sectorData[sectorId].factors[sectorFactorId]}}</div>
            </td>
        </tr>
        <tr>
            <td class="dashboard-heatmap-row-header">{{localizer.mm.dashboardSectorHeatmapBasicNeedsHeader}}</td>
            <td v-for="sectorId of sectorIds" :key="sectorId" :style="cellStyle(sectorData[sectorId].basicNeedsConcern)">
                <div class="dashboard-heatmap-cell-value">{{sectorData[sectorId].basicNeedsConcern}}</div>
            </td>
        </tr>
    </table>
</div>
</template>

<style>

.dashboard-heatmap td:not(:last-child):not(:first-child), .dashboard-heatmap th:not(:last-child):not(:first-child) {
    border-right: #D7D7D8 1px solid;
}

.dashboard-heatmap td:not(:first-child) {
    background-color: rgba(93, 72, 19, 1);
    opacity: 10%;
}

.dashboard-heatmap-header-row > th {
    min-width: 100px;
    padding-bottom: 18px;
    padding-left: 10px;
    padding-right: 10px;
}

.dashboard-heatmap-row-header {
    height: 54px;
    background-color: #EFEFEF;
    padding-left: 17px;
    padding-right: 17px;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
}

.dashboard-heatmap-cell-value {
    visibility: hidden;
    text-align: center;
    vertical-align: middle;
}

/* td:hover > .dashboard-heatmap-cell-value {
    visibility: visible;
} */

</style>
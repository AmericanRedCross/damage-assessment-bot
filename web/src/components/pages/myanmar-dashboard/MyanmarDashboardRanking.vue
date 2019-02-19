<script lang="ts">
import Vue from "vue";
import { Component, Inject, Prop } from "vue-property-decorator";
import MyanmarDashboardService from "services/MyanmarDashboardService";
import { MyanmarSectors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectors";
import { enumValues } from "@common/utils/enumHelpers";
import { MyanmarSectorFactors } from "@common/models/resources/disaster-assessment/myanmar/enums/MyanmarSectorFactors";
import RcdaModal from "@/components/widgets/RcdaModal.vue";

@Component({
    components: {
        RcdaModal
    }
})
export default class MyanmarDashboardRanking extends Vue {

    @Prop()
    rankingData!: any[]

    @Prop()
    localizedLabels!: { [x: string]: string };

    @Prop()
    name!: string;

    get topRankings() {
        if (!this.rankingData) {
            return [];
        }
        return this.rankingData.slice(0, 3);
    }

    showAllRankings = false;
}
</script>

<template>
<div class="dashboard-ranking-section">
    <h3 class="dashboard-ranking-section-header">{{name}}</h3>
    <div class="dashboard-ranking-list">
        <div class="dashboard-ranking-list-item" v-for="(rankedItem, index) of topRankings" :key="rankedItem">
            <span class="dashboard-ranking-list-item-number">{{index + 1}}</span>
            <span class="dashboard-ranking-list-item-value">{{localizedLabels[rankedItem]}}</span>
        </div>
    </div>
    <button class="dashboard-ranking-show-all-button" @click="showAllRankings = true">{{localizer.mm.dashboardRankingSeeAllButton}}</button>
    <rcda-modal :is-open="showAllRankings" @close="showAllRankings = false" :title="name">
        <div class="dashboard-ranking-list">
            <div class="dashboard-ranking-list-item" v-for="(rankedItem, index) of topRankings" :key="rankedItem">
                <span class="dashboard-ranking-list-item-number">{{index + 1}}</span>
                <span class="dashboard-ranking-list-item-value">{{localizedLabels[rankedItem]}}</span>
            </div>
        </div>
    </rcda-modal>
</div>
</template>

<style>

.dashboard-ranking-section {
    display: inline-block;
}

.dashboard-ranking-section-header {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 18px;
    margin: 0px;
}

.dashboard-ranking-list-item {
    font-size: 14px;
    padding-bottom: 20px;
}

.dashboard-ranking-list-item-number {
    background-color: #333333;
    border-radius: 100px;
    width: 20px;
    height: 20px;
    color: white;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    padding: 2px;
    margin-right: 5px;
}

.dashboard-ranking-list-item-value {
    text-align: center;
    vertical-align: middle;
}

.dashboard-ranking-show-all-button {
    background-color: white;
    border: none;
    padding: 0px;
    margin: 0px;
    color: #007CAF;
    text-decoration: underline;
}

.dashboard-ranking-show-all-button:hover {
    cursor: pointer;
}

</style>
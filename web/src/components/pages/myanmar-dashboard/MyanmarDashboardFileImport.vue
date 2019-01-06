<script lang="ts">
import Vue from "vue";
import { Component, Inject, Prop } from "vue-property-decorator";
import MyanmarDashboardService from "services/MyanmarDashboardService";
import { enumValues } from "@common/utils/enumHelpers";
import RcdaModal from "@/components/widgets/RcdaModal.vue";
import RcdaFileSelector from "@/components/widgets/RcdaFileSelector.vue";

@Component({
    components: {
        RcdaModal,
        RcdaFileSelector
    }
})
export default class MyanmarDashboardFileImport extends Vue {

    @Inject()
    readonly myanmarDashboardService!: MyanmarDashboardService;

    modalIsOpen = false;

    get hasFeedbackMessage() {
        return this.noFileSelectedError
            || this.uploadSucceeded
            || this.uploadFailed;
    }
    resetFeedbackMessages() {
        this.noFileSelectedError = false;
        this.uploadSucceeded = false;
        this.uploadFailed = false;
    }
    noFileSelectedError = false;
    uploadSucceeded = false;
    uploadFailed = false;

    async importFile() {
        this.resetFeedbackMessages();

        if (!this.selectedFile) {
            this.noFileSelectedError = true;
            return;
        }
        
        try {
            await this.myanmarDashboardService.importFile(this.selectedFile);
            
            this.uploadSucceeded = true;
            this.selectedFile = null;
        }
        catch {
            this.uploadFailed = true;
        }
    }

    selectedFile: File|null = null;
}
</script>

<template>
<div>
    <button class="rcda-button-primary" @click="modalIsOpen = true">{{localizer.mm.dashboardFileImportButton}}</button>
    <rcda-modal @close="modalIsOpen = false" :is-open="modalIsOpen" :title="localizer.mm.dashboardFileImportHeader">
        <div class="dashboard-upload-feedback" v-if="hasFeedbackMessage">
            <div v-if="noFileSelectedError">{{localizer.mm.dashboardFileImportNoFileSelectedError}}</div>
            <div v-if="uploadSucceeded">{{localizer.mm.dashboardFileImportSuccessMessage}}</div>
            <div v-if="uploadFailed">{{localizer.mm.dashboardFileImportFailureMessage}}</div>
        </div>
        <label class="rcda-input-label">{{localizer.mm.dashboardFileImportSelectFileLabel}}</label>
        <rcda-file-selector v-model="selectedFile" accept=".csv,.json"/> 
        <div class="dashboard-upload-help-text">
            <p>{{localizer.mm.dashboardFileImportAcceptedFileTypesHelpText}}</p>
            <p>{{localizer.mm.dashboardFileImportErrorBehaviorHelpText}}</p>
            <p>To ensure the format is correct, you can <button class="dashboard-upload-get-template-button" @click="myanmarDashboardService.downloadImportTemplate()">download a template here.</button></p>
        </div>
        <button class="rcda-button-primary" @click="importFile">Upload</button>
    </rcda-modal>
</div>
</template>

<style>

.dashboard-upload-feedback {
    font-size: 14px;
    padding-top: 22px;
    padding-bottom: 21px;
    padding-left: 24px;
    padding-right: 24px;
    background-color: rgb(65,99,155, .2);
    color: #41639B;
    border-radius: 4px;
    margin-bottom: 30px;
}

.dashboard-upload-help-text {
    font-size: 14px;
    padding-bottom: 30px;
}

.dashboard-upload-get-template-button {
    background-color: white;
    border: none;
    padding: 0px;
    margin: 0px;
    color: #007CAF;
    text-decoration: underline;
}

.dashboard-upload-get-template-button:hover {
    cursor: pointer;
}
</style>
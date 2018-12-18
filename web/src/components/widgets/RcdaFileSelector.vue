<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import ChatService from "@/services/ChatService";

@Component
export default class RcdaFileSelector extends Vue {

    @Prop()
    accept!: string;

    @Prop()
    value: File|null = null;

    @Emit()
    input(file: File|null) { }

    fileInputUpdated() {
        let fileInput = <HTMLInputElement>this.$refs.fileInput;

        let files = fileInput.files;
        let result: File|null = null;

        if (files && files.length > 0) {
            result = files[0];
        }

        this.value = result;
        this.input(result);
    }

    browseFiles() {
        let fileInput = <HTMLInputElement>this.$refs.fileInput;

        fileInput.click();
    }
    
    get fileName() { return this.value ? this.value.name : ""}
}
</script>

<template>
<div>
    <div class="rcda-file-selector">
        <div class="rcda-file-selector-text" :title="fileName">{{fileName}}</div>
        <div class="rcda-file-selector-button" @click="browseFiles">Browse</div>
    </div>
    <!-- Actual file input is hidden off-screen. Using a fake proxy input is necessary because the real input can't use custom styles -->
    <input type="file" ref="fileInput" @input="fileInputUpdated" :accept="accept" tabindex="0" style="position: fixed; left: -20px; width: 1px;"/>
</div>
</template>

<style>

.rcda-file-selector {
    width: 100%;
    border-radius: 4px;
    border: #D7D7D8 1px solid;
    display: inline-flex;
}

.rcda-file-selector-text {
    flex-grow: 1;
    padding-top: 11px;
    padding-bottom: 11px;
    padding-left: 20px;
    padding-right: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.rcda-file-selector-button {
    flex-grow: 0;
    display: inline-block;
    background-color: #6D6E70;
    font-size: 14px;
    font-weight: bold;
    color: #FFFFFF;
    border: none;
    padding-top: 11px;
    padding-bottom: 11px;
    padding-left: 22.5px;
    padding-right: 22.5px;
    border-radius: 0 4px 4px 0;
}

.rcda-file-selector-button:hover {
    cursor: pointer;
}

</style>
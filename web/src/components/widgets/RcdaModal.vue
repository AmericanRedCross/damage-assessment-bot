<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import ChatService from "@/services/ChatService";

@Component
export default class RcdaModal extends Vue {

    @Prop()
    isOpen!: boolean;

    @Prop()
    title!: string;

    @Emit()
    close() {}
}
</script>

<template>
<div v-if="isOpen" class="rcda-modal-backdrop">
    <div class="rcda-modal">
        <div class="rcda-modal-header"> 
            <button class="rcda-modal-close-button" @click="close"><i class="icon-close"></i></button>
            <h2 class="rcda-modal-title">{{title}}</h2>
        </div>
        <div class="rcda-modal-content">
            <slot></slot>
        </div>
    </div>
</div>
</template>

<style>

.rcda-modal {
    width: 600px;
    background-color: white;
    padding-top: 32px;
    padding-left: 39px;
    padding-right: 39px;
    padding-bottom: 40px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, .16);
    margin-left: auto;
    margin-right: auto;
    border-radius: 4px;
    max-height: 90%;
    overflow-y: auto;
}

.rcda-modal-backdrop {
    position: fixed;
    top: 76px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: rgba(43, 43, 44, .8);/* #6D6E70; */
    display: flex;
    flex-flow: column;
    justify-content: center;
}

.rcda-modal-close-button {
    float: right;
    background-color: #ED1B2E;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 100px;
    color: white;
    font-size: 18px;
    font-weight: lighter;
}

.rcda-modal-close-button:hover {  
    cursor: pointer;
}

.rcda-modal-title {
    margin: 0px;
    font-size: 20px;
    font-weight: bold;
}

.rcda-modal-header {
    padding-bottom: 30px;
    border-bottom: 1px #D7D7D8 solid;
    margin-bottom: 30px;
}

</style>
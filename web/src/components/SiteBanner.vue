<script lang="ts">
import Vue from "vue";
import { Component, Inject, Watch } from "vue-property-decorator";
import ChatService from "@/services/ChatService";
import { RcdaLanguages, RcdaLanguageNames } from "@common/system/RcdaLanguages";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";

@Component
export default class SiteBanner extends Vue {

    languages: RcdaLanguages[] = [ RcdaLanguages.English, RcdaLanguages.Burmese ] 
    languageNames = RcdaLanguageNames;
    selectedLanguage = RcdaLanguages.English;

    goToDashboard() {
        this.$router.push("/");
    }

    @Watch("selectedLanguage")
    languageChanged() {
        (<any>this).rcdaLocalizerEvents.$emit("set-language", this.selectedLanguage);
    }
}
</script>

<template>
<div class="rcda-banner">
    <div class="rcda-site-logo">X</div>
    <a class="rcda-site-title" @click.prevent="goToDashboard();" href="/">{{localizer.common.siteTitle}}</a>
    <div class="banner-language-picker">
        <label class="banner-language-picker-label">{{localizer.common.languageSelectorLabel}}</label>
        <select class="banner-language-picker-input" v-model="selectedLanguage">
            <option v-for="language in languages" :value="language" :key="language">{{languageNames[language]}}</option>
        </select>
    </div>
</div>
</template>

<style>

.rcda-site-logo {
    color: rgba(0, 0, 0, 0);
    width: 95px;
    float: left;
    padding-left: 30px;
    padding-right: 30px;
    border-right: #D7D7D8 1px solid;
    height: 45px;
    margin-right: 20px;
}

.rcda-site-title {
    padding-top: 10px;
    float: left;
    font-size: 20px;
    font-weight: bold;
    display: block;
    text-decoration: none;
    color: inherit;
}

.rcda-site-title:hover {
    cursor: pointer;
}

.rcda-banner {
    width: 100%;
    border-bottom: #D7D7D8 1px solid;
    padding-top: 17px;
    padding-bottom: 60px;
    box-sizing: border-box;
}

.rcda-banner-style-dark {
    background-color: #494949;
}

.rcda-banner-style-dark .rcda-site-title, .rcda-banner-style-dark .banner-language-picker-label {
    color: white;
}

.banner-language-picker {
    float: right;
    padding-right: 30px;
}

.banner-language-picker-label {
    font-size: 16px;
}
.banner-language-picker-input {
    font-size: 16px;
    margin-bottom: 20px;
    height: 40px;
    width: 125px;
    padding-left: 15px;
    padding-right: 15px;
    margin-left: 15px;
}
</style>
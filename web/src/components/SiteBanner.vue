<script lang="ts">
import Vue from "vue";
import { Component, Inject, Watch } from "vue-property-decorator";
import ChatService from "@/services/ChatService";
import { RcdaLanguages, RcdaLanguageNames } from "@common/system/RcdaLanguages";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import AuthService from "@/services/AuthService";

@Component
export default class SiteBanner extends Vue {

    @Inject("authService")
    private authService!: AuthService;

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

    isSignedIn(): boolean {
        return true;//this.authService.hasActiveSession;
    }

    signOut() {
        if (confirm((<any>this).localizer.common.confirmSignOut)) {
            this.authService.logout();
            this.$router.push({ path: `/login`, query: { redirect: this.$router.currentRoute.path } });
        }
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
    <div class="banner-sign-out">
        <button type="button" class="rcda-link-button" v-if="isSignedIn()" @click.prevent="signOut()">{{localizer.common.signOutButton}}</button>
    </div>
</div>
</template>

<style lang="scss">
@import "~styles/responsive";
@import "~styles/common";

.rcda-banner {
    border-bottom: #D7D7D8 1px solid;
    padding-top: 13px;
    padding-bottom: 12px;
    display: flex;
}

.rcda-site-logo {
    color: rgba(0, 0, 0, 0);
    width: 95px;
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
    flex-grow: 1;

    @include mobile {
        display: none;
    }

    :hover {
        cursor: pointer;
    }
}

@include desktop {
    .rcda-banner-style-dark {
        
        background-color: #494949;
        border-bottom: none;
        
        .rcda-site-title,
        .banner-language-picker-label {
            color: white;
        }

        .rcda-link-button {
            color: #ecb731;
        }
    }
}


.banner-language-picker {
    padding-right: 20px;
    border-right: #D7D7D8 1px solid;
    margin-right: 20px;
    margin-left: auto;
}

.banner-language-picker-label {
    font-size: 16px;
    margin-right: 12px;
    
    @include mobile {
        display: none;
    }
}

.banner-language-picker-input {
    font-size: 16px;
    height: 40px;
    width: 125px;
    padding-left: 14px;
}

.banner-sign-out {
    align-self: center;
    
    button {
        margin-right: 25px;
    }
}

</style>
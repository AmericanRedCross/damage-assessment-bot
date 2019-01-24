<script lang="ts">
import Vue from "vue";
import { Component, Inject, Watch } from "vue-property-decorator";
import ChatService from "@/services/ChatService";
import { RcdaLanguages, RcdaLanguageNames } from "@common/system/RcdaLanguages";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import AuthService from "@/services/AuthService";
import RcdaBaseComponent from "@/components/RcdaBaseComponent";
import { getKeys } from "@common/utils/objectHelpers";
import LanguageService from "@/services/LanguageService";

@Component
export default class SiteBanner extends RcdaBaseComponent {

    @Inject("authService")
    private authService!: AuthService;
    
    @Inject("languageService")
    private languageService!: LanguageService;

    languages = [ RcdaLanguages.English, RcdaLanguages.Burmese, RcdaLanguages.BurmeseZawgyi ];
    languageNames = RcdaLanguageNames;
    selectedLanguage = RcdaLanguages.English; // this gets reassigned in the mounted() hook

    goToDashboard() {
        this.$router.push("/");
    }

    @Watch("selectedLanguage")
    languageChanged() {
        this.languageService.userLanguage = this.selectedLanguage;
        this.rcdaLocalizerEvents.language = this.selectedLanguage;
        this.rcdaLocalizerEvents.$emit("set-language", this.selectedLanguage);
    }
    
    signOut() {
        if (confirm((<any>this).localizer.common.confirmSignOut)) {
            this.authService.logout();
        }
    }
    
    // auth status is non-reactive, so we have to subscribe to changes of that value
    isSignedIn = false;
    hasSubscribedToLoginStatus = false;
    mounted() {
        this.selectedLanguage = this.languageService.userLanguage;
        this.isSignedIn = this.authService.hasActiveSession;
        if (!this.hasSubscribedToLoginStatus) {
            let self = this;
            this.authService.onLoginStatusChange(function(isSignedIn: boolean) {
                self.isSignedIn = isSignedIn;
            });
        }
    }
}
</script>

<template>
<div class="rcda-banner">
    <div class="rcda-site-logo"></div>
    <a class="rcda-site-title" @click.prevent="goToDashboard();" href="/">{{localizer.common.siteTitle}}</a>
    <div class="banner-sign-out" v-if="isSignedIn">
        <button type="button" class="rcda-link-button" @click.prevent="signOut()">{{localizer.common.signOutButton}}</button>
    </div>
    <div class="banner-language-picker">
        <label class="banner-language-picker-label">{{localizer.common.languageSelectorLabel}}</label>
        <i class="icon-language"></i>
        <select class="banner-language-picker-input" v-model="selectedLanguage">
            <i class="icon-caret-down"></i>
            <option v-for="language in languages" :value="language" :key="language">{{languageNames[language]}}</option>
        </select>
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
    align-items: center;
}

.rcda-site-logo {
    background-image: url('/dist/images/site-logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    width: 70px;
    box-sizing: content-box;
    border-right: #D7D7D8 1px solid;
    height: 40px;
    padding-right: 20px;
    margin-left: 20px;
    margin-right: 20px;
}

.rcda-site-title {
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
        .banner-language-picker-label,
        .icon-language {
            color: white;
        }

        .rcda-link-button {
            color: #ecb731;
        }
    }
}

.banner-language-picker {
    margin-left: auto;
    margin-right: 20px;
    display: flex;
    align-items: center;

    @include mobile {

        &:not(:last-child) {
            margin-right: auto;
        }
    }

    .icon-language {
        font-size: 30px;
        margin-right: 12px;
    }

    .banner-sign-out ~ & {
        padding-right: 20px;
        border-right: 1px #D7D7D8 solid;
    }
}

.banner-language-picker-label {
    font-size: 16px;
    margin-right: 10px;
    
    @include mobile {
        display: none;
    }
}

.banner-language-picker-input {
    font-size: 16px;
    margin-bottom: 20px;
    height: 40px;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 4px;
    box-shadow: none;
    border: 1px #D7D7D8 solid;
    margin-bottom: 0px;
    position: relative;
    
    @include desktop {
        min-width: 100px;
    }
}

.banner-sign-out {
    align-self: center;
    order: 5;
    max-width: 125px;
    
    button {
        margin-right: 25px;
    }
}

</style>
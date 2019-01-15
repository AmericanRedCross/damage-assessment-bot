<script lang="ts">
import Vue from "vue";
import { Component, Inject, Watch } from "vue-property-decorator";
import ChatService from "@/services/ChatService";
import { RcdaLanguages, RcdaLanguageNames } from "@common/system/RcdaLanguages";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import AuthService from "@/services/AuthService";
import RcdaBaseComponent from "@/components/RcdaBaseComponent";

@Component
export default class SiteBanner extends RcdaBaseComponent {

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
        this.rcdaLocalizerEvents.language = this.selectedLanguage;
        this.rcdaLocalizerEvents.$emit("set-language", this.selectedLanguage);
    }
    
    signOut() {
        if (confirm((<any>this).localizer.common.confirmSignOut)) {
            this.authService.logout();
            this.$router.push({ path: `/login`, query: { redirect: this.$router.currentRoute.path } });
        }
    }
    
    // auth status is non-reactive, so we have to subscribe to changes of that value
    isSignedIn = false;
    hasSubscribedToLoginStatus = false;
    mounted() {
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
    <div class="rcda-site-logo">X</div>
    <a class="rcda-site-title" @click.prevent="goToDashboard();" href="/">{{localizer.common.siteTitle}}</a>
    <div class="banner-language-picker">
        <label class="banner-language-picker-label">{{localizer.common.languageSelectorLabel}}</label>
        <select class="banner-language-picker-input" v-model="selectedLanguage">
            <option v-for="language in languages" :value="language" :key="language">{{languageNames[language]}}</option>
        </select>
    </div>
    <div class="banner-sign-out" v-if="isSignedIn">
        <button type="button" class="rcda-link-button" @click.prevent="signOut()">{{localizer.common.signOutButton}}</button>
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

    &:after:last-child {
        content: "";
        order: 4;
        border-right: #D7D7D8 1px solid;
        margin-left: 20px;
        height: 45px;
    }
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
    margin-left: auto;
    margin-right: 20px;

    @include mobile {

        &:not(:last-child) {
            margin-right: auto;
        }
    }
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
    margin-left: 20px;
    order: 5;
    
    button {
        margin-right: 25px;
    }
}

</style>
<script lang="ts">
import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import { Component, Inject, Watch } from "vue-property-decorator";
import TestComponent from "@/TestComponent.vue";
import LoginPage from "@/components/pages/LoginPage.vue";
import AuthService from "@/services/AuthService";
import ChatRegistrationPage from "@/components/pages/ChatRegistrationPage.vue";
import DashboardPage from "@/components/pages/myanmar-dashboard/MyanmarDashboardPage.vue";
import WebChatPage from "@/components/pages/WebChatPage.vue";
import SiteBanner from "@/components/SiteBanner.vue";

@Component({
    router: new VueRouter({
        mode: 'history',
        routes: [
            { path: '/', component: DashboardPage },
            { path: '/login', component: LoginPage },
            { path: '/chat', component: WebChatPage },
            { path: '/chat/register', component: ChatRegistrationPage },
            { path: '*', redirect: '/' }
        ]
    }),
    components: {
        SiteBanner
    }
})
export default class RootComponent extends Vue {
    
    @Inject()
    private authService!: AuthService;

    @Watch("$route", { immediate: true })
    private routeChange(to: Route) {
        let navigatingToLogin = to.path === "/login";
        if (!this.authService.hasActiveSession) {
            if (!navigatingToLogin) {
                this.$router.replace({ path: `/login`, query: { redirect: to.path }});
            }
        }
        else {
            if (navigatingToLogin) {
                this.$router.replace({ path: to.query.redirect || `/` });
            }
        }
    }

    // hooks
    private errorCaptured(error: Error) {
        // TODO: error notifications in UI?
        console.error("Rcda logger - error caught: " + error.message);
    }

    get bannerStyle() {
        let lastPath = this.$route.path.split("/").pop();
        if (!lastPath) {
            return;
        }
        
        lastPath = lastPath.toLowerCase();
        if (lastPath === "login" || lastPath === "chat") {
            return "rcda-banner-style-dark";
        }
        // default theme does not use a class
        return "";
    }
}
</script>

<template>
<div>
    <site-banner :class="bannerStyle"/>
    <router-view class="rcda-main-panel"></router-view>
</div>
</template>

<style>

.rcda-main-panel {
    position: fixed;
    top: 76px;
    left: 0;
    right: 0;
    bottom: 0;
}

.rcda-input-label {
    font-size: 16px;
    padding-bottom: 10px;
    display: block;
}

.rcda-input {    
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

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: '';
}

select::-ms-expand {
    display: none;
}

* {
    box-sizing: border-box;
    font-family: Arial;
}

body, h1, h2, h3, h4, h5, h6 {
    margin: 0px;
}

body {
    height: 100vw;
    overflow: hidden;
}

.rcda-button-primary {
    background-color: #ED1B2E;
    font-size: 14px;
    font-weight: bold;
    color: #FFFFFF;
    border: none;
    padding-top: 11px;
    padding-bottom: 13px;
    padding-left: 22.5px;
    padding-right: 22.5px;
    border-radius: 4px;
    min-width: 115px;
}

.rcda-button-primary:hover {  
    cursor: pointer;
}

</style>
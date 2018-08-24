<template>
      <router-view></router-view>
</template>


<script lang="ts">
import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import { Component, Inject, Watch } from "vue-property-decorator";
import TestComponent from "@/TestComponent.vue";
import LoginPage from "@/components/pages/LoginPage.vue";
import AuthService from "@/services/AuthService";
import ChatRegistrationPage from "@/components/pages/ChatRegistrationPage.vue";
import DashboardPage from "@/components/pages/DashboardPage.vue";

@Component({
    router: new VueRouter({
        routes: [
            { path: '/', component: DashboardPage },
            { path: '/login', component: LoginPage },
            { path: '/register', component: ChatRegistrationPage },
            { path: '*', redirect: '/' }
        ]
    })
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

    // hooks TODO: test this
    private errorCaptured(error: Error) {
        alert(error.message);
    }
}
</script>
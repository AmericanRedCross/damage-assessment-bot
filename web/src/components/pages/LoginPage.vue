<template>
    <div>
      <h1>Log in</h1>
      <form>
        <label>
          Username:
          <input type="text" v-model="username"/>
        </label>
        <label>
          Password:
          <input type="password" v-model="password"/>
        </label>
        <p v-if="attemptedLogin && !isValid">Username or password are empty</p>
        <p>{{username}} {{password}}</p>
        <button @click="submitLogin">Submit</button>
      </form>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import AuthService from "@/services/AuthService";

@Component
export default class LoginPage extends Vue {

  @Inject()
  private authService!: AuthService;

  public username = "";
  public password = "";
  public attemptedLogin = false;

  get isValid() {
    return !!this.username && !!this.password;
  }

  public async submitLogin() {
    this.attemptedLogin = true;
    if (this.isValid) {
      await this.authService.logIn(this.username, this.password);
      this.$router.replace(this.$route.query.redirect || '/');
    }
  }
}
</script>
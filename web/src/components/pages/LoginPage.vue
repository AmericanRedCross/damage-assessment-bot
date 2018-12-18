<script lang="ts">
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import AuthService from "@/services/AuthService";

@Component
export default class LoginPage extends Vue {

  @Inject()
  private authService!: AuthService;

  private username = "";
  private password = "";
  private attemptedLogin = false;
  private loginFailed = false;

  get missingRequiredFields() {
    return !this.username || !this.password;
  }

  get hasErrorMessages() {
    return this.attemptedLogin && this.missingRequiredFields || this.loginFailed;
  }

  public async login() {
    this.attemptedLogin = false;
    if (this.missingRequiredFields) {
      this.attemptedLogin = true;
      return;
    }
    try {
      let loginSucceeded = await this.authService.login(this.username, this.password);
      if (loginSucceeded) {
        this.$router.replace(this.$route.query.redirect || '/');
      }
    }
    catch {
        this.loginFailed = true;
    }
    finally {      
      this.attemptedLogin = true;
    }
  }
}
</script>

<template>
<div class="login-background">
  <div class="login-modal">
    <h2 class="login-header">Damage Assessment Dashboard</h2>
    <form @submit="$event.preventDefault(); login()">      
      <div v-if="hasErrorMessages" class="login-errors">
        <div v-if="missingRequiredFields">A value must be provided for username and password</div>
        <div v-if="loginFailed">Login failed due to invalid username or password</div>
      </div>
      <div class="rcda-form-item">
        <label class="rcda-input-label">Username</label>
        <input type="text" v-model="username" class="rcda-input" />
      </div>
      <div class="rcda-form-item">
        <label class="rcda-input-label">Password</label>
        <input type="password" v-model="password" class="rcda-input"/>
      </div>
      <a href="https://go.ifrc.org/recover-account" class="login-forgot-password-link">Forgot Password?</a>
      <button type="submit" class="login-button">Login</button>
      <div class="login-ifrc-auth-info">
        <div class="login-ifrc-auth-info-logo">logo</div>
        <span>Use your IFRC GO credentials</span>
        <a href="https://go.ifrc.org/register" class="login-register-link">Register for an account</a>
      </div>
    </form>
  </div>
</div>
</template>

<style>

.rcda-form-item {
  padding-top: 10px;
  padding-bottom: 10px;
}

.login-background {  
  background-color: #6D6E70;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.login-modal {
  background-color: white;
  max-width: 470px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
  max-height: 90%;

  z-index: 10000;
  width: 600px;
  background-color: white;
  padding-top: 32px;
  padding-left: 39px;
  padding-right: 39px;
  padding-bottom: 40px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, .16) 
}

.login-header {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 30px;
}

.login-errors {
    font-size: 14px;
    padding-top: 22px;
    padding-bottom: 21px;
    padding-left: 24px;
    padding-right: 24px;
    background-color: rgb(65,99,155, .2);
    color: #41639B;
    border-radius: 4px;
    margin-bottom: 10px;
}

.login-button {  
    background-color: #C22A26;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    border: none;
    padding-top: 7px;
    padding-bottom: 8px;
    padding-left: 26px;
    padding-right: 26px;
    border-radius: 1000px;
}

.login-button:hover {  
  cursor: pointer;
}

.login-forgot-password-link {
  display: block;
  text-align: right;
  font-size: 14px;
  color: #007CAF;
  text-decoration: none;
  padding-top: 5px;
  padding-bottom: 5px;
}

.login-ifrc-auth-info {
  margin-top: 60px;
}

.login-ifrc-auth-info-logo {
  float: left;
  width: 45px;
  height: 45px;
  margin-left: 14px;
  color: white;
}

.login-register-link {
  margin-top: 5px;
  display: block;  
  font-size: 14px;
  color: #007CAF;
  text-decoration: none;
}
</style>
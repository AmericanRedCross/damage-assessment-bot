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
  private badCredentialsLoginError = false;
  private unknownLoginError = false;
  private isProcessing = false;

  get missingRequiredFields() {
    return !this.username || !this.password;
  }

  get hasErrorMessages() {
    return this.attemptedLogin && this.missingRequiredFields || this.badCredentialsLoginError || this.unknownLoginError;
  }

  public async login() {
    this.attemptedLogin = false;
    this.badCredentialsLoginError = false;
    this.unknownLoginError = false;
    this.isProcessing = true;

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
    catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.badCredentialsLoginError = true;
      }
      else {        
        this.unknownLoginError = true;
      }
    }
    finally {      
      this.attemptedLogin = true;
      this.isProcessing = false;
    }
  }
}
</script>

<template>
<div class="login-background">
  <div class="login-panel">
    <h2 class="login-header">{{localizer.common.loginHeader}}</h2>
    <form @submit.prevent="login()" :disabled="isProcessing">  
      <div v-if="hasErrorMessages" class="login-errors">
        <div v-if="missingRequiredFields">{{localizer.common.loginFieldsMissingError}}</div>
        <div v-if="badCredentialsLoginError">{{localizer.common.loginCredentialsInvalidError}}</div>
        <div v-if="unknownLoginError">{{localizer.common.loginUnknownError}}</div>
      </div>
      <div class="rcda-form-item">
        <label class="rcda-input-label">{{localizer.common.loginUsernameLabel}}</label>
        <input type="text" v-model="username" class="rcda-input" />
      </div>
      <div class="rcda-form-item">
        <label class="rcda-input-label">{{localizer.common.loginPasswordLabel}}</label>
        <input type="password" v-model="password" class="rcda-input"/>
      </div>
      <div class="login-forgot-password-link">
        <a href="https://go.ifrc.org/recover-account">{{localizer.common.loginPasswordRecoveryLink}}</a>
      </div>
      <button type="submit" class="login-button">{{localizer.common.loginSubmitButton}}</button>
      <div class="login-ifrc-auth-info">
        <div class="login-ifrc-auth-info-logo"></div>
        <div>
          <span>{{localizer.common.loginProviderDescription}}</span>
          <a href="https://go.ifrc.org/register" class="login-register-link">{{localizer.common.loginRegistrationLink}}</a>
        </div>
      </div>
    </form>
  </div>
</div>
</template>

<style lang="scss">
@import "~styles/responsive";
@import "~styles/colors";

.rcda-form-item {
  padding-top: 10px;
  padding-bottom: 10px;
}

.login-background {  
  background-color: $rcda-dark;
  min-height: 100%;
  
  @include mobile {
    background-color: $rcda-light;
  }

  @include desktop {    
    display: flex;
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .login-panel {

    $login-panel-side-padding: 39px;

    background-color: $rcda-light;
    padding-top: 26px;
    padding-left: $login-panel-side-padding;
    padding-right: $login-panel-side-padding;
    padding-bottom: 40px;

    @include mobile {
      /* none needed */
    }

    @include desktop {
      max-width: 470px;
      margin-left: auto;
      margin-right: auto;
      border-radius: 20px;
      width: 600px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, .16);
      margin: auto;
    }

    .login-header {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      padding-top: 2px;
      padding-bottom: 20px;
      border-bottom: #D7D7D8 1px solid;
      margin-right: -$login-panel-side-padding;
      margin-left: -$login-panel-side-padding;
      margin-bottom: 20px;
      overflow: hidden;
    }
  }
}

.login-errors {
    font-size: 14px;
    padding-top: 22px;
    padding-bottom: 21px;
    padding-left: 24px;
    padding-right: 24px;
    background-color: rgba(65,99,155, .2);
    color: #41639B;
    border-radius: 4px;
    margin-bottom: 10px;
}

.login-button {  
    background-color: #C22A26;
    font-size: 16px;
    font-weight: bold;
    color: $rcda-light;
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
  color: $rcda-info;
  text-decoration: none;
  padding-top: 5px;
  padding-bottom: 5px;
}

.login-ifrc-auth-info {
  margin-top: 60px;
  display: flex;
  align-items: center;
}

.login-ifrc-auth-info-logo {
  background-image: url('/dist/images/ifrc-go-logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  float: left;
  width: 45px;
  height: 45px;
  margin-right: 14px;
  color: $rcda-light;
}

.login-register-link {
  margin-top: 5px;
  display: block;  
  font-size: 14px;
  color: $rcda-info;
  text-decoration: none;
}
</style>
<template>
    <div>
      <template v-if="!confirmed">
        <h1>Register Chat Channel</h1>
        <form>
          <label>
            Registration Token:
            <input type="text" v-model="registrationToken"/>
          </label>
          <p v-if="attemptedLogin && !isValid">Registration token is empty</p>
          <p>{{registrationToken}}</p>
          <button @click="submit">Submit</button>
        </form>
      </template>
      <template v-else> 
        <h1>Registration confirmed!</h1>
        <p>Thanks for registering! You may now return to your chat conversation.</p>
      </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import ChatService from "@/services/ChatService";

@Component
export default class ChatRegistrationPage extends Vue {

  @Inject()
  private chatService!: ChatService;

  public registrationToken = "";
  public attemptedLogin = false;
  public confirmed = false;

  get isValid() {
    return !!this.registrationToken;
  }

  public async submit() {
    this.attemptedLogin = true;
    if (this.isValid) {
      await this.chatService.registerChannel(this.registrationToken);
      this.confirmed = true;
    }
  }
}
</script>
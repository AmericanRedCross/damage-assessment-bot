<script lang="ts">
import Vue from "vue";
import { renderWebChat, createStyleSet } from "botframework-webchat/lib";
import { Component, Inject, Watch } from "vue-property-decorator";
import ChatService from "@/services/ChatService";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

@Component
export default class WebChatPage extends Vue {

  @Inject()
  private chatService!: ChatService;

  // hooks
  async mounted() {
    // TODO need to clean this up on destroy?
    let chatConnection = await this.chatService.getChatConnection(false);
    
    const styleSet = createStyleSet({
      bubbleBackground: 'rgba(215, 215, 216, 1)',
      bubbleTextColor: 'Black',
      bubbleFromUserBackground: 'rgba(0, 0, 0, 1)',
      bubbleFromUserTextColor: "White"
    });
    
    let webchat = renderWebChat({ 
      directLine: chatConnection,
      styleSet: styleSet,
    }, this.$refs.webChatRoot);

    let self = this;

    // chatConnection.activity$.filter(x => x.type === "message").subscribe(x => {
    //   console.log("message event");
    // });

    // TODO use a chat service to cache the last used language
    await self.chatService.setChatLanguage(<RcdaLanguages>"en");

    // TODO: add localized props to all vue components
    (<any>self).rcdaLocalizerEvents.$on("set-language", async (language: RcdaLanguages) => {
      await self.chatService.setChatLanguage(language);
    });
  }
}
</script>

<template>
<div class="webchat-main-panel">
  <div v-once ref="webChatRoot" class="webchat-conversation-panel" />
</div>
</template>

<style>

.webchat-main-panel {
  background-color: #6D6E70;
}

.webchat-conversation-panel {
  width: 530px;
  background-color: white;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  vertical-align: bottom;
}

.webchat-conversation-panel > div {
  height: 100%;
}

</style>
<script lang="ts">
import Vue from "vue";
import { renderWebChat, createStyleSet } from "botframework-webchat/lib/index-es5";
import { Component, Inject, Watch } from "vue-property-decorator";
import ChatService from "@/services/ChatService";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import { RcdaLanguages } from "@common/system/RcdaLanguages";
import RcdaBaseComponent from "@/components/RcdaBaseComponent";
import LanguageService from "@/services/LanguageService";

@Component
export default class WebChatPage extends RcdaBaseComponent {

  @Inject()
  private chatService!: ChatService;
  
  @Inject()
  private languageService!: LanguageService;

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

    // TODO use a chat service to cache the last used language
    await self.chatService.setChatLanguage(this.languageService.userLanguage); 

    self.rcdaLocalizerEvents.$on("set-language", async (language: RcdaLanguages) => {
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

<style lang="scss">
@import "~styles/responsive";

.webchat-main-panel {
  background-color: #6D6E70;
  height: 100%;
}

.webchat-conversation-panel {
  max-width: 530px;
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
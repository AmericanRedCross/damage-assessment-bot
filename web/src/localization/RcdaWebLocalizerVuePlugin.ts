import { PluginObject, VueConstructor } from 'vue';
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

const localizerPlugin: PluginObject<null> = {
    install(vue: VueConstructor) {
        vue.mixin({
            data() {
                return { localizer: new RcdaWebLocalizer(RcdaLanguages.English) };
            },
            mounted() {
                let localizerEvents = (<any>this).rcdaLocalizerEvents;
                if (localizerEvents) {
                    localizerEvents.$on("set-language", (language: RcdaLanguages) => {
                        (<any>this).localizer = new RcdaWebLocalizer(language);
                    });
                }
            },
            inject: [ "rcdaLocalizerEvents" ]
        });
    }
};

export default localizerPlugin;
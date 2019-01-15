import { PluginObject, VueConstructor } from 'vue';
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import { RcdaLanguages } from "@common/system/RcdaLanguages";
import RcdaBaseComponent from '@/components/RcdaBaseComponent';

const localizerPlugin: PluginObject<null> = {
    install(vue: VueConstructor) {
        vue.mixin({
            data() {
                return { localizer: new RcdaWebLocalizer((<RcdaBaseComponent>this).rcdaLocalizerEvents.language || RcdaLanguages.English) };
            },
            mounted() {
                let localizerEvents = (<RcdaBaseComponent>this).rcdaLocalizerEvents;
                if (localizerEvents) {
                    localizerEvents.$on("set-language", (language: RcdaLanguages) => {
                        (<RcdaBaseComponent>this).localizer = new RcdaWebLocalizer(language);
                    });
                }
            },
            inject: [ "rcdaLocalizerEvents" ]
        });
    }
};

export default localizerPlugin;
import Vue from "vue";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

export default abstract class RcdaBaseComponent extends Vue {
    public localizer!: RcdaWebLocalizer;
    public rcdaLocalizerEvents!: Vue&{ language: RcdaLanguages }
}
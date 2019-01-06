import Vue from "vue";
import RcdaWebLocalizer from "@/localization/RcdaWebLocalizer";

export default abstract class RcdaBaseComponent extends Vue {
    public localizer!: RcdaWebLocalizer;
}
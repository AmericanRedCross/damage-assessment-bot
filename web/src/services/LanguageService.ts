import RcdaStorageClient from "@/services/utils/RcdaStorageClient";
import { RcdaLanguages } from "@common/system/RcdaLanguages";

export default class LanguageService {

    constructor(private storageClient: RcdaStorageClient) {}

    get userLanguage(): RcdaLanguages {
        return this.storageClient.language || RcdaLanguages.English;
    }
    set userLanguage(language: RcdaLanguages) {
        this.storageClient.language = language;
    }
}
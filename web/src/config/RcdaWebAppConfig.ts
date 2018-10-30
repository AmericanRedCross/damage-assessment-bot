export default class RcdaWebAppConfig {

    constructor(definition: RcdaWebAppConfig) {
        Object.assign(this, definition);
    }

    rcdaApiHost!: string
}

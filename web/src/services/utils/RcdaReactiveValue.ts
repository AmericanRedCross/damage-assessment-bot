import Vue from "vue";

export default class RcdaReactiveValue<TValue> {

    constructor(initialValue: TValue) {
        this._value = initialValue;
    }

    private eventManager = new Vue();

    private _value: TValue;

    set value(newValue: TValue) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.eventManager.$emit("value", newValue);
        }
    }

    get value() {
        return this._value;
    }

    subscribe(callback: (newValue: TValue) => void) {
        this.eventManager.$on("value", callback);
    }
}
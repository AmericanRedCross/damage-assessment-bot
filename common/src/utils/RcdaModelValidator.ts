import { enumContainsValue } from "@common/utils/enumHelpers";
import { getValueAtPath, setValueAtPath, pathHelper } from "@common/utils/objectHelpers";

export default class RcdaModelValidator<TModel> {

    constructor(model: TModel, options = { mutateModel: false }) {
        if (options.mutateModel) {
            this.model = model;
        }
        else {
            this.model = JSON.parse(JSON.stringify(model));
        }
    }

    private model: TModel;
    private errors!: RcdaFieldValidationErrors;

    path<T0 extends keyof TModel>(t0: T0): RcdaModelPathValidator<TModel>
    path<T0 extends keyof TModel, T1 extends keyof TModel[T0]>(t0: T0, t1: T1): RcdaModelPathValidator<TModel>
    path<T0 extends keyof TModel, T1 extends keyof TModel[T0], T2 extends keyof TModel[T0][T1]>(t0: T0, t1: T1, t2: T2): RcdaModelPathValidator<TModel>
    path<T0 extends keyof TModel, T1 extends keyof TModel[T0], T2 extends keyof TModel[T0][T1], T3 extends keyof TModel[T0][T1][T2]>(t0: T0, t1: T1, t2: T2, t3: T3): RcdaModelPathValidator<TModel>
    path(...props: any[]): RcdaModelPathValidator<TModel> {
        return new RcdaModelPathValidator(this.model, props, this);
    }

    addError(errorType: RcdaFieldValidationErrorType, path: any[]) {
        if (!this.errors) {
            this.errors = {};
        }
        let pathId = path.join(":");
        if (!this.errors[pathId]) {
            this.errors[pathId] = [];
        }
        this.errors[pathId].push(errorType);
    }

    getResult(): RcdaModelValidationResult<TModel> {
        let hasErrors = !!this.errors;
        return {
            hasErrors: hasErrors,
            errors: this.errors,
            validModel: hasErrors ? this.model : null
        };
    }
}

class RcdaModelPathValidator<TModel> {

    constructor(private model: TModel, private path: string[], private validator: RcdaModelValidator<TModel>) {}
    
    private isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    private isWhitespaceString(value: any): boolean {
        return typeof value === "string" && RegExp("^\\s*$").test(value);
    }

    public mustBeNumber(): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists) {
            return this;
        }
        if ((!value && value !== 0) || this.isWhitespaceString(value)) {
            setValueAtPath(this.model, this.path, null);
            return this;
        }
        value = Number(value);
        if (isNaN(value)) {
            this.validator.addError(RcdaFieldValidationErrorType.MustBeNumber, this.path)
        }
        else {
            setValueAtPath(this.model, this.path, value);
        }
        return this;
    }

    public mustBeEmpty(): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists) {
            return this;
        }
        if (!(value === null || value === undefined)) {
            this.validator.addError(RcdaFieldValidationErrorType.MustBeEmpty, this.path)
        }
        return this;
    }
    
    public mustNotBeEmpty(): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists) {
            return this;
        }
        if (this.isNullOrUndefined(value) || this.isWhitespaceString(value) || (typeof value === "number" && isNaN(value))) {
            this.validator.addError(RcdaFieldValidationErrorType.MustNotBeEmpty, this.path)
        }
        return this;
    }

    public mustBeArray(): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists) {
            return this;
        }
        if (value === null || value === undefined) {
            setValueAtPath(this.model, this.path, []);
            return this;
        }
        if (!Array.isArray(value)) {
            this.validator.addError(RcdaFieldValidationErrorType.MustBeNumber, this.path)
        }
        return this;
    }

    public mustBeEnum(enumType: any): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists || this.isNullOrUndefined(value)) {
            return this;
        }
        if (!enumContainsValue(enumType, value, true)) {
            this.validator.addError(RcdaFieldValidationErrorType.MustBeEnum, this.path);
        }
        return this;
    }

    public mustBeObject(): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists || this.isNullOrUndefined(value)) {
            return this;
        }

        if (!value || typeof value !== "object" || Array.isArray(value)) {
            this.validator.addError(RcdaFieldValidationErrorType.MustBeObject, this.path);
        }
        return this;
    }

    public mustBeDate(): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists || this.isNullOrUndefined(value)) {
            return this;
        }
        let dateValue = new Date(value);
        if (isNaN(dateValue.valueOf())) {
            this.validator.addError(RcdaFieldValidationErrorType.MustBeDate, this.path);
        }
        else {
            setValueAtPath(this.model, this.path, dateValue);
        }
        return this;
    }

    public mustNotExceedMaxLength(maxLength: number): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists || this.isNullOrUndefined(value) || !value.hasOwnProperty("length")) {
            return this;
        }

        if (value.length > maxLength) {
            this.validator.addError(RcdaFieldValidationErrorType.MustNotExceedMaxLength, this.path);
        }
        return this;
    }

    public mustHaveValidProperties(validProps: string[]): RcdaModelPathValidator<TModel> {
        let { value, pathExists } = getValueAtPath(this.model, this.path);
        if (!pathExists || this.isNullOrUndefined(value)) {
            return this;
        }
        if (Object.getOwnPropertyNames(value).filter(prop => !validProps.includes(prop)).length > 0) {
            this.validator.addError(RcdaFieldValidationErrorType.MustNotExceedMaxLength, this.path);
        }
        return this;
    }
}

export enum RcdaFieldValidationErrorType {
    MustNotBeEmpty = "MustNotBeEmpty",
    MustBeEmpty = "MustBeEmpty",
    MustBeNumber = "MustBeNumber",
    MustBeEnum = "MustBeEnum",
    MustBeArray = "MustBeArray",
    MustBeObject = "MustBeObject",
    MustBeDate = "MustBeDate",
    MustNotExceedMaxLength = "MustNotExceedMaxLength",
    MustHaveValidProperties = "MustHaveValidProperties"
}

export interface RcdaFieldValidationErrors {
    [path: string]: RcdaFieldValidationErrorType[];
}

export interface RcdaModelValidationResult<TModel, THasErrors extends boolean = boolean> {
    hasErrors: THasErrors,
    errors: THasErrors extends true ? RcdaFieldValidationErrors : null,
    validModel: THasErrors extends true ? null : TModel
}
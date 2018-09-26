
// intended to be used in cosmos queries. ensures that property names referenced
// in the query exist on the specified model type
export default function<TModel>(property: keyof TModel): keyof TModel {
    return property;
}
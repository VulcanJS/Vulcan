import SimpleSchema from "simpl-schema";

type ComponentReference = string | React.Component

type SimpleSchemaField = {
    // TODO complete with simpleschema allowed props
    type: string | SimpleSchema // the type to resolve the field with
}


type FormField = {
    hidden?: boolean, // hidden?: true means the field is never shown in a form no matter what
    mustComplete?: boolean, // mustComplete?: true means the field is required to have a complete profile
    form?: Object, // extra form properties
    inputProperties?: Object, // extra form properties
    input?: ComponentReference, // SmartForm control (string or React component)
    control?: ComponentReference, // SmartForm control (string or React component) (legacy)
    order?: number, // position in the form
    group?: number, // form fieldset group
    description?: string, // description/help
    beforeComponent?: ComponentReference, // before form component
    afterComponent?: ComponentReference, // after form component
    placeholder?: string, // form field placeholder value
    options: Array<{ label: string, value: any }>, // form options
    query: string, // field-specific data loading query
}

type GraphQLField = {
    typeName?: string // the type to resolve the field with
}

type i18nField = {
    intl?: boolean, // set to `true` to make a field international
    isIntlData?: boolean, // marker for the actual schema fields that hold intl strings
}

type ResolvedField = {
    fieldName?: string, // fieldName
    arguments?: string, // resolver input arguments
    type: string, // the graphQL type
    resolver: function, // TODO
    addOriginalField?: boolean
}

type ResolverField = {
    resolveAs?: ResolvedField, // field-level resolver
    searchable?: boolean, // whether a field is searchable
    selectable?: boolean, // field can be used as part of a selector when querying for data
    unique?: boolean, // field can be used as part of a selectorUnique when querying for data
    orderable?: boolean, // field can be used to order results when querying for data
}

type OnCreateFunc = ({ newDocument: any, currentUser: User }) => any
type OnUpdateFunc = ({ data: any, document: any, currentUser: User }) => any
type OnDeleteFunc = ({ document: any, currentUser: User }) => any

type MutationField = {
    onCreate?: OnCreateFunc, // field insert callback
    onInsert?: function, // field insert callback (OpenCRUD backwards compatibility)
    onUpdate?: OnUpdateFunc, // field edit callback
    onEdit?: function, // field edit callback (OpenCRUD backwards compatibility)
    onDelete?: OnDeleteFunc, // field remove callback
    onRemove?: Function, // field remove callback (OpenCRUD backwards compatibility)
}

type User = any // TODO
ReadPermissionFunc = (currentUser: User) => boolean
MutatePermissionFunc = (currentUser: User, document: object) => boolean
type PermissionField = {
    canRead?: Array<string> | ReadPermissionFunc, // who can view the field
    viewableBy?: Array<string> | ReadPermissionFunc, // who can view the field (OpenCRUD backwards compatibility)
    canCreate?: Array<string> | MutatePermissionFunc, // who can insert the field
    insertableBy?: Array<string> | MutatePermissionFunc, // who can insert the field (OpenCRUD backwards compatibility)
    canUpdate?: Array<string> | MutatePermissionFunc, // who can edit the field
    editableBy?: Array<string> | MutatePermissionFunc, // who can edit the field (OpenCRUD backwards compatibility)
}

type DataBaseField = {
    // none yet (eg indexing, onCreate run at the db level?)
}

type DataTableField = {
    // none yet
    // could include "column" => like "input" but for datatable
}
type CardField = {
    // none yet
}

type VulcanField = SimpleSchemaField
    & GraphQlField
    & ResolverField
    & MutationField
    & PermissionField
    & FormField
    & DataBaseField
    & DataTableField
    & CardField


type VulcanSchema = {
    [key: string]: VulcanField
}
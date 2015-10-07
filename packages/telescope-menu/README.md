# Menu Component

This is a component for generating flexible, nestable menus. It can generates nested menus from a flat list with node `id`s and `parentId`s. 

### Usage

Just include the `menuComponent` template while passing the necessary arguments:

```
{{> menuComponent menuItems=menuItems}}
```

### Arguments

##### `menuItems` (Array) [required]

An array containing the menu's contents (see below).

##### `menuName` (String)

The name of the menu. Used to set a `*name*-menu` CSS class on the menu. 

##### `menuLabel` (String)

The menu title label.

##### `menuLabelTemplate` (String)

If provided, will replace the menu label with a custom template.

##### `menuClass` (String)

An optional CSS class given to the menu

##### `itemTemplate` (String)

A custom template used to display individual menu items (defaults to "defaultMenuItem")

### Menu Items Properties

Menu items can have the following properties:

##### `label` (String/Function)

The menu item's label, or a function that returns a label. 

##### `route` (String/Function)

Either the name of a route to which the menu item should point, or a function that returns a route.

If a route is provided, the class `item-active` will automatically be added to the menu item when its route is the currently active one. 

##### `data` (Object)

The data context for the item. 

##### `itemClass` (String)

The menu item's CSS class. 

##### `template` (String)

An optional custom template. Overrides both the default template and the `itemTemplate` menu-level option. 

##### `isHidden` (Function)

If this function returns `true`, the menu item will not be shown. 

### Nested Menu Items Properties

Additionally, menu items take a few additional properties to generate nested menus. 

##### `_id` (String)

A unique id used for arranging nodes in nested menus. 

##### `parentId` (String)

The parent node's id. 

##### `isExpanded` (Boolean)

Whether the item's sub-menu should be expanded

### The Menu Item Template

The menu item template is called with the following data context:

##### `menu` (Object)

A reference pointing back to the menu object.

#### `level` (Number)

The current nesting level.

#### `item` (Object)

The current item to display. 
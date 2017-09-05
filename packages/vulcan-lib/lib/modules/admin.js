export let AdminColumns = [];

export const addAdminColumn = columnOrColumns => {
  if (Array.isArray(columnOrColumns)) {
    AdminColumns = AdminColumns.concat(columnOrColumns);
  } else {
    AdminColumns.push(columnOrColumns);
  }
}

export const removeAdminColumn = columnOrColumns => {
  AdminColumns.pop(columnOrColumns);
}

// mock apollo server errors
export const throwError = (error) => { if (error) throw new Error(error.id, error); };
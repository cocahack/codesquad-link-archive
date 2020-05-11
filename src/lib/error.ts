export const makeError = (message: string, name?: string) => {
  const err = new Error(message);
  if (name) {
    err.name = name;
  }
  return err;
};

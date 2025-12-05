// Source - https://stackoverflow.com/a
// Posted by Arun Prasad E S, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-05, License - CC BY-SA 4.0
export const replacerFunc = () => {
  const visited = new WeakSet();
  return (_: string, value: object) => {
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};

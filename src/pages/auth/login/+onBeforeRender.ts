export const onBeforeRender = async () => {
  return {
    pageContext: {
      loginAccessError: false,
    },
  };
};

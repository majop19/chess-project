import { PageContextServer } from "vike/types";

export const onBeforeRender = (pageContext: PageContextServer) => {
  // @ts-expect-error -- fix type
  console.log("before render", pageContext.user);
  return {
    // send the pageContext.user on the client when the user login to refresh.
    pageContext: {
      // @ts-expect-error -- fix type
      user: pageContext.user,
    },
  };
};

export const getAllQueryParameter = (link = "") => {
  let query_params = {};
  if (link.indexOf("?") >= 0) {
    link
      .split("?")[1]
      .split("&")
      .map((el) => {
        let x = {};
        let key = el.split("=")[0];
        let value = el.split("=")[1];
        x[key] = value;
        return x;
      })
      .forEach((el) => {
        query_params = { ...query_params, ...el };
      });
    return query_params;
  }
  return {};
};

export const getLastParam = (link="") => {
  return link.split('/').pop()
}

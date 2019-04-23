export default {
  postLogin(data) {
    return this.http("baseUrl", "post", "/api/login", data).then(res => {
      return res;
    });
  },
  getHealthReport(appDevice, appVersion) {
    return this.http(
      "Bingo",
      "get",
      `/api/v1/health/analyses?app_device=${appDevice}&app_version=${appVersion}`
    ).then(res => {
      return res;
    });
  }
};

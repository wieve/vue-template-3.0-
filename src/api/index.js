import httpServer from "@/tools/http-server";
import login from "./login";
import config from "config";

const actions = {
  http(pName, method, url, data, headers) {
    const token = "yrcNowfXmXG1A2c96v9ZYpPphtEd5Ddp";
    return httpServer(
      { method: method, url: url },
      data,
      pName ? config[pName] : pName,
      token,
      headers
    ).then(res => {
      return res;
    });
  }
};

export default Object.assign(actions, login);

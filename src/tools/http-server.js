import axios from "axios";
import { Loading, Message } from "element-ui";
// import errorReport from "airbrake";

let pending = {};
let loadingInstance;
axios.interceptors.request.use(
  config => {
    let t;
    t = setTimeout(() => {
      loadingInstance = Loading.service({
        fullscreen: true,
        text: "加载中......"
      });
    }, 500);
    pending[t] = 1;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    return axiosRetry(err);
  }
);

// axios response 错误拦截器
const interceptorsResponseErr = err => {
  Message.close();
  if (err && err.response.status) {
    switch (err.response.status) {
      case 400:
        return err.response;
      default:
        break;
    }
  }
  return Promise.reject(err);
};

// 清除setTimeout
const clearAllTimeouts = () => {
  for (let t in pending) {
    if (pending.hasOwnProperty(t)) {
      clearTimeout(t);
      delete pending[t];
    }
  }
};

// axios 失败重试
const axiosRetry = err => {
  let { config, response } = err;

  // retry配置开启检测
  if (!config || !config.retry) {
    return interceptorsResponseErr(err);
  }

  // http code 范围检测
  if (response && response.status) {
    let isInRange = false;
    const retryStatusCodes = config.retryStatusCodes;
    for (const [min, max] of retryStatusCodes) {
      const status = response.status;
      if (status >= min && status <= max) {
        isInRange = true;
        break;
      }
    }
    if (!isInRange) {
      return interceptorsResponseErr(err);
    }
  }

  config.__retryCount = config.__retryCount || 0;

  // retry次数检测
  if (config.__retryCount >= config.retry) {
    return interceptorsResponseErr(err);
  }

  config.__retryCount += 1;

  let backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, config.retryDelay || 1);
  });

  return backoff.then(function() {
    return axiosRequest(config);
  });
};

// 错误报告参数处理
const errorReportParams = err => {
  const { config = {}, response = {} } = err;

  return {
    url: config.url,
    method: config.method,
    params: config.params,
    status: response.status
  };
};

// 正确处理
const successState = () => {};

// 错误处理
const errorState = err => {
  loadingInstance.close();
  if (err && err.response) {
    switch (err.response.status) {
      case 401:
        Message.warning("无效的token");
        break;
      case 404:
        Message.error("报告，找不到资源");
        break;
      case 500:
        Message.error("哎呦，服务器出故障了≧﹏≦");
        break;
      default:
        Message.error("哎呦，服务器出故障了≧﹏≦");
    }
  } else {
    Message.error("哎呦，服务器出故障了≧﹏≦");
  }
};

// axios request主函数
const axiosRequest = opts => {
  console.log("opt", opts);
  return axios(opts)
    .then(res => {
      const { data } = res;
      clearAllTimeouts();
      successState(data);
      return data;
    })
    .catch(err => {
      clearAllTimeouts();
      errorState(err);
      throw new Error("httpServerError");
    });
};

const httpServer = (opts, data, baseURL, token, headers) => {
  let Public = {
    // 公共参数
  };

  let httpDefaultOpts = {
    // http默认配置
    method: opts.method,
    url: opts.url,
    timeout: 10000,
    params: { ...Public, ...data },
    data: { ...Public, ...data },
    headers: {
      token: token,
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
      "Content-Type": "application/json; charset=UTF-8"
    },
    retry: 3,
    retryStatusCodes: [[100, 199], [429, 429], [500, 599]],
    retryDelay: 500
  };

  if (opts.method === "get") {
    delete httpDefaultOpts.data;
  } else {
    delete httpDefaultOpts.params;
  }

  if (baseURL) {
    httpDefaultOpts.baseURL = baseURL;
  }

  if (headers) {
    httpDefaultOpts.headers = headers;
  }
  return axiosRequest(httpDefaultOpts);
};

export default httpServer;

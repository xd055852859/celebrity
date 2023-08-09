import axios from "axios";
import { ElMessage } from "element-plus";
import md5 from "md5";
// import i18n from "@/language/i18n";
import router from "@/router";
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const API_URL = import.meta.env.VITE_API_URL;
const File_URL = import.meta.env.VITE_File_URL;
let token = localStorage.getItem("token") || "";
let message = true;
//防止重复请求
const getRequestKey = (config) => {
  if (!config) {
    // 如果没有获取到请求的相关配置信息，根据时间戳生成
    return md5(+new Date());
  }
  const data =
    typeof config.data === "string" ? config.data : JSON.stringify(config.data);
  return md5(config.url + "&" + config.method + "&" + data);
};
// 存储key值
const pending = {};
// 检查key值
const checkPending = (key) => !!pending[key];
// 删除key值
const removePending = (key) => {
  delete pending[key];
};

const CancelToken = axios.CancelToken;

// 请求拦截器
axios.interceptors.request.use((config) => {
  // 计算当前请求key值
  const key = getRequestKey(config);
  // if (checkPending(key)) {
  //   // 重复请求则取消当前请求
  //   const source = CancelToken.source();
  //   config.cancelToken = source.token;
  //   source.cancel("重复请求");
  // } else {
  //   // 加入请求字典
  //   pending[key] = true;
  // }
  console.log(config);
  return config;
});

axios.interceptors.response.use(
  (response: any) => {
    if (response.data.status === 701 && message) {
      message = false;
      ElMessage({
        message: "请登录",
        type: "error",
        duration: 1000,
      });
      localStorage.removeItem("token");
      router.replace("/login");
      token = "";
      return;
    } else if (response.data.status === 201) {
      ElMessage({
        message: response.data.msg,
        type: "error",
        duration: 1000,
      });
      return;
    }
    // 请求完成，删除请求中状态
    const key = getRequestKey(response.config);
    removePending(key);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const request = {
  get(path: string, params?: any, otherUrl?: boolean, otherPath?: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "get",
          url: otherPath
            ? otherPath
            : otherUrl
            ? AUTH_URL + path
            : API_URL + path,
          params: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  post(path: string, params?: object, otherUrl?: boolean, otherPath?: string) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "post",
          url: otherPath
            ? otherPath
            : otherUrl
            ? AUTH_URL + path
            : API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        console.log(response.data);
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  patch(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "patch",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  delete(path: string, params?: object) {
    return new Promise(async function (resolve, reject) {
      try {
        const response = await axios({
          method: "delete",
          url: API_URL + path,
          data: params,
          headers: {
            token: token,
          },
        });
        resolve(response.data);
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default {
  request,
  File_URL,
  setToken: (_token: string) => {
    localStorage.setItem("token", _token);
    token = _token;
  },
};

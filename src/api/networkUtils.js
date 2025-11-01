import axios from 'axios';
import CONFIG from '../globals/config';
const axiosInstance = axios.create({
  baseURL: CONFIG.base_url,
  headers: { 'lang': '2' }
});
const axiosInstance1 = axios.create({
  baseURL: CONFIG.base_url,
  headers: { 'lang': '2' }
});
const errrHandler = (e, URL, CONFIG, PAYLOAD = {}) => {
  // console.log(
  //   `REQUEST TO: ${URL} with PAYLOAD: ${JSON.stringify(PAYLOAD)} failed!`,
  // );
  // console.log(JSON.stringify(e?.response?.data));
  if (e.message === 'Network Error') {
    throw 'Network Error. Ensure you are connected to internet.';
  } else if (e.message === 'Server is not responding') {
    throw 'Server is not responding';
  } else {
    const { status, data } = e.response;
    console.warn(`API ERROR STATUS: ${status}\n`);
    // console.log({ data });
    const { Message } = data;
    if (status == 401) {
      throw {
        Message,
        status,
      };
    }
    if (typeof Message === 'string') {
      throw Message;
    } else {
      throw 'Something went wrong.';
    }
  }
};

const get = async (URL, config) => {
  // console.log(CONFIG.base_url+URL);
  try {
    let result = await axiosInstance.get(URL, config ? config : null, {
      timeout: 20000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data.Data;
  } catch (error) {
    // console.log(URL, error.message);
    errrHandler(error, URL);
  }
};
const get1 = async (URL, config) => {
  // console.log(CONFIG.base_url+URL);
  try {
    let result = await axiosInstance1.get(URL, config ? config : null, {
      timeout: 20000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data.Data;
  } catch (error) {
    // console.log(URL, error.message);
    errrHandler(error, URL);
  }
};
const post = async (URL, payload) => {
  // console.log({ URL, payload });
  try {
    // console.log('Payload from Utility :', payload);
    let result = await axiosInstance.post(URL, payload, {
      timeout: 20000,
      timeoutErrorMessage: 'Server is not responding',
    });
    let Message = result.data.Message;
    // console.log({ Message });
    return result.data.Data;
  } catch (error) {
    // console.log(URL, error, { payload });
    errrHandler(error, URL, payload);
  }
};

const postRegister = async (URL, payload) => {
  // console.log({ URL, payload });
  try {
    let result = await axiosInstance.post(URL, payload, {
      timeout: 20000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data.Data;
  } catch (error) {
    let response = error.response.data;
    if (response.Message === 'Error Founded') {
      throw response.Data;
      // throw JSON.stringify(response.Data);
    }
    // errrHandler(error, URL, payload);
    // console.log('Errorrrrr :', error.response.data);
    // console.log(URL, error, {payload});
  }
};

const put = async (URL, payload) => {
  // console.log({ URL, payload });
  try {
    let result = await axiosInstance.put(URL, payload, {
      timeout: 20000,
      timeoutErrorMessage: 'Server is not responding',
    });
    return result.data;
  } catch (error) {
    // console.log(URL, error, { payload });
  }
};

export { get, get1, post, put, postRegister };

import { notification } from "antd";

import codeMessage from "./codeMessage";

const successHandler = (response, enable = true) => {
  if (!response.data.result) {
    response = {
      ...response,
      status: 404,
      url: null,
      data: {
        success: false,
        result: null,
      },
    };
  }
  const { data } = response;
  if (data.success === false) {
    const message = data && data.message;
    const errorText = message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 4,
    });
    notification.error({
      message: `Request error ${status}`,
      description: errorText,
    });
  } else {
    const message = data && data.message;
    const successText = message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 2,
    });
    if(enable){
      notification.success({
        message: `Request success`,
        description: successText,
      });
    }
  }

  return data;
};

export default successHandler;

import { request } from "@/request";
import { Form, Input, Button, Checkbox } from 'antd';
import { API_BASE_URL } from "@/config/serverApiConfig";

const Demo = ({ ...props }) => {
  const { setReload } = props
  const onFinish = async (values) => {
    const { success, result, message } = await request.post(`${API_BASE_URL}client/register`, values);
    if (success) {
      setReload(true)
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="AddClient"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          {
            required: true,
            message: 'Please input your first name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          {
            required: true,
            message: 'Please input your last name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            pattern: new RegExp(/\S+@\S+\.\S+/),
            message:
              'Enter a valid email address!',
          },
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input
          placeholder="email"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
        hidden
      >
        <Button type="primary" htmlType="submit" id="AddClientbtn">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Demo;
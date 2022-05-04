import React from "react";

import { Form, Input, Button, Checkbox, Layout, Row, Col, Divider } from "antd";
import { UserOutlined, LockOutlined, BankOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';

import { registerProvider } from "@/redux/auth/actions";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/redux/auth/actions";
import { selectAuth } from "@/redux/auth/selectors";
const { Content, Footer } = Layout;

const RegisterPage = () => {
  // const [error, setError] = useState();

  // const { setAdminData } = useContext(AdminContext);
  // const history = useHistory();
  const { loading: isLoading } = useSelector(selectAuth);
  // function handleChange(e) {
  //   const { name, value } = e.target;
  //   setInputs((inputs) => ({ ...inputs, [name]: value }));
  // }
  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(registerProvider(values));
  };
  return (
    <>
      <Layout className="layout">
        <Row>
          <Col span={12} offset={6}>
            <Content
              style={{
                padding: "150px 0 180px",
                maxWidth: "360px",
                margin: "0 auto",
              }}
            >
              <h1>SignUp</h1>
              {/* {error && (
                <ErrorNotice
                  message={error}
                  clearError={() => setError(undefined)}
                />
              )} */}
              <Divider />
              <div className="site-layout-content">
                {" "}
                <Form
                  labelCol={{ span: 6 }}
                  name="normal_register"
                  className="login-form"
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="name"
                    label="User Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your name!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="username"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="123456"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="company"
                    label="Company"
                    rules={[
                      {
                        required: true,
                        message: "Please input your company!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<BankOutlined className="site-form-item-icon" />}
                      placeholder="company"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined className="site-form-item-icon" />}
                      placeholder="phone number"
                      autoComplete="off"
                    />
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
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      placeholder="email"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={isLoading}
                    >
                      Sign Up
                    </Button>
                    <a href="/login" className="text-primary ms-1">Log In</a>
                  </Form.Item>
                </Form>
              </div>
            </Content>
          </Col>
        </Row>

        <Footer style={{ textAlign: "center" }}>
          {/* Open Source CRM based on AntD & React ©2020 Created by Salah Eddine
          Lalami */}
        </Footer>
      </Layout>
    </>
  );
};

export default RegisterPage;

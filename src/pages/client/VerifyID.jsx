import React, { lazy, useState } from "react";
import { Space, Typography, Button, Checkbox, Layout, Row, Col, Divider } from "antd";
import { Steps, message } from 'antd';
import { ContainerOutlined, ScheduleOutlined, CarOutlined } from '@ant-design/icons';
import { request } from "@/request";
const VerifyDoc = lazy(() =>
  import(/*webpackChunkName:'VerifyDoc'*/ "@/pages/client/VerifyDoc")
);

const ConfirmInfo = lazy(() =>
  import(/*webpackChunkName:'ConfirmInfo'*/ "@/pages/client/ConfirmInfo")
);

const VerifyFace = lazy(() =>
  import(/*webpackChunkName:'VerifyFace'*/ "@/pages/client/VerifyFace")
);

const { Step } = Steps;

const { Content, Footer } = Layout;

const VerifyID = () => {
  const [current, setCurrent] = useState(0);
  const [type, setType] = useState('');
  const [isDone, setIsDone] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [isProgress, setIsProgress] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);

  const next = () => {
    setIsDone(false);
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const selectType = (type) => {
    setType(type);
    setIsDone(true)
  }

  const finish = async () => {
    let result = await request.post('/client/verify', { userInfo: userInfo })
    console.log(result)

    window.location.href = '/'
  };

  const selectTypeStep = () => {
    return (
      <Layout>
        <Typography style={{ fontSize: 24, padding: '30px 0', textAlign: 'center' }}>Select a document for verification</Typography>
        <Button icon={<ScheduleOutlined />} size={12} style={{ margin: 6 }} className={type == 'nation' ? 'active' : ''} onClick={() => { selectType('nation') }}>
          National ID Card
        </Button>
        <Button icon={<CarOutlined />} size={12} style={{ margin: 6 }} className={type == 'driving' ? 'active' : ''} onClick={() => { selectType('driving') }}>
          Driving License
        </Button>
        <Button icon={<ContainerOutlined />} size={12} style={{ margin: 6 }} className={type == 'passport' ? 'active' : ''} onClick={() => { selectType('passport') }}>
          Passport
        </Button>
      </Layout>
    )
  }

  const updateUserInfo = (val, isNext = false) => {
    setUserInfo(val)
    if (isNext) next();
  }

  const steps = [
    {
      title: '',
      content: selectTypeStep(),
    },
    {
      title: '',
      content: <VerifyDoc docType={type} setIsProgress={setIsProgress} setUserInfo={updateUserInfo} setFaceDescriptor={setFaceDescriptor} />,
    },
    {
      title: '',
      content: <ConfirmInfo userInfo={userInfo} setUserInfo={updateUserInfo} setIsDone={setIsDone} />,
    },
    {
      title: '',
      content: <VerifyFace setIsDone={setIsDone} setIsProgress={setIsProgress} faceDescriptor={faceDescriptor} />,
    },
  ];
  console.log(isDone, 'isDone')
  return (
    <>
      <Layout className="layout">
        <Row>
          <Col span={16} offset={4}>
            <Content
              style={{
                padding: "100px 0 50px",
                margin: "0 auto",
              }}
            >
              <h1>Login</h1>
              <Divider />
              <div className="site-layout-content">
                <Steps current={current}>
                  {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                  ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action pad20 float-right">
                  {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={prev} loading={isProgress}>
                      Previous
                    </Button>
                  )}
                  {isDone && current < steps.length - 1 && (
                    <Button type="primary" onClick={next} loading={isProgress}>
                      Next
                    </Button>
                  )}
                  {isDone && current === steps.length - 1 && (
                    <Button type="primary" onClick={finish} loading={isProgress}>
                      Done
                    </Button>
                  )}
                </div>
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

export default VerifyID;

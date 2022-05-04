import React, { useState, useRef, useEffect } from "react";
import { Card, Typography, Button, Form, Input, DatePicker, Divider } from "antd";
import { ContainerOutlined, ScheduleOutlined, CarOutlined } from '@ant-design/icons';
import moment from 'moment';

const ConfirmInfo = ({ ...props }) => {
  const { userInfo, setUserInfo, setIsDone } = props;
  console.log(userInfo)
  useEffect(() => {
    setIsDone(true);
  }, []);
  const onRequiredTypeChange = (temp, values) => {
    const { firstName, lastName, birthDate } = values;
    if (firstName && lastName && birthDate) {
      setIsDone(true);
      setUserInfo(values);
    }
    else {
      console.log('tests')
      setIsDone(false)
    }
  };

  console.log(userInfo)
  console.log(userInfo.birthDate)
  console.log(moment(userInfo.birthDate))

  return (
    <>
      <Typography style={{ padding: '30px 0', textAlign: 'center' }}>Confirm ID Infomation</Typography>
      <Form
        layout="vertical"
        initialValues={{ firstName: userInfo.firstName, lastName: userInfo.lastName }}
        onValuesChange={onRequiredTypeChange}
      >
        <Form.Item label="First Name" required name="firstName">
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item label="Last Name" required name="lastName">
          <Input placeholder="Last Name" />
        </Form.Item>
        <Form.Item label="DatePicker" name="birthDate">
          <DatePicker defaultValue={moment(userInfo.birthDate)} />
        </Form.Item>
      </Form>
    </>
  );
};

export default ConfirmInfo;

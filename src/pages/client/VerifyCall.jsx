import React, { useState, useRef, useEffect } from "react";
import { Button, Typography, Select, Layout, Row, Col, Calendar, Alert, TimePicker, message, List, Divider } from "antd";
import { ContainerOutlined, ScheduleOutlined, CarOutlined } from '@ant-design/icons';
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import moment from 'moment';

const format = 'HH:mm';

const ConfirmInfo = () => {
  const now = new Date();
  const [date, setDate] = useState(moment(now));
  const [selectedValue, setSelectedValue] = useState(moment(now).format('YYYY-MM-DD HH:mm'));
  const [selectedTime, setSelectedTime] = useState(moment(now));
  const [loading, setLoading] = React.useState(false);
  let reserveList = []
  const asyncList = () => {
    return request.list('client/reserve', { page: moment(date).format('YYYY-MM-DD') });
  };
  // const [reserveList, setReserveList] = useState([]);
  const onSelect = value => {
    setDate(value);
    setSelectedValue(`${value.format('YYYY-MM-DD')} ${selectedTime.format('HH:mm')}`);
  };

  const onPanelChange = value => {
    setDate(value)
  };

  const onSelectTime = value => {
    setSelectedTime(value)
    setSelectedValue(`${date.format('YYYY-MM-DD')} ${value.format('HH:mm')}`);
  }
  const Submit = async () => {
    if (moment(`${date.format('YYYY-MM-DD')} ${selectedTime.format('HH:mm')}`) <= moment(now)) {
      message.error('Reserve time is not available. please check repeat.')
      return;
    }
    setLoading(true)
    let result = await request.post('/client/reserve_call', { reserveTime: selectedValue })
    console.log(result)
    setLoading(false)
    if (result.success) {
      window.location.href = '/'
    }
  }
  const { result, isLoading, isSuccess } = useFetch(asyncList);
  if (isSuccess && result && result.reserveList)
    reserveList = result.reserveList
  return (
    <Layout style={{ padding: '50px 140px' }}>
      <Typography style={{ fontSize: 30, padding: '30px 0', textAlign: 'center' }}>Select available date and time for verification</Typography>
      <Alert
        message={`You selected: ${selectedValue && selectedValue}`}
      />
      <Row className="pad20">
        <Col span={12} offset={2}>
          <Calendar validRange={[moment(now).add(-1, 'days'), null]} fullscreen={false} value={date} onSelect={onSelect} onPanelChange={onPanelChange} mode="month" headerRender={({ value, type, onChange, onTypeChange }) => {
            const start = 0;
            const end = 12;
            const monthOptions = [];

            const current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i++) {
              current.month(i);
              months.push(localeData.monthsShort(current));
            }

            for (let index = start; index < end; index++) {
              monthOptions.push(
                <Select.Option className="month-item" key={`${index}`}>
                  {months[index]}
                </Select.Option>,
              );
            }
            const month = value.month();

            const year = value.year();
            const options = [];
            for (let i = year - 10; i < year + 10; i += 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>,
              );
            }
            return (
              <div style={{ padding: 8 }}>
                <Row align="end">
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      className="my-year-select"
                      onChange={newYear => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                      }}
                      value={String(year)}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={String(month)}
                      onChange={selectedMonth => {
                        const newValue = value.clone();
                        newValue.month(parseInt(selectedMonth, 10));
                        onChange(newValue);
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                </Row>
              </div>
            );
          }} />
        </Col>
        <Col span={8} offset={2}>
          <TimePicker value={selectedTime} onChange={onSelectTime} format={format} />
          <Divider orientation="left">Reserve List</Divider>
          <List
            size="small"
            bordered
            dataSource={reserveList}
            renderItem={item => (
              <List.Item>
                <Typography.Text mark>[{item.userId.firstName} {item.userId.lastName}]</Typography.Text>
                <br /> {moment(item.reserveTime).format('HH:mm')} ~ {moment(item.reserveTime).add(15, 'minutes').format('HH:mm')}
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row style={{ padding: 10 }} align="end">
        <Button type="primary" onClick={Submit} loading={loading}>Submit</Button>
      </Row>
    </Layout>
  );
};

export default ConfirmInfo;

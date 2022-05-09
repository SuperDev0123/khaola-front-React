import React, { useState, useRef, useEffect } from "react";
import { Tag, Table, Select, Layout, Row, Col, Calendar } from "antd";
import { ContainerOutlined, ScheduleOutlined, CarOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { DashboardLayout } from "@/layout";
import ReserveTable from "@/components/ReserveTable";
import moment from 'moment';

const ConfirmInfo = () => {
  const now = new Date();
  const [date, setDate] = useState(moment(now));
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const asyncList = () => {
    return request.list('admin/reserve', { page: moment(date).format('YYYY-MM-DD') });
  };
  // const [reserveList, setReserveList] = useState([]);
  const onSelect = value => {
    let tret = value.format('YYYY-MM-DD')
    console.log(tret)
    setDate(value);
    setReload(true)
  };

  const onPanelChange = value => {
    setDate(value)
  };

  const leadColumns = [
    {
      title: "User Name",
      dataIndex: "userId",
      render: (user) => {
        return `${user.firstName} ${user.lastName}`;
      },
    }, {
      title: "Start Time",
      dataIndex: "reserveTime",
    }, {
      title: "End Time",
      dataIndex: "reserveTime",
      render: (startTime) => {
        return moment(startTime).add(15, 'minutes').format('YYYY-MM-DD HH-mm');
      },
    }, {
      title: "Status",
      dataIndex: "userId",
      render: (user) => {
        let color = !user.isVerified ? "volcano" : "green";
        return <Tag color={color}>{user.isVerified ? 'Present' : 'Absent'}</Tag>;
      },
    },
  ];
  console.log(leadColumns)
  const { result, isLoading, isSuccess } = useFetch(asyncList, reload);
  console.log(result, isLoading, isSuccess)
  if (result && reload) setReload(false)
  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={24}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e" }}>
                Client List
              </h3>
            </div>
            <Layout>
              <Row className="pad10">
                <Col span={24} lg={8}>
                  <Calendar fullscreen={false} value={date} onSelect={onSelect} onPanelChange={onPanelChange} mode="month" headerRender={({ value, type, onChange, onTypeChange }) => {
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
                <Col span={24} lg={12} offset={2}>
                  <Table
                    columns={leadColumns}
                    rowKey={(item) => item._id}
                    dataSource={isSuccess && result}
                    pagination={false}
                    loading={isLoading}
                  />
                </Col>
              </Row>
            </Layout>
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default ConfirmInfo;

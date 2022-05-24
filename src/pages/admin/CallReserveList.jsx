import React, { useState, useRef, useEffect } from "react";
import { Tag, Table, Button, Pagination, Row, Col, Calendar } from "antd";
import { ContainerOutlined, ScheduleOutlined, CarOutlined, ConsoleSqlOutlined, VideoCameraOutlined, GoogleOutlined, CloseCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { DashboardLayout } from "@/layout";
import ReserveTable from "@/components/ReserveTable";
import { API_BASE_URL } from "@/config/serverApiConfig";
import moment from 'moment';

const ConfirmInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSize, setShowSize] = useState(10);
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const asyncList = () => {
    return request.list('admin/reserve');
  };

  const leadColumns = [
    {
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
      render: (user, row) => {
        let color = !user.isVerified ? "volcano" : "green";
        let text = user.isVerified ? 'Verified' : 'Awaiting';
        text = !user.isRejected ? text : 'Rejected';
        let now = new Date();
        if (now > new Date(row.reserveTime) && !user.isVerified && !user.isRejected) {
          color = !row.status ? "volcano" : "green";
          text = row.status ? 'Present' : 'Absent'
        }
        return <Tag color={color}>{text}</Tag>;
      },
    }, {
      title: "Join",
      dataIndex: "userId",
      render: (user, row) => {
        let now = new Date();
        if (now > new Date(row.reserveTime) && !user.isVerified && !user.isRejected) {
          return <Button htmlType="submit" className="" onClick={() => onJoin(row.url)}>
            <GoogleOutlined /> JOIN
          </Button>
        }
        return '';
      },
    }, {
      title: "Action",
      dataIndex: "userId",
      render: (user, row) => {
        let now = new Date();
        if (now > new Date(row.reserveTime)) {
          return <>
            <Button type="primary" htmlType="submit" danger onClick={() => onReject(row.userId._id)} style={{ marginRight: 5 }}>
              <CloseOutlined /> Reject
            </Button>
            <Button type="primary" htmlType="submit" onClick={() => onVerify(row.userId._id)}>
              <CheckOutlined /> Verify
            </Button></>
        }
        return '';
      },
    },
  ];

  const onJoin = (url) => {
    window.open(url, "_blank")
  }
  const onReject = async (id) => {
    try {
      const url = `${API_BASE_URL}admin/verify_client`;
      await request.post(url, { id, is_verify: false });
      setReload(!reload);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const onVerify = async (id) => {
    try {
      const url = `${API_BASE_URL}admin/verify_client`;
      await request.post(url, {
        id, is_verify: true,
      });
      setReload(!reload);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const { result, isLoading, isSuccess } = useFetch(asyncList, reload);
  if (result && reload) setReload(false)
  const paginationItems = () => {
    if (isSuccess && result) return result.slice(currentPage * showSize - showSize, currentPage * showSize);
    return [];
  };
  const onShowSizeChange = (current, pageSize) => {
    setShowSize(pageSize);
    if (current > result / pageSize) {
      setCurrentPage(1);
    }
    else {
      setCurrentPage(current);
    }
    console.log(current, showSize)
  }
  let total = result != null ? result.length : 0;
  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={24}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e" }}>
                Call Request List
              </h3>
            </div>
            <Table
              columns={leadColumns}
              rowKey={(item) => item._id}
              dataSource={isSuccess && result}
              pagination={false}
              loading={isLoading}
            />
            <Row className="pad20">
              <Col span={12} offset={12}>
                {total > 0 ? (
                  <Pagination
                    showSizeChanger
                    onChange={onShowSizeChange}
                    defaultPageSize={showSize}
                    defaultCurrent={1}
                    total={total}
                  />
                ) : ''}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default ConfirmInfo;

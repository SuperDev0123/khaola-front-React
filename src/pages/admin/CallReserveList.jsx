import React, { useState, useRef, useEffect } from "react";
import { Tag, Table, Select, Pagination, Row, Col, Calendar } from "antd";
import { ContainerOutlined, ScheduleOutlined, CarOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { DashboardLayout } from "@/layout";
import ReserveTable from "@/components/ReserveTable";
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
      render: (user, row) => {
        let color = !user.isVerified ? "volcano" : "green";
        let text = user.isVerified ? 'Verified' : 'Awaiting';
        let now = new Date();
        if (now > new Date(row.reserveTime) && !user.isVerified) {
          color = !row.status ? "volcano" : "green";
          text = row.status ? 'Present' : 'Absent'
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];
  console.log(leadColumns)
  const { result, isLoading, isSuccess } = useFetch(asyncList, reload);
  console.log(result, isLoading, isSuccess)
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

import React, { useRef, useState } from "react";
import { Form, Input, InputNumber, Space, Divider, Row, Col } from "antd";

import { Layout, Breadcrumb, Statistic, Progress, Tag } from "antd";

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import { DashboardLayout } from "@/layout";
import RecentTable from "@/components/RecentTable";

export default function ClientList() {
  const leadColumns = [
    {
      title: "Client",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Verification",
      dataIndex: "isVerified",
      render: (isVerified) => {
        let color = !isVerified  ? "volcano" : "green";

        return <Tag color={color}>{isVerified ? 'Verified' : 'Awaiting verification'}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = !status  ? "volcano" : "green";

        return <Tag color={color}>{status ? 'Enable' : 'Rejected'}</Tag>;
      },
    },
  ];
  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={24}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e", marginBottom: 5 }}>
                Client List
              </h3>
            </div>

            <RecentTable entity={"client"} dataTableColumns={leadColumns} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

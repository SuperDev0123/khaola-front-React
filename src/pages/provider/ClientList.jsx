import React, { useRef, useState } from "react";
import { Button, Row, Col, Tag } from "antd";
import { DashboardLayout } from "@/layout";
// import ClientTable from "@/components/ClientTable";
import EditableTable from "@/components/EditableTable";

export default function ClientList() {
  const leadColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      editable: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      editable: true,
    },
    {
      title: "Verification",
      dataIndex: "isVerified",
      render: (isVerified) => {
        let color = !isVerified ? "volcano" : "green";

        return <Tag color={color}>{isVerified ? 'Verified' : 'Awaiting verification'}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = !status ? "volcano" : "green";

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
              <h3 style={{ color: "#22075e" }}>
                Client List
              </h3>
            </div>            
            <EditableTable entity={"client"} url={"client/my_list"} dataTableColumns={leadColumns} modify={{ delete: true, add: true }} title={"Client"} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

import React, { useRef, useState } from "react";
import { Button, Row, Col, Tag } from "antd";
import { DashboardLayout } from "@/layout";
import ClientTable from "@/components/ClientTable";

export default function ClientList() {
  const leadColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Verification",
      dataIndex: "isVerified",
      render: (isVerified, row) => {
        let color = !isVerified ? "volcano" : "green";
        let text = isVerified ? 'Verified' : 'Awaiting verification';
        if(row.callReserve.length > 0 && !isVerified){
          text = new Date() > new Date(row.callReserve[0].reserveTime) ? 'Rejected' : 'Awaiting Call Verification'
        }
        return <Tag color={color}>{text}</Tag>;
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
            <ClientTable entity={"client"} url={"client/verify_list"} dataTableColumns={leadColumns} modify={{ delete: true, verify: true }} title={"Client"} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

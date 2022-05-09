import React, { useRef, useState } from "react";
import { Button, Row, Col, Tag } from "antd";
import { DashboardLayout } from "@/layout";
import ClientTable from "@/components/ClientTable";

export default function ProviderList() {
  const leadColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
  ];
  console.log(12)
  
  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row" span={24}>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: "#22075e" }}>
                Provider List
              </h3>
            </div>            
            <ClientTable entity={"provider"} dataTableColumns={leadColumns} modify={{ delete: true }} title="Provider" />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}

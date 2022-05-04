import React, { useState } from "react";
import { Dropdown, Menu, Table, Pagination, Row, Col, notification } from "antd";

import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { API_BASE_URL } from "@/config/serverApiConfig";

import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";

export default function RecentTable({ ...props }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSize, setShowSize] = useState(5);

  let { entity, dataTableColumns, canModify } = props;

  if (canModify) {
    dataTableColumns = [
      ...dataTableColumns,
      {
        title: "",
        render: (row) => (
          <Dropdown overlay={DropDownRowMenu({ row })} trigger={["click"]}>
            <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
          </Dropdown>
        ),
      },
    ];
  }

  function DropDownRowMenu({ row }) {
    async function Verification() {
      try {
        const url = `${API_BASE_URL}client/reset_verify`;
        await request.post(url, {
          client_id: row._id
        });
        location.reload()
      } catch (error) {
        console.log(error);
      }
    }

    async function Edit() {
      try {
        const url = `${API_BASE_URL}client/reset_status`;
        await request.post(url, {
          client_id: row._id,
          status: !row.status,
        });
        location.reload()
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <Menu style={{ width: 130 }}>
        <Menu.Item icon={<EyeOutlined />} onClick={Verification}>
          Verification
        </Menu.Item>
        <Menu.Item icon={<CheckOutlined />} onClick={Edit}>
          Change Status
        </Menu.Item>
      </Menu>
    );
  }

  const asyncList = () => {
    return request.list(entity);
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList);
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
    <>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={isSuccess && paginationItems()}
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
    </>
  );
}

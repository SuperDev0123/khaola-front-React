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

  let { entity, dataTableColumns, modify, url } = props;

  if (Object.keys(modify).length > 0) {
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

    async function Delete() {
      console.log(row)
      try {
        await request.post('client', 'test', {
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
        {modify.verification && (
          <Menu.Item icon={<EyeOutlined />} onClick={Verification} key="verification">
            Verification
          </Menu.Item>
        )}
        {modify.status && (
          <Menu.Item icon={<CheckOutlined />} onClick={Edit} key="status">
            Change Status
          </Menu.Item>
        )}
        {modify.delete && (
          <Menu.Item icon={<DeleteOutlined />} onClick={Delete} key="delete">
            Delete
          </Menu.Item>
        )}
      </Menu>
    );
  }

  const asyncList = () => {
    if (entity)
      return request.list(entity);
    if (url)
      return request.get(url);
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

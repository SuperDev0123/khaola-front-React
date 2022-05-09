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
  CloseOutlined,
} from "@ant-design/icons";
import AddClientForm from "@/components/AddClientForm";
import Modal from "@/components/Modal";


export default function RecentTable({ ...props }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSize, setShowSize] = useState(5);
  const [reload, setReload] = useState(false);

  let { entity, dataTableColumns, modify, url, title, options = {} } = props;

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
        const url = `${API_BASE_URL}${entity}/reset_verify`;
        await request.post(url, {
          client_id: row._id
        });
        setReload(true)
      } catch (error) {
        console.log(error);
      }
    }

    async function Edit() {
      try {
        const url = `${API_BASE_URL}${entity}/reset_status`;
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
      try {        
        let { success, result, message } = await request.delete(entity, row._id, {});
        console.log(success, result, message)
        if (isSuccess) {
          setReload(true);
        }
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <Menu style={{ width: 130 }}>
        {modify.verify && (
          row.isVerified ? (
            <Menu.Item icon={<CloseOutlined />} onClick={Verification} key="verification">
              Reject verify
            </Menu.Item>
          ) : (
            <Menu.Item icon={<CheckOutlined />} onClick={Verification} key="verification">
              Approve verify
            </Menu.Item>
          )
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

  const handleOk = () => {
    document.getElementById('AddClientbtn').click();
  }

  const asyncList = () => {
    if (url)
      return request.get(url);
    if (entity)
      return request.list(entity, options);
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList, reload);
  if (result && reload)
    setReload(false)
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
  console.log(title)
  return (
    <>
      {modify.add && <Modal buttonContent={`Add ${title}`} headerContent={`Add ${title}`} modalContent={<AddClientForm setReload={setReload} />} handleOk={() => handleOk()} buttonStyle={{ width: '20%', float: 'right', marginRight: 20, marginBottom: 5 }} />}
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

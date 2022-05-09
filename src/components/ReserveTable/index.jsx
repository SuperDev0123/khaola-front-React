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

  let { entity, dataTableColumns, options = {} } = props;

  const asyncList = () => {
    return request.list(entity, options);
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList, reload);
  if (result && reload)
    setReload(false)
  return (
    <>
      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={isSuccess && result}
        pagination={false}
        loading={isLoading}
      />
    </>
  );
}

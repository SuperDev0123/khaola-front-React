import React, { useState } from 'react';
import { Table, Input, Popconfirm, Form, Typography, Pagination, Row, Col } from 'antd';
import AddClientForm from "@/components/AddClientForm";
import useFetch from "@/hooks/useFetch";
import { request } from "@/request";
import Modal from "@/components/Modal";
import { DeleteOutlined, DeleteTwoTone, EditTwoTone } from '@ant-design/icons';


const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let emailRule = inputType === 'email' ? {
    pattern: new RegExp(/\S+@\S+\.\S+/),
    message:
      'Enter a valid email address!',
  } : {};
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            emailRule,
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function EditableTable({ ...props }) {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSize, setShowSize] = useState(10);
  const [reload, setReload] = useState(false);
  const isEditing = (record) => record._id === editingKey;

  let { entity, dataTableColumns, modify, url, title, options = {} } = props;

  const edit = (record) => {
    console.log(record)
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      await request.update(entity, key, row)
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const onDelete = async (key) => {
    try {
      await request.delete(entity, key)
      setReload(true);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const columns = [
    ...dataTableColumns,
    {
      title: 'Edit',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a style={{color: '#d4380d'}}>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{marginRight: 8}}>
              <EditTwoTone twoToneColor="#52c41a" />
            </Typography.Link>
            <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record._id)}>
              <DeleteTwoTone twoToneColor="#d4380d" />
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'email' ? 'email' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


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
  console.log(modify)
  return (
    <>
      <Modal buttonContent={`Add ${title}`} headerContent={`Add ${title}`} modalContent={<AddClientForm setReload={setReload} />} handleOk={() => handleOk()} buttonStyle={{ width: '20%', float: 'right', marginRight: 20, marginBottom: 5 }} />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowKey={(item) => item._id}
          dataSource={isSuccess && paginationItems()}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
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
};
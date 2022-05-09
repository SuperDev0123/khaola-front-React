import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { PlusOutlined } from "@ant-design/icons";


const App = ({ ...props }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { buttonContent, headerContent, modalContent, buttonStyle } = props;

  let { handleOk } = props;

  const showModal = () => {
    setIsModalVisible(true);
  };


  const handleSubmit = () => {
    if (handleOk) {
      handleOk();
    }
    setIsModalVisible(false);
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="dashed" onClick={showModal} block icon={<PlusOutlined />} style={buttonStyle}>
        {buttonContent}
      </Button>

      <Modal title={headerContent} visible={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
        {modalContent}
      </Modal>
    </>
  );
};

export default App;
import React, { useState } from 'react';
import { Modal, Button, Input, Form, Select, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const CreateGroupModal = ({ isVisible, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [friends, setFriends] = useState('');

  const handleCreate = () => {
    onCreateGroup(groupName, privacy, friends);
    setGroupName('');
    setPrivacy('public');
    setFriends('');
    onClose();
  };

  return (
    <Modal
      title={<Text style={{ fontSize: '20px', fontWeight: 'bold' }}>Tạo nhóm</Text>}
      visible={isVisible}
      onCancel={onClose}
      onOk={handleCreate}
      okText="Tạo"
      cancelText="Hủy"
      width={600}
    >
      <Form layout="vertical">
        {/* Tên nhóm */}
        <Form.Item
          label={<Text style={{ fontWeight: '600' }}>Tên nhóm</Text>}
          name="groupName"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhóm!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Nhập tên nhóm"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        {/* Quyền riêng tư */}
        <Form.Item
          label={<Text style={{ fontWeight: '600' }}>Chọn quyền riêng tư</Text>}
          name="privacy"
          rules={[{ required: true, message: 'Vui lòng chọn quyền riêng tư!' }]}
        >
          <Select
            value={privacy}
            onChange={setPrivacy}
            style={{ borderRadius: '8px', width: '100%', height: '70px' }}
            dropdownStyle={{ padding: '8px' }}
          >
            <Option value="public">
              <Space align="start">
                <GlobalOutlined style={{ fontSize: '20px', marginTop: '2px' }} />
                <div>
                  <Text strong>Công khai</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.
                  </Text>
                </div>
              </Space>
            </Option>
            <Option value="private">
              <Space align="start">
                <LockOutlined style={{ fontSize: '20px', marginTop: '2px' }} />
                <div>
                  <Text strong>Riêng tư</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng.
                  </Text>
                </div>
              </Space>
            </Option>
          </Select>
        </Form.Item>

        {/* Mời bạn bè */}
        <Form.Item
          label={<Text style={{ fontWeight: '600' }}>Mời bạn bè (không bắt buộc)</Text>}
          name="friends"
        >
          <Input
            value={friends}
            onChange={(e) => setFriends(e.target.value)}
            placeholder="Nhập tên bạn bè"
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGroupModal;

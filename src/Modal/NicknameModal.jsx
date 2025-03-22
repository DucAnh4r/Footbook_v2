// components/modals/NicknameModal.js
import React, { useState } from 'react';
import { Modal, List, Button, Input, Avatar, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const NicknameModal = ({ visible, onClose, participants }) => {
  const [editingId, setEditingId] = useState(null);
  const [nicknames, setNicknames] = useState(participants);

  const handleEditNickname = (id) => setEditingId(id);

  const handleNicknameChange = (id, newNickname) => {
    setNicknames(nicknames.map(participant =>
      participant.id === id ? { ...participant, nickname: newNickname } : participant
    ));
  };

  const saveNickname = () => setEditingId(null);

  return (
    <Modal title="Biệt danh" open={visible} onCancel={onClose} footer={null} centered>
      <List
        dataSource={nicknames}
        locale={{ emptyText: "Không có dữ liệu" }}
        renderItem={(participant) => (
          <List.Item
            actions={[
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditNickname(participant.id)}
              />
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={participant.avatar} />}
              title={<Text strong>{participant.name}</Text>}
              description={
                editingId === participant.id ? (
                  <Input
                    value={participant.nickname}
                    onChange={(e) => handleNicknameChange(participant.id, e.target.value)}
                    onPressEnter={saveNickname}
                    onBlur={saveNickname}
                    autoFocus
                  />
                ) : (
                  <Text>{participant.nickname}</Text>
                )
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default NicknameModal;

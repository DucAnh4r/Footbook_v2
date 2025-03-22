// components/modals/EmojiPickerModal.js
import React from 'react';
import { Modal } from 'antd';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPickerModal = ({ visible, onClose, onEmojiSelect }) => (
  <Modal title="Biểu tượng cảm xúc" open={visible} onCancel={onClose} footer={null} centered>
    <Picker data={data} onEmojiSelect={onEmojiSelect} />
  </Modal>
);

export default EmojiPickerModal;

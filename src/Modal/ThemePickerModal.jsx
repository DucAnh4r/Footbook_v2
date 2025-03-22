// components/modals/ThemePickerModal.js
import React from 'react';
import { Modal, Button } from 'antd';

const ThemePickerModal = ({ visible, onClose, onSave, colors = [] }) => (
  <Modal
    title="Đổi chủ đề"
    open={visible}
    onCancel={onClose}
    footer={[
      <Button key="cancel" onClick={onClose}>Hủy</Button>,
      <Button key="save" type="primary" onClick={() => onSave(selectedColor)}>Lưu</Button>,
    ]}
  >
    <div style={styles.colorGrid}>
      {colors.length > 0 ? (
        colors.map((color, index) => (
          <div
            key={index}
            style={{ ...styles.colorCircle, backgroundColor: color }}
            onClick={() => onSave(color)}
          />
        ))
      ) : (
        <p>No colors available</p>
      )}
    </div>
  </Modal>
);

const styles = {
  colorGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' },
  colorCircle: { width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', border: '1px solid #d9d9d9' },
};

export default ThemePickerModal;

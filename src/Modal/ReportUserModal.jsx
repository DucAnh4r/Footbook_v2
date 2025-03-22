// ReportUserModal.js
import React, { useState } from 'react';
import { Modal, Typography, List, Space, Alert } from 'antd';
import { RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import SendReportModal from './SendReportModal';

const { Text, Title } = Typography;

const ReportUserModal = ({ visible, onClose, name }) => {
  const [isSendReportVisible, setSendReportVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const reportReasons = [
    'Quấy rối',
    'Tự tử hoặc tự gây thương tích',
    'Giả mạo người khác',
    'Chia sẻ nội dung không phù hợp',
    'Ngôn từ gây thù ghét',
    'Bán hàng trái phép',
    'Lừa đảo',
    'Khác'
  ];

  const handleSelectReason = (reason) => {
    setSelectedReason(reason);
    setSendReportVisible(true);
  };

  const handleSendReport = (reason) => {
    console.log(`Report sent for reason: ${reason}`);
    setSendReportVisible(false);
    onClose(); // Đóng modal sau khi gửi báo cáo
  };

  return (
    <>
      <Modal
        title="Hãy cho chúng tôi biết chuyện gì đang xảy ra"
        open={visible && !isSendReportVisible} // Ẩn modal này khi hiện SendReportModal
        onCancel={onClose}
        footer={null}
        width={500}
      >
        <Text type="secondary">
          Chúng tôi sẽ không cho người đó biết là bạn đã báo cáo họ. Nếu thấy ai đó đang nguy hiểm, đừng chặn chử mà hãy gọi ngay cho dịch vụ khẩn cấp tại địa phương.
        </Text>
        <List
          style={{ marginTop: '16px' }}
          itemLayout="horizontal"
          dataSource={reportReasons}
          renderItem={(reason) => (
            <List.Item
              onClick={() => handleSelectReason(reason)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                title={<Text>{reason}</Text>}
              />
              <RightOutlined />
            </List.Item>
          )}
        />
        <Space direction="vertical" style={{ width: '100%', marginTop: '16px' }}>
          <Alert
            message={`Duc oi, nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chặn chử mà hãy báo ngay cho dịch vụ khẩn cấp tại địa phương.`}
            type="warning"
            icon={<ExclamationCircleOutlined />}
            showIcon
          />
        </Space>
      </Modal>

      {/* SendReportModal */}
      <SendReportModal
        visible={isSendReportVisible}
        onClose={() => setSendReportVisible(false)}
        reason={selectedReason}
        onSendReport={handleSendReport}
      />
    </>
  );
};

export default ReportUserModal;

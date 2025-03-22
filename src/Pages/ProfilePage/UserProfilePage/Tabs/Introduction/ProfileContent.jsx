import React from 'react';
import { List, Button, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ProfileContent = ({ activeTab }) => {
  const data = {
    overview: [
      { title: 'Học Công Nghệ Thông Tin tại Trường Đại học Xây dựng Hà Nội', subtitle: 'Hanoi University of Civil Engineering' },
      { title: 'Sống tại Hà Nội' },
      { title: 'Điện thoại', subtitle: '097 166 54 75', isEditable: true },
    ],
    work: [{ title: 'Thêm nơi làm việc' }],
    living: [{ title: 'Thêm quê quán' }],
    contact: [{ title: 'Thêm thông tin liên hệ và cơ bản' }],
    family: [{ title: 'Gia đình và các mối quan hệ' }],
    details: [{ title: 'Chi tiết về bạn' }],
    events: [{ title: 'Sự kiện trong đời' }],
  };

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <List
        dataSource={data[activeTab]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text>{item.title}</Text>}
              description={item.subtitle && <Text type="secondary">{item.subtitle}</Text>}
            />
            {item.isEditable && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => alert('Chỉnh sửa số điện thoại')}
              />
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProfileContent;

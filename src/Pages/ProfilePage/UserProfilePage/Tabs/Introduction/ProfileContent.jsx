import React, { useState } from "react";
import { List, Button, Typography, Modal, Form, Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { updateProfileService } from "../../../../../services/userService"; // sửa lại đường dẫn cho đúng
import { getUserIdFromLocalStorage } from "../../../../../utils/authUtils";

const { Text } = Typography;

const ProfileContent = ({ activeTab, userInfo, onProfileUpdated }) => {
  const userId = getUserIdFromLocalStorage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [form] = Form.useForm();

  const data = {
    overview: [
      {
        key: "birth_year",
        title: "Năm sinh",
        subtitle: userInfo.birth_year,
        isEditable: true,
      },
      {
        key: "profession",
        title: "Nghề nghiệp",
        subtitle: userInfo.profession,
        isEditable: true,
      },
      {
        key: "address",
        title: "Địa chỉ",
        subtitle: userInfo.address,
        isEditable: true,
      },
    ],
    work: [{ title: "Thêm nơi làm việc" }],
    living: [{ title: "Thêm quê quán" }],
    contact: [{ title: "Thêm thông tin liên hệ và cơ bản" }],
    family: [{ title: "Gia đình và các mối quan hệ" }],
    details: [{ title: "Chi tiết về bạn" }],
    events: [{ title: "Sự kiện trong đời" }],
  };

  const handleEdit = (fieldKey, label, currentValue) => {
    setEditField(fieldKey);
    setEditLabel(label); // label như "Năm sinh", "Nghề nghiệp", ...
    form.setFieldsValue({ value: currentValue });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updateData = {
        [editField]: values.value,
      };

      await updateProfileService(updateData, userId);
      message.success("Cập nhật thành công");
      setIsModalOpen(false);
      if (onProfileUpdated) onProfileUpdated(); // Gọi callback để reload thông tin từ cha nếu cần
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <List
        dataSource={data[activeTab]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text>{item.title}</Text>}
              description={
                item.subtitle && <Text type="secondary">{item.subtitle}</Text>
              }
            />
            {item.isEditable && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(item.key, item.title, item.subtitle)}
              />
            )}
          </List.Item>
        )}
      />

      <Modal
        title="Chỉnh sửa thông tin"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="value"
            label={editLabel}
            rules={[
              {
                required: true,
                message: `Vui lòng nhập ${editLabel.toLowerCase()}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfileContent;

// /src/components/ProfileContent.jsx
import React, { useState } from 'react';
import { Avatar, Button, Divider, Input, Radio, Modal, List, Typography, Space } from 'antd';
import {
  FaCog, FaQuestionCircle, FaMoon, FaCommentDots, FaSignOutAlt, FaUser,
  FaArrowLeft, FaGlobe, FaCheck, FaExclamationCircle, FaEnvelope,
  FaInfoCircle, FaKeyboard, FaStar
} from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const languages = [
  { name: 'Tiếng Việt', description: 'Tiếng Việt · Gần đây' },
  { name: 'English (US)', description: 'Tiếng Anh (Mỹ) · Gần đây' },
  { name: '中文(台灣)', description: 'Tiếng Trung phồn thể (Đài Loan) · Gợi ý' },
  { name: 'Español', description: 'Tiếng Tây Ban Nha · Gợi ý' },
  { name: 'Português (Brasil)', description: 'Tiếng Bồ Đào Nha (Brazil) · Gợi ý' },
  { name: 'Af-Soomaali', description: 'Tiếng Somali' },
  { name: 'Afrikaans', description: 'Tiếng Afrikaans' },
  { name: 'Azərbaycan dili', description: 'Tiếng Azerbaijan' },
  { name: 'Bahasa Indonesia', description: 'Tiếng Indo' },
  { name: 'Bahasa Melayu', description: 'Tiếng Mã Lai' },
  { name: 'Basa Jawa', description: 'Tiếng Java' },
  { name: 'Bisaya', description: 'Tiếng Cebuano' }
];

const ProfileContent = ({ userName, UserAvatar }) => {
  const [view, setView] = useState('main'); // 'main', 'settings', 'language', 'languageList'
  const [selectedLanguage, setSelectedLanguage] = useState('Tiếng Việt');
  const [darkMode, setDarkMode] = useState('off'); // 'off', 'on', 'auto'
  const [singleKeyShortcuts, setSingleKeyShortcuts] = useState('off'); // 'off', 'on'
  const [isModalVisible, setIsModalVisible] = useState(false);


  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate('/profile');
  };
  const handleBackClick = () => {
    const viewMapping = {
      languageList: 'language',
      language: 'settings',
      keyboard: 'accessibility'
    };
    setView(viewMapping[view] || 'main');
  };

  const renderBackButton = (title) => (
    <Space align="center" style={{ padding: '8px 0' }}>
      <Button type="text" icon={<FaArrowLeft />} onClick={handleBackClick} />
      <Title level={5} style={{ margin: 0 }}>{title}</Title>
    </Space>
  );

  return (
    <div style={{ width: 320 }}>
      {view === 'main' && (
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            width: '100%',
          }}
        >
          <Space direction="vertical" style={{ width: '100%', }}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease', // Hover effect

              }}
              onClick={handleProfileClick}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
            >
              <img style={{width: "50px", height: "50px", borderRadius: "50px"}} src={UserAvatar} alt="" />
              <Text strong style={{ fontSize: '16px' }}>{userName}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="link" style={{ padding: 0, color: '0084ff' }}>Xem tất cả trang cá nhân</Button>
            </div>
          </Space>

          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />

          <List
            dataSource={[
              { text: 'Cài đặt & quyền riêng tư', icon: <FaCog />, view: 'settings' },
              { text: 'Trợ giúp & hỗ trợ', icon: <FaQuestionCircle />, view: 'helpSupport' },
              { text: 'Màn hình & trợ năng', icon: <FaMoon />, view: 'accessibility' },
              { text: 'Đóng góp ý kiến', icon: <FaCommentDots /> },
              { text: 'Đăng xuất', icon: <FaSignOutAlt /> }
            ]}
            renderItem={({ text, icon, view }) => (
              <List.Item onClick={() => view && setView(view)}
                style={{
                  padding: '0px', cursor: 'pointer',
                  borderRadius: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>
                <Button
                  type="text"
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '50px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '10px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {icon}
                    <span style={{ marginLeft: 8 }}>
                      <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>{text}</Text>
                    </span>
                  </span>
                  {view && <MdOutlineArrowForwardIos style={{ fontSize: '16px', color: '#888' }} />}
                </Button>
              </List.Item>
            )}
          />

          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />

          <Text
            type="secondary"
            style={{
              fontSize: '12px',
              textAlign: 'center',
              display: 'block',
              padding: '5px 0px',
              color: '#888',
            }}
          >
            Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo · Cookie · Xem thêm · Meta © 2024
          </Text>
        </div>

      )}

      {view === 'settings' && (
        <div style={{ fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', padding: '10px' }}>
          {renderBackButton('Cài đặt & quyền riêng tư')}
          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />
          <List
            dataSource={[
              { text: 'Ngôn ngữ', icon: <FaGlobe />, view: 'language' },
              { text: 'Xem tất cả cài đặt', icon: <FaCog /> }
            ]}
            renderItem={({ text, icon, view }) => (
              <List.Item onClick={() => view && setView(view)}
                style={{
                  padding: '0px', cursor: 'pointer',
                  borderRadius: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>
                <Button
                  type="text"
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '50px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '10px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {icon}
                    <span style={{ marginLeft: 8 }}>
                      <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>{text}</Text>
                    </span>
                  </span>
                  {view && <MdOutlineArrowForwardIos style={{ fontSize: '16px', color: '#888' }} />}
                </Button>
              </List.Item>
            )}
          />
        </div>

      )}

      {view === 'language' && (
        <div style={{ fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', padding: '10px' }}>
          {renderBackButton('Ngôn ngữ')}
          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '50px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '10px'
            }}
            onClick={() => setView('languageList')}


            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>

            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FaGlobe style={{ marginRight: '8px', fontSize: '20px', color: '#333' }} />
              <div style={{ display: 'flex' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold' }}>Ngôn ngữ trên Facebook</Text>
                <Text type="secondary" style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>{selectedLanguage}</Text>
              </div>
            </span>
            <MdOutlineArrowForwardIos style={{ fontSize: '16px', color: '#888' }} />
          </button>
        </div>

      )}

      {view === 'languageList' && (
        <div style={{ fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', padding: '10px' }}>
          {renderBackButton('Ngôn ngữ trên Facebook')}
          <Input
            placeholder="Tìm kiếm ngôn ngữ"
            style={{ width: '95%', margin: '8px', borderRadius: '20px', padding: '5px 10px', border: '1px solid #ddd' }}
          />
          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />
          <List
            dataSource={languages}
            renderItem={(language) => (
              <List.Item
                onClick={() => setSelectedLanguage(language.name)}
                style={{
                  cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd', borderRadius: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>

                <Space
                  style={{ width: '100%', justifyContent: 'space-between', padding: '0px 10px' }}
                >
                  <div>
                    <Text strong style={{ fontWeight: 'bold', fontSize: '14px' }}>{language.name}</Text>
                    <Text
                      type="secondary"
                      style={{ display: 'block', fontSize: '12px', color: '#888', textAlign: 'left' }}
                    >
                      {language.description}
                    </Text>
                  </div>
                  {selectedLanguage === language.name && <FaCheck style={{ color: '#1877f2', fontSize: '16px' }} />}
                </Space>
              </List.Item>
            )}
          />
        </div>

      )}

      {view === 'helpSupport' && (
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            padding: '10px',
            width: '100%',
          }}
        >
          {renderBackButton('Trợ giúp & hỗ trợ')}
          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />
          <List
            dataSource={[
              { text: 'Trung tâm trợ giúp', icon: <FaInfoCircle /> },
              { text: 'Hộp thư hỗ trợ', icon: <FaEnvelope /> },
              { text: 'Báo cáo sự cố', icon: <FaExclamationCircle /> }
            ]}
            renderItem={({ text, icon }) => (
              <List.Item
                style={{
                  padding: '0px', cursor: 'pointer', borderRadius: '10px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>
                <Button
                  type="text"
                  icon={icon}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease', // Hover effect for button
                    minHeight: '50px'
                  }}
                >
                  <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 'bold' }}>{text}</span>
                </Button>
              </List.Item>
            )}
          />
        </div>

      )}

      {view === 'accessibility' && (
        <div style={{ fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', padding: '10px' }}>
          {renderBackButton('Màn hình & trợ năng')}
          <Divider style={{ margin: '0px', height: '1px' }} />
          <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <FaMoon style={{ fontSize: '20px', color: '#333' }} />
              <Text strong style={{ fontWeight: 'bold', fontSize: '16px', marginLeft: '8px' }}>Chế độ tối</Text>
            </div>
            <Text type="secondary" style={{ color: '#888', fontSize: '12px', marginLeft: '28px' }}>Điều chỉnh giao diện để giảm độ chói.</Text>
            <Radio.Group value={darkMode} onChange={(e) => setDarkMode(e.target.value)} style={{ display: 'flex', flexDirection: 'column', marginLeft: '28px', marginTop: '10px' }}>
              <Radio value="off" style={{ margin: '5px 0' }}>Đang tắt</Radio>
              <Radio value="on" style={{ margin: '5px 0' }}>Đang bật</Radio>
              <Radio value="auto" style={{ margin: '5px 0' }}>Tự động</Radio>
            </Radio.Group>
          </div>
          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />
          <button
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: 'transparent', border: 'none', fontSize: '14px', cursor: 'pointer', width: '100%' }}
            onClick={() => setView('keyboard')}
          >
            <span>Bàn phím</span>
            <MdOutlineArrowForwardIos style={{ fontSize: '16px', color: '#888' }} />
          </button>
        </div>

      )}

      {view === 'keyboard' && (
        <div style={{ fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', padding: '10px' }}>
          {renderBackButton('Bàn phím')}
          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />
          <button
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '10px', backgroundColor: 'transparent', border: 'none', fontSize: '14px', cursor: 'pointer', width: '100%' }}
            onClick={() => setIsModalVisible(true)}
          >
            <FaKeyboard style={{ marginRight: '8px', fontSize: '20px', color: '#333' }} />
            <span>Xem tất cả phím tắt</span>
          </button>
          <Divider style={{ margin: '0px', height: '1px', backgroundColor: '#ddd' }} />
          <div style={{ padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <FaStar style={{ fontSize: '20px', color: '#333' }} />
              <Text strong style={{ fontWeight: 'bold', fontSize: '16px', marginLeft: '8px' }}>Dùng phím tắt có một ký tự</Text>
            </div>
            <Radio.Group value={singleKeyShortcuts} onChange={(e) => setSingleKeyShortcuts(e.target.value)} style={{ display: 'flex', flexDirection: 'column', marginLeft: '28px', marginTop: '10px' }}>
              <Radio value="off" style={{ margin: '5px 0' }}>Đang tắt</Radio>
              <Radio value="on" style={{ margin: '5px 0' }}>Đang bật</Radio>
            </Radio.Group>
          </div>
        </div>

      )}

      <Modal
        title="Tất cả phím tắt trên Footbook"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Space direction="horizontal" style={{ justifyContent: 'space-around', padding: '16px' }}>
          <div>
            <Title level={5}>Toàn cầu</Title>
            <p>Hiển thị phím tắt: <kbd>f1</kbd></p>
          </div>
          <div>
            <Title level={5}>Bảng tin</Title>
            <p>Viết bình luận: <kbd>c</kbd></p>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default ProfileContent;

/* eslint-disable no-unused-vars */
// /src/components/MassageLayout.jsx
import React, { useState, useCallback } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Messagepage from "../Pages/MessagePage/Messagepage";
import "./MessageLayout.scss";
import { HeaderProvider } from "../Context/HeaderContext";
import MessageLeftSidebar from "../Pages/MessagePage/MessageLeftSidebar";
import MessageRightSidebar from "../Pages/MessagePage/MessageRightSidebar";

const { Sider, Content } = Layout;

const MessageLayout = (props) => {
  // State to hold selected chat details
  const [selectedChat, setSelectedChat] = useState(null);
  const [isRightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Callback để kích hoạt việc refetch danh sách tin nhắn
  const handleRefetchLeftList = useCallback(() => {
    // Tăng counter để trigger rerender và useEffect trong MessageLeftSidebar
    setRefetchTrigger(prev => prev + 1);
  }, []);

  return (
    <Layout className="main-layout">
      <HeaderProvider>
        <Header>header</Header>
        <Layout className="inner-layout" style={{ marginTop: "63px" }}>
          {/* Left Sidebar */}
          <Sider width={360} className="scroll-on-hover sidebar">
            <MessageLeftSidebar
              onSelectChat={setSelectedChat}
              refetchTrigger={refetchTrigger}
            />
          </Sider>

          {/* Main Content */}
          <Content className="content">
            <div style={{ height: "100%" }} className="content-inner">
              {/* Pass selectedChat details to Messagepage */}
              <Messagepage
                selectedChat={selectedChat}
                toggleRightSidebar={setRightSidebarVisible}
                onSentMessage={handleRefetchLeftList} // Truyền callback cụ thể
              />
            </div>
          </Content>

          {/* Right Sidebar */}
          {isRightSidebarVisible && (
            <Sider width={380} className="scroll-on-hover sidebar">
              <MessageRightSidebar selectedChat={selectedChat} />
            </Sider>
          )}
        </Layout>
      </HeaderProvider>
    </Layout>
  );
};

export default MessageLayout;
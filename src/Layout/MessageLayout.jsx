// /src/components/MassageLayout.jsx
import React, { useState } from "react";
import { Layout } from "antd";
import Header from "./Header";
import MessageLeftSidebar from "../Pages/Homepage/LeftSidebar/MessageLeftSidebar";
import MessageRightSidebar from "../Pages/Homepage/RightSidebar/MessageRightSidebar";
import Messagepage from "../Pages/MessagePage/Messagepage";
import './MessageLayout.scss'
import { HeaderProvider } from "../Context/HeaderContext";

const { Sider, Content } = Layout;

const MessageLayout = (props) => {
  // State to hold selected chat details
  const [selectedChat, setSelectedChat] = useState(null);
  const [isRightSidebarVisible, setRightSidebarVisible] = useState(true);

  return (
    <Layout className="main-layout">
            <HeaderProvider>
      <Header>header</Header>
      <Layout className="inner-layout" style={{ marginTop: '63px' }}>
        {/* Left Sidebar */}
        <Sider width={360} className="scroll-on-hover sidebar">
          <MessageLeftSidebar onSelectChat={setSelectedChat} /> {/* Pass handler */}
        </Sider>
        
        {/* Main Content */}
        <Content className="content">
          <div style={{height: '100%'}} className="content-inner">
            {/* Pass selectedChat details to Messagepage */}
            <Messagepage selectedChat={selectedChat} toggleRightSidebar = {setRightSidebarVisible}/>
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

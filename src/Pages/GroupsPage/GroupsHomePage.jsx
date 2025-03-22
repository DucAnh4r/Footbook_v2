import React, { useState } from 'react'; // Import useState từ React
import { Layout } from 'antd';
import LeftSidebar from './Components/LeftSidebar';
import GroupsPost from '../../Components/GroupPost';
import { useAuthCheck } from '../../utils/checkAuth';
import GroupListPage from './Pages/GroupListPage';
import { useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;

const GroupsPage = () => {
  useAuthCheck();

  const [activePage, setActivePage] = useState('page1');  // Khai báo useState cho activePage

  const renderPage = () => {
    switch (activePage) {
      case 'page1':
        return (
          <>
            <h3 style={{ marginBottom: '20px', marginTop: '30px' }}>Hoạt động gần đây</h3>
            <GroupsPost />
          </>
        );
      case 'page2':
        return <GroupListPage />;
      case 'page3':
        return <GroupListPage />;
      default:
        return <GroupsPost />;
    }
  };

  return (
    <Layout>
      <Sider
        width={360}
        style={{
          background: '#f5f5f5',
          height: '100vh',
          overflow: 'hidden',
          position: 'fixed',
          top: '64px',
          left: '0',
          zIndex: '100'
        }}
        className="scroll-on-hover"
      >
        <LeftSidebar setActivePage={setActivePage} /> {/* Truyền setActivePage vào LeftSidebar */}
      </Sider>

      <Content style={{ padding: '70px 0px 0px 370px', minHeight: '100vh', overflow: 'unset', display: 'flex', justifyContent: 'center', }}>
        <div className="page-content" style={{ width: 'max-content' }}>
          {renderPage()} {/* Render trang con dựa trên activePage */}
        </div>
      </Content>
    </Layout>
  );
};

export default GroupsPage;

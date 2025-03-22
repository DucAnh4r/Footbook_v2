import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Row, Spin, Alert, Avatar, List } from 'antd';
import { useAuthCheck } from '../../utils/checkAuth';
import styles from './HomePageSearch.module.scss';
import LeftSidebar from './Components/LeftSidebar';
import { userSearchService } from '../../services/userService';

const { Sider, Content } = Layout;

const HomePageSearch = () => {
  useAuthCheck();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy query string từ URL
    const params = new URLSearchParams(location.search);
    const query = params.get('query'); // "query" là tên của query string bạn truyền
    setSearchQuery(query || '');
  }, [location.search]);

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults();
    }
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userSearchService({
        keyword: searchQuery,
        page: 0,
        size: 100,
      });
      setSearchResults(response.data.data || []); // Truy cập `data` trong response
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate(); // Sử dụng useNavigate hook
  const handleUserClick = (userId) => {
    if (userId) {
      navigate(`/friendprofile/${userId}`);
    }
  };

  return (
    <Layout>
      <Sider
        width={360}
        style={{
          background: 'white',
          height: '100vh',
          overflow: 'hidden',
          position: 'fixed',
          top: '64px',
          left: '0',
          zIndex: '100',
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
        }}
        className="scroll-on-hover"
      >
        <LeftSidebar query={searchQuery} />
      </Sider>

      <Content style={{ padding: '70px 0px 70px 380px', minHeight: '100vh', overflow: 'auto' }}>
        <div className="page-content">
          <h1>Kết quả tìm kiếm cho: {searchQuery}</h1>

          {loading && (
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spin size="large" />
            </Row>
          )}

          {error && (
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Alert message="Lỗi" description={error} type="error" showIcon />
            </Row>
          )}

          {!loading && !error && searchResults.length === 0 && searchQuery && (
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p>Không tìm thấy kết quả phù hợp.</p>
            </Row>
          )}

          {!loading && !error && searchResults.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={searchResults}
              renderItem={(user) => (
                <List.Item>
                  <List.Item.Meta onClick={() => handleUserClick(user.userId)} className={styles.userItem}
                    avatar={
                      <Avatar className={styles.avatar}
                        src={user.profilePictureUrl || 'https://via.placeholder.com/150'}
                        alt={user.fullName}
                      />
                    }
                    title={<span className={styles.userName}>{user.fullName}</span>}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default HomePageSearch;

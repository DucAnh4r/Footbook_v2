import React, { useState, useEffect } from 'react';
import { Modal, Input, Pagination, Skeleton } from 'antd';

const { Search } = Input;

const GifModal = ({ visible, onClose, onSendGif }) => {
    const [gifResults, setGifResults] = useState([]); // Kết quả tìm kiếm GIF
    const [loadingGifs, setLoadingGifs] = useState(false); // Trạng thái tải GIF
    const [query, setQuery] = useState('excited'); // Từ khóa tìm kiếm hiện tại
    const [totalResults, setTotalResults] = useState(0); // Tổng số kết quả
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

    const PAGE_SIZE = 15; // Số lượng ảnh mỗi trang
    const TENOR_API_BASE_URL = "https://tenor.googleapis.com/v2/search";
    const TENOR_API_KEY = "AIzaSyCjhWBOsrhF3OmZy-JWdODdqaQLWuGwDQk";

    // Gọi API Tenor
    const fetchGifs = async (searchQuery, page = 1) => {
        try {
            setLoadingGifs(true);

            // Tính toán vị trí (offset) dựa trên trang hiện tại
            const offset = (page - 1) * PAGE_SIZE;
            const url = `${TENOR_API_BASE_URL}?q=${searchQuery}&key=${TENOR_API_KEY}&client_key=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&limit=${PAGE_SIZE}&pos=${offset}`;
            const response = await fetch(url);
            const data = await response.json();

            setGifResults(data.results || []);
            setTotalResults(data.next ? offset + PAGE_SIZE + 1 : offset + (data.results || []).length);
        } catch (error) {
            console.error("Error fetching GIFs:", error);
        } finally {
            setLoadingGifs(false);
        }
    };

    // Xử lý tìm kiếm GIF
    const handleSearchGifs = (value) => {
        if (value.trim()) {
            setQuery(value.trim()); // Lưu từ khóa mới
            setCurrentPage(1); // Quay về trang đầu tiên
            fetchGifs(value.trim(), 1); // Fetch dữ liệu mới
        }
    };

    // Fetch GIFs mặc định khi modal mở
    useEffect(() => {
        if (visible) {
            fetchGifs(query, currentPage); // Fetch GIFs với từ khóa hiện tại và trang hiện tại
        }
    }, [visible, currentPage]);

    // Xử lý thay đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại
        fetchGifs(query, page);
    };

    return (
        <Modal
            title="Chọn GIF"
            open={visible}
            footer={null}
            onCancel={onClose}
            width={600}
        >
            <div style={{ marginBottom: '16px' }}>
                {/* Ô tìm kiếm */}
                <Search
                    placeholder="Tìm GIF"
                    allowClear
                    enterButton="Tìm"
                    size="large"
                    onSearch={handleSearchGifs}
                />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '200px' }}>
                {loadingGifs ? (
                    // Hiển thị skeleton khi đang tải
                    Array.from({ length: PAGE_SIZE }).map((_, index) => (
                        <Skeleton.Avatar
                            key={index}
                            shape="square"
                            active
                            style={{ width: '100px', height: '100px' }}
                        />
                    ))
                ) : (
                    gifResults.map((gif, index) => (
                        <img
                            key={index}
                            src={gif.media_formats.gif.url} // Lấy URL GIF từ kết quả API
                            alt="GIF"
                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                            onClick={() => onSendGif(gif.media_formats.gif.url)}
                        />
                    ))
                )}
            </div>

            {/* Phân trang */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={totalResults}
                    onChange={handlePageChange}
                    showSizeChanger={false} // Ẩn tính năng thay đổi số lượng mỗi trang
                />
            </div>
        </Modal>
    );
};

export default GifModal;

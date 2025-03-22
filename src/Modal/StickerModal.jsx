import React, { useState, useEffect } from 'react';
import { Modal, Input, Skeleton, Pagination } from 'antd';

const { Search } = Input;

const StickerModal = ({ visible, onClose, onSendSticker }) => {
    const [stickers, setStickers] = useState([]); // Sticker kết quả tìm kiếm
    const [loadingStickers, setLoadingStickers] = useState(false); // Trạng thái tải stickers
    const [query, setQuery] = useState('funny'); // Từ khóa mặc định tìm kiếm stickers
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalStickers, setTotalStickers] = useState(0); // Tổng số stickers

    const GIPHY_API_KEY = "QHpr1FGASNHY5u7DhIvDT5gjIoeYJDp1";
    const GIPHY_API_BASE_URL = "https://api.giphy.com/v1/stickers";
    const PAGE_SIZE = 15; // Số stickers trên mỗi trang

    // Lấy stickers dựa trên từ khóa và trang
    const fetchStickers = async (searchQuery, page) => {
        try {
            setLoadingStickers(true);
            const offset = (page - 1) * PAGE_SIZE; // Tính offset dựa trên trang hiện tại
            const response = await fetch(
                `${GIPHY_API_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${searchQuery}&limit=${PAGE_SIZE}&offset=${offset}&rating=g&lang=en`
            );
            const data = await response.json();
            setStickers(data.data || []); // Lưu kết quả stickers
            setTotalStickers(data.pagination.total_count || 0); // Lưu tổng số stickers
        } catch (error) {
            console.error("Error fetching stickers:", error);
        } finally {
            setLoadingStickers(false);
        }
    };

    // Khi modal hiển thị, tự động tải stickers mặc định
    useEffect(() => {
        if (visible) {
            fetchStickers(query, currentPage);
        }
    }, [visible, currentPage]);

    // Xử lý tìm kiếm stickers
    const handleSearchStickers = (value) => {
        if (value.trim()) {
            setQuery(value.trim());
            setCurrentPage(1); // Quay về trang đầu tiên
            fetchStickers(value.trim(), 1);
        }
    };

    // Xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchStickers(query, page);
    };

    return (
        <Modal
            title="Chọn Sticker"
            open={visible}
            footer={null}
            onCancel={onClose}
            width={600}
        >
            {/* Tìm kiếm */}
            <div style={{ marginBottom: '16px' }}>
                <Search
                    placeholder="Tìm Sticker"
                    allowClear
                    enterButton="Tìm"
                    size="large"
                    onSearch={handleSearchStickers}
                />
            </div>

            {/* Stickers */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', minHeight: '300px' }}>
                {loadingStickers
                    ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
                          <Skeleton.Avatar
                              key={index}
                              shape="square"
                              active
                              style={{ width: '100px', height: '100px' }}
                          />
                      ))
                    : stickers.map((sticker, index) => (
                          <img
                              key={index}
                              src={sticker.images.fixed_height_small.url} // URL sticker từ GIPHY API
                              alt="Sticker"
                              style={{ width: '100px', height: '100px', cursor: 'pointer', borderRadius: '8px' }}
                              onClick={() => onSendSticker(sticker.images.fixed_height_small.url)}
                          />
                      ))}
            </div>

            {/* Phân trang */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={totalStickers}
                    onChange={handlePageChange}
                    showSizeChanger={false} // Ẩn tính năng thay đổi số lượng mỗi trang
                />
            </div>
        </Modal>
    );
};

export default StickerModal;

import React, { useEffect, useState } from "react";
import ApiBaiViet from "../api/ApiBaiVIet";
import { Link } from "react-router-dom";
import { Pagination } from "antd";


export default function Allposts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // Số bài viết mỗi trang

  useEffect(() => {
    ApiBaiViet.getAllPost()
      .then((res) => {
        const allPosts = res.data.posts || [];
        setPosts(allPosts);
        setFilteredPosts(allPosts);
        
        // Lấy danh sách categories
        const uniqueCategories = [];
        allPosts.forEach(post => {
          if (post.categories) {
            Object.values(post.categories).forEach(category => {
              if (!uniqueCategories.some(cat => cat.name === category.name)) {
                uniqueCategories.push(category);
              }
            });
          }
        });
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Lọc theo category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => {
        return post.categories && Object.values(post.categories).some(
          category => category.name === selectedCategory
        );
      });
      setFilteredPosts(filtered);
    }
    setCurrentPage(1); // Reset về trang đầu khi lọc
  }, [selectedCategory, posts]);

  // Phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-b  py-10 px-2">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#dd5c36] drop-shadow-lg tracking-wide">
          Tin tức & Bài viết
        </h1>
        
        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-[#dd5c36] text-white shadow-lg"
                : "bg-white text-[#dd5c36] border border-[#dd5c36] hover:bg-[#dd5c36] hover:text-white"
            }`}
          >
            Tất cả ({posts.length})
          </button>
          {categories.map((category) => {
            const categoryCount = posts.filter(post => 
              post.categories && Object.values(post.categories).some(
                cat => cat.name === category.name
              )
            ).length;
            
            return (
              <button
                key={category.ID}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-[#dd5c36] text-white shadow-lg"
                    : "bg-white text-[#dd5c36] border border-[#dd5c36] hover:bg-[#dd5c36] hover:text-white"
                }`}
              >
                {category.name} ({categoryCount})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dd5c36]"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500">Không có bài viết nào trong danh mục này.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <div
                  key={post.ID}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col border border-[#ffe1d6] hover:-translate-y-1 hover:scale-[1.02] transform"
                >
                  <Link to={`/chitietposts/${post.ID}`}>
                    <img
                      src={post.featured_image || "https://via.placeholder.com/600x350?text=No+Image"}
                      alt={post.title}
                      className="w-full h-56 object-cover rounded-t-2xl transition-all duration-300 hover:brightness-90"
                    />
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    {/* Categories tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories && Object.values(post.categories).map((category) => (
                        <span
                          key={category.ID}
                          className="px-3 py-1 bg-[#dd5c36] text-white text-xs rounded-full font-medium"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                    
                    <Link to={`/chitietposts/${post.ID}`}>
                      <h2 className="text-xl font-bold mb-2 text-[#dd5c36] hover:underline line-clamp-2 transition-colors duration-200">
                        {post.title}
                      </h2>
                    </Link>
                    <div
                      className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#f3e5e0]">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg width="16" height="16" fill="none" className="inline-block mr-1" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3" stroke="#dd5c36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" stroke="#dd5c36" strokeWidth="2"/>
                        </svg>
                        {new Date(post.date).toLocaleDateString("vi-VN")}
                      </span>
                      <Link
                        to={`/chitietposts/${post.ID}`}
                        className="text-[#dd5c36] text-sm font-semibold hover:underline flex items-center gap-1"
                      >
                        Đọc tiếp
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <path d="M9 18l6-6-6-6" stroke="#dd5c36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {filteredPosts.length > pageSize && (
              <div className="flex justify-center mt-12">
                <Pagination
                  current={currentPage}
                  total={filteredPosts.length}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} của ${total} bài viết`
                  }
                  className="custom-pagination"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
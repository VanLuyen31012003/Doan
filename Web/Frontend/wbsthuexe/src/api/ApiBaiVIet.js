import axios from "axios";

const WORDPRESS_URL = "https://public-api.wordpress.com/rest/v1.1/sites/moto433.wordpress.com/posts";

const ApiBaiViet = {
  // Lấy tất cả bài viết từ WordPress
  getAllPost: () => {
    return axios.get(WORDPRESS_URL);
  },
  // Lấy chi tiết bài viết theo id từ WordPress
  getPostById: (id) => {
    const url = `https://public-api.wordpress.com/rest/v1.1/sites/moto433.wordpress.com/posts/${id}`;
    return axios.get(url);
  }
};

export default ApiBaiViet;
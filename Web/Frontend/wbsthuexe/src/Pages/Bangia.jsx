import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ApiBaiViet from "../api/ApiBaiVIet";
function ChiTietPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ApiBaiViet.getPostById(id)
        .then((res) => {
          setPost(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dd5c36]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-gray-500 py-12">
        Không tìm thấy bài viết.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link
        to="/postwordpress"
        className="inline-block mb-4 text-[#dd5c36] font-bold hover:underline"
      >
        &larr; Quay lại danh sách bài viết
      </Link>
      <h1 className="text-3xl font-bold mb-4 ">{post.title}</h1>
      {post.featured_image && (
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-auto object-cover rounded mb-6"
        />
      )}
      <div className="text-gray-500 text-sm mb-6">
        Đăng ngày: {new Date(post.date).toLocaleDateString("vi-VN")}
      </div>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}

export default ChiTietPost;
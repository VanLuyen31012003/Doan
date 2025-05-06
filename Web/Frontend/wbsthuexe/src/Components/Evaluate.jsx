import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Rate, Spin, Input, Button} from "antd";
import { toast } from "react-toastify";
import ApiDanhGia from "../api/ApiDanhGia";
import { MotoContext } from "../Context/MotoContext";

const { TextArea } = Input;

const Evaluate = ({ data }) => {
    
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
      const { isLogin, setIsLogin } = useContext(MotoContext);
    

  // State cho phần viết đánh giá
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Hàm gọi API để lấy danh sách đánh giá
  const fetchEvaluations = async (pageNumber = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/danhgia/getalldanhgiabyid/${data?.mauXeId}?page=${pageNumber - 1}&size=${pageSize}&sort=ngayDanhGia,desc`
      );
      const { content, page } = response.data.data;
      setEvaluations(content);
      setTotalElements(page.totalElements);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm gửi đánh giá
  const handleSubmitEvaluation = async () => {
    if (!rating || !comment.trim()) {
      toast("Vui lòng nhập đầy đủ thông tin đánh giá!");
      return;
    }

    const newEvaluation = {
      mauXeId: data?.mauXeId, 
      soSao: rating,
      binhLuan: comment,
    };

    setSubmitting(true);
    try {
        const response = await ApiDanhGia.addDanhGia(newEvaluation);
       toast(`Đã đánh giá thành công: ${response.data.message}`);
      setRating(0);
      setComment("");
      fetchEvaluations(page, pageSize); // Refresh danh sách đánh giá
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast(`Xin lỗi: ${error.response.data.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Gọi API khi component được mount hoặc khi trang/phân trang thay đổi
  useEffect(() => {
    fetchEvaluations(page, pageSize);
  }, [page, pageSize,data]);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (pageNumber, pageSize) => {
    setPage(pageNumber);
    setPageSize(pageSize);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto my-4">
      <h2 className="text-2xl font-bold text-cam mb-4">Đánh giá</h2>

          {/* Form viết đánh giá */}
          {isLogin ? (<div className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Viết đánh giá</h3>
        <Rate
          value={rating}
          onChange={(value) => setRating(value)}
          className="text-cam mb-3"
        />
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
          className="mb-3"
        />
        <Button
          type="primary"
          onClick={handleSubmitEvaluation}
          loading={submitting}
          className="bg-cam text-white hover:bg-orange-600"
        >
          Gửi đánh giá
        </Button>
      </div>):(<></>)}
      

      {/* Danh sách đánh giá */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : evaluations.length > 0 ? (
        <>
          <ul className="space-y-4">
            {evaluations.map((evaluation) => (
              <li
                key={evaluation.danhGiaId}
                className="p-4 border rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-center gap-5">
                    <h3 className="font-bold text-lg text-gray-800">
                      {evaluation.hoTenKhachHang}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {evaluation.ngayDanhGia}
                    </p>
                  </div>
                  <Rate
                    disabled
                    value={evaluation.soSao}
                    className="text-cam"
                  />
                </div>
                <p className="text-gray-600 mt-2">{evaluation.binhLuan}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalElements}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
              showTotal={(total) => `Tổng ${total} đánh giá`}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">Chưa có đánh giá nào.</p>
      )}
    </div>
  );
};

export default Evaluate;
import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ReviewForm = () => {
    const [formData, setFormData] = useState({
      user : "",
      course: "",
      rating: "",
      review_text: "",
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axiosInstance.post("/reviews/", formData);
        alert("評価が送信されました！");
        setFormData({ user: "", course: "", rating: "", review_text: "" });
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h1>授業評価フォーム</h1>
        <label>
            ユーザーID:
            <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          授業ID:
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          評価 (1～5):
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </label>
        <label>
          感想:
          <textarea
            name="review_text"
            value={formData.review_text}
            onChange={handleChange}
          />
        </label>
        <button type="submit">送信</button>
      </form>
    );
  };
  
export default ReviewForm;
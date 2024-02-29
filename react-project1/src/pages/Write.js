import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Write() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]); // 게시글 목록 상태

  // 파일 첨부 처리 함수
  // 파일 첨부 처리 함수
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // 게시글 업로드 처리 함수
// 게시글 업로드 처리 함수
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }
    try {
      // 백엔드 엔드포인트로 POST 요청 보내기
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/postData`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 게시글 목록 상태 업데이트 (이 부분은 백엔드로부터 게시글 목록을 받아오는 경우에만 필요)
      // const updatedPosts = [...posts, response.data];
      // setPosts(updatedPosts);

      alert('게시글이 성공적으로 업로드되었습니다.');
      navigate('/board'); // 업로드 후 게시판 페이지로 이동
    } catch (error) {
      console.error('게시글 업로드 실패:', error);
      alert('게시글 업로드에 실패하였습니다.');
    }
  };
  // 취소 버튼 클릭 시 게시판 페이지로 이동
  const handleCancel = () => {
    navigate('/board');
};

  return (
    <div className="align write_wrap">
      <div className="write_container">
          <h2>글 제목</h2>
          <input
          type="text"
          className="input-title"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          />
          <h3 style={{marginTop: "30px"}}>내용</h3>
          <textarea
          className="input-content"
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="upload-buttons">
  <label htmlFor="file-input" className="custom-addfile">
    파일 첨부
    <input
      id="file-input"
      type="file"
      style={{ display: 'none' }}
      onChange={handleFileUpload}
    />
  </label>
  <button className="custom-upload-button" onClick={handleUpload}>
    업로드
  </button>
  <button className="custom-cancel-button" onClick={handleCancel}>
    취소
  </button>
</div>
      </div>
);
}

export default Write;
import { useRef, useState } from "react";
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import './screens.css';

const KYC = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(selected.type)) {
      alert("Only JPG, PNG or PDF allowed");
      return;
    }

    setFile(selected);
    console.log("Selected file:", selected);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a document");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", file);

      const res = await api.uploadKyc(formData); // your API
      console.log("Upload success:", res);

      alert("KYC uploaded successfully... Please wait for verification.");
      navigate('/account'); 
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="page-transition">
      <Header title="KYC Verification" />

      <div className="kyc-container">
        <h2 className="kyc-title">
          Verify your Documents to join Cash Contests
        </h2>

        <p className="kyc-subtitle">
          This helps us to ensure you're<br />from a restricted state
        </p>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />

        {/* SAME DESIGN - just added onClick */}
        <div className="upload-box" onClick={handleClickUpload}>
          <Upload className="upload-icon" />
          <div className="upload-text">
            {file ? file.name : `Click to upload your documents`}
          </div>
        </div>

        {/* SAME BUTTON - just added onClick */}
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default KYC;
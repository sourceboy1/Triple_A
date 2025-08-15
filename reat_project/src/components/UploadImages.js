import React, { useState } from 'react';
import api from '../Api'; // ✅ Use centralized API config

const UploadImage = ({ productId }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);
    formData.append('product', productId);

    try {
      const response = await api.post('upload-images/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image uploaded successfully:', response.data);
      // Optionally, update UI or state after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Image description"
      />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default UploadImage;

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const params = useParams()
    const [id, setId] = useState(params.id);


    const handleFileChange = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };


    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                await axios.post(process.env.REACT_APP_SERVER_URL + '/upload/' + id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Изображение успешно загружено');
            } catch (error) {
                console.error(error);
            }
            window.location.reload()
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <input type="file" onChange={handleFileChange} className='form-control form-control-sm'
                style={{ backgroundColor: "rgba(255, 255, 255, .55)" }} />
            <button onClick={handleUpload} className='btn'>Загрузить</button>
        </div>
    );
}

export default ImageUpload;

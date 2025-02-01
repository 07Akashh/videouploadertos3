import React, { useState } from 'react';
import { uploadVideoResource } from '../services/upload';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VideoUploader = () => {
    const [video, setVideo] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [level, setLevel] = useState('beginner');
    const [accessLevel, setAccessLevel] = useState(['basic']);
    const [error, setError] = useState('');

    const handleFileChange = (event, type) => {
        const file = event.target.files[0] || null;

        // Basic validation for file selection
        if (!file) return;

        // Video validation (limit size to 100MB)
        if (type === 'video' && file.size > 100 * 1024 * 1024) {
            setError('Video file size should be less than 100MB.');
            return;
        }

        // Thumbnail validation (limit size to 5MB)
        if (type === 'image' && file.size > 5 * 1024 * 1024) {
            setError('Thumbnail file size should be less than 5MB.');
            return;
        }

        setError('');

        if (type === 'video') setVideo(file);
        else setThumbnail(file);
    };

    const handleAccessLevelChange = (event) => {
        const { value, checked } = event.target;
        setAccessLevel((prev) =>
            checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleUpload = async () => {
        if (!video || !thumbnail) {
            setError('Please select both a video and a thumbnail.');
            toast.error('Please select both a video and a thumbnail.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await uploadVideoResource(token, video, thumbnail, { title, level, accessLevel });
            toast.success('✅ Upload successful!');
        } catch (error) {
            setError('Upload failed. Please try again.');
            toast.error('❌ Upload failed.');
            console.error('Upload Error:', error);
        }

        setLoading(false);
    };

    return (
        <div className="upload-container">
            <h2>📹 Upload Video Resource</h2>

            <input type="text" placeholder="🔑 Enter Token" value={token} onChange={(e) => setToken(e.target.value)} />

            <input type="text" placeholder="📌 Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>📚 Select Level:</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
            </select>

            <label>🔓 Access Level:</label>
            <div className="checkbox-group">
                {["basic", "standard", "premium"].map((level) => (
                    <label key={level}>
                        <input
                            type="checkbox"
                            value={level}
                            checked={accessLevel.includes(level)}
                            onChange={handleAccessLevelChange}
                        />
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </label>
                ))}
            </div>

            <label>🎬 Video:</label>
            <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} />

            <label>🖼️ Thumbnail:</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />

            {thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail preview" />}
            {video && <p>🎞️ Selected Video: {video.name}</p>}

            {error && <p className="error">{error}</p>}

            <button onClick={handleUpload} disabled={loading}>
                {loading ? '🚀 Uploading...' : '⬆️ Upload'}
            </button>
        </div>
    );
};

export default VideoUploader;

import axios from 'axios';
import { toast } from 'react-toastify';

const baseUrl = 'https://backend.itzlingo.com';

// const adminToken = localStorage.getItem('adminToken');

const getFileExtension = (file) => file.name.split('.').pop()?.toLowerCase() || '';

export async function uploadVideoResource(token, video, thumbnail, videoData) {
    try {
        const videoUploadResponse = await axios.post(`${baseUrl}/v1/file/uploadurl`, {
            extension: getFileExtension(video),
            size: video.size
        }, { headers: { Authorization: `Bearer ${token}` } });

        const thumbnailUploadResponse = await axios.post(`${baseUrl}/v1/file/resource/uploadurl`, [{
            extension: getFileExtension(thumbnail)
        }], { headers: { Authorization: `Bearer ${token}` } });

        const { url: videoUploadUrl, key: videoKey } = videoUploadResponse.data.data;
        const { url: thumbnailUploadUrl, key: thumbnailKey } = thumbnailUploadResponse.data.data[0];


        console.log(videoUploadUrl,);
        console.log('ewfewfwe',thumbnailUploadUrl);

        let videoUploaded = false;
        let thumbnailUploaded = false;
    
        try {
            // Upload Video
            const videoResponse = await axios.put(videoUploadUrl, video, {
                headers: { 'Content-Type': video.type }
            });
            if (videoResponse.status === 200) {
                videoUploaded = true;
                console.log("✅ Video uploaded successfully!");
            } else {
                console.error("❌ Video upload failed with status:", videoResponse.status);
            }
    
            // Upload Thumbnail
            const thumbnailResponse = await axios.put(thumbnailUploadUrl, thumbnail, {
                headers: { 'Content-Type': thumbnail.type }
            });
            if (thumbnailResponse.status === 200) {
                thumbnailUploaded = true;
                console.log("✅ Thumbnail uploaded successfully!");
            } else {
                console.error("❌ Thumbnail upload failed with status:", thumbnailResponse.status);
            }
    
        } catch (error) {
            console.error("❌ Error during upload:", error);
            toast.error("Upload failed. Please try again.");
        }
    
        if (videoUploaded && thumbnailUploaded) {
            toast.success("🎉 Both video and thumbnail uploaded successfully!");
        } else if (videoUploaded) {
            toast.warn("⚠️ Video uploaded, but thumbnail failed!");
        } else if (thumbnailUploaded) {
            toast.warn("⚠️ Thumbnail uploaded, but video failed!");
        } else {
            toast.error("❌ Both video and thumbnail upload failed.");
        }
    

        await axios.post(`${baseUrl}/v1/video`, [{
            title: videoData.title,
            thumbnailKey,
            videoKey,
            level: videoData.level,
            accessLevel: videoData.accessLevel,
            thumbnailExtension: getFileExtension(thumbnail),
            videoExtension: getFileExtension(video)
        }], { headers: { Authorization: `Bearer ${token}` } });

        console.log('Video and thumbnail successfully uploaded!');
    } catch (error) {
        console.error('Error uploading video resource:', error);
    }
}

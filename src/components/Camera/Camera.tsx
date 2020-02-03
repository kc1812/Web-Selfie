import React, { useRef, useState } from 'react';
import { useUserMedia } from '../../hooks/useUserMedia';
import SelfieImage from '../../assets/images/selfie.jpg';

const CAPTURE_OPTIONS = {
    audio: false,
    video: { facingMode: 'user', width: 640 },
};

function Camera() {
    console.log("camera component");
    const [imageCaptured, setImageCaptured] = useState<boolean>(false);

    const videoRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const imgRef = useRef<any>(null);
    const [mediaStream, streamOpenStatus, setStreamOpenStatus, streamError, cameraPermission] = useUserMedia(CAPTURE_OPTIONS);

    if (streamError) {
        console.log("Error in mdediaStream", streamError);
    }

    if (streamOpenStatus && mediaStream && videoRef.current) {
        console.log("assign mediaStream", mediaStream);
        videoRef.current.srcObject = mediaStream;
    }

    function handleCanPlay() {
        videoRef.current.play();
    }

    function handleCapture() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        canvas.getContext('2d').drawImage(video, 0, 0);
        imgRef.current.src = canvas.toDataURL('image/webp', 1);
        
        handleStopStreaming();
        setImageCaptured(true);
    }

    function handleStartStreaming() {
        setStreamOpenStatus(true);
    }

    function handleStopStreaming() {

        setStreamOpenStatus(false);
        videoRef.current.srcObject = null;
    }

    function handleRetake() {
        
        handleStartStreaming();
        setImageCaptured(false);
        imgRef.current.src = "";
    }
    return (
        <div>
            <h1>Take Selfie</h1>
            {!cameraPermission && <img style={{ display: "block", width: "640px", height: "480px" }} src={SelfieImage} alt="initial" />}
            {!cameraPermission && <button onClick={handleStartStreaming}>Click Selfie</button>}

            {cameraPermission && <video style={{ display: imageCaptured ? 'none' : 'block' }} ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />}
            {cameraPermission && <img style={{ display: !imageCaptured ? 'none' : 'block' }} ref={imgRef} src="" alt="test" />}
            {cameraPermission && !imageCaptured && <button onClick={handleCapture} >Capture</button>}
            {cameraPermission && imageCaptured  && <button onClick={handleRetake}>Retake</button>}
            {cameraPermission && imageCaptured  && <button >Looks Good</button>}
            {cameraPermission && <canvas ref={canvasRef} style={{ display: "none" }} />}


        </div>

    );
}

export default Camera;
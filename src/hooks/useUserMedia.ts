import { useEffect, useState } from 'react';

export function useUserMedia(constraints: any) {
    const [mediaStream, setMediaStream] = useState<any>(null);
    const [streamOpenStatus, setStreamOpenStatus] = useState<boolean>(false);
    const [streamError, setStreamError] = useState<any>(null);
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);

    useEffect(() => {
        console.log("useUserMedia useEffect called");
        function enableMediaStream() {

            try {
                let nav: any = navigator;
                nav.getMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
                const hasGetUserMedia = () => {
                    return !!(nav.mediaDevices &&
                        nav.mediaDevices.getUserMedia);
                };
    
                if (hasGetUserMedia()) {
                    console.log("navigator.mediaDevices.getUserMedia supported");
                    nav.mediaDevices.getUserMedia(constraints)
                        .then((stream: any) => {
                            streamSuccessHandler(stream);
                        })
                        .catch((error: any) => {
                            console.log('Error:001 in navigator.mediaDevices.getUserMedia', error);
                            streamFailureHandler(error);
                        });
                } else if (nav.getMedia) {
                    console.log("old navigator.getUserMedia is  supported");
                    nav.getMedia(constraints, (stream: any) => {
                        streamSuccessHandler(stream);
                    }, (error: any) => {
                        console.log('Error:002 in navigator.getUserMedia', error);
                        streamFailureHandler(error);
                    });
                } else {
                    console.log(" Neither navigator.getUserMedia nor navigator.mediaDevices.getUserMedia supported");
                    streamFailureHandler(new Error("getUserMedia not supported"));
                }
    
            } catch (error) {
                streamFailureHandler(error);
            }
    
        }
        
        function disableMediaStream() {
            if (mediaStream) {
                mediaStream.getTracks().forEach((track: any) => {
                    track.stop();
                });
                setMediaStream(null);
            }
        }

        if (streamOpenStatus) {
            //start stream
            console.log('Camera start triggered');
            enableMediaStream();
        } else {
            //stop stream
            console.log('Camera stop triggered');
            disableMediaStream();

        }

    }, [streamOpenStatus, constraints]);

    useEffect(() => {
        return function cleanup() {
            mediaStream.getTracks().forEach((track: any) => {
                track.stop();
            });
        }
    }, []);



    function streamSuccessHandler(stream: any) {
        setCameraPermission(true);
        setMediaStream(stream);

    }

    function streamFailureHandler(error: any) {
        console.log("error object0", error);
        setCameraPermission(false);
        setStreamError(error);

    }

    console.log("returned mediaStream", mediaStream);
    return [mediaStream, streamOpenStatus, setStreamOpenStatus, streamError, cameraPermission];
}
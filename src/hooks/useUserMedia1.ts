import { useEffect, useState } from 'react';

export function useUserMedia(constraints: any) {
    const [mediaStream, setMediaStream] = useState<any>(null);

    useEffect(() => {

        function enableMediaStream() {

            console.log("new stream");
            let nav: any = navigator;
            nav.getMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
            const hasGetUserMedia = () => {
                return !!(nav.mediaDevices &&
                    nav.mediaDevices.getUserMedia);
            };

            if (hasGetUserMedia()) {
                console.log("navigator.mediaDevices.getUserMedia supported");
                nav.mediaDevices.getUserMedia(constraints)
                    .then((stream:any) => {
                        console.log("new stream",stream);
                        setMediaStream(stream);
                    })
                    .catch((error:any) => {
                        console.log('Error:001 in navigator.mediaDevices.getUserMedia', error);
                    });
            } else if (nav.getMedia) {
                console.log("old navigator.getUserMedia is  supported");
                nav.getMedia(constraints, (stream: any) => {
                    console.log("new stream",stream);
                    setMediaStream(stream);
                }, (error: any) => {
                    console.log('Error:002 in navigator.getUserMedia', error);
                });
            } else {
                console.log(" Neither navigator.getUserMedia nor navigator.mediaDevices.getUserMedia supported");
            }

        }

        if (!mediaStream) {
            enableMediaStream();
            console.log("enable stream");
        } else {
            console.log("cleanUp");
            return function cleanup() {
                mediaStream.getTracks().forEach((track: any) => {
                    track.stop();
                });
            }
        }
    }, [mediaStream, constraints]);
    console.log("final stream",mediaStream);
    return [mediaStream,setMediaStream];
}
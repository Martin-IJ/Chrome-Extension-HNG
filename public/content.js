console.log("Hi, I have been injected whoopie!!!")

var recorder = null
function onAccessApproved(stream) {
    recorder = new MediaRecorder(stream);
    let videoChunks = [];
    let audioChunks = [];
    console.log("videoChunks:", videoChunks);
    recorder.start(1000);
    recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
            if (track.readyState === "live") {
                track.stop()
            }
        })
    }
    recorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
            console.log("inside event size");
            if (event.data.type === 'video/x-matroska;codecs=avc1') {
                console.log("inside type condition")
                videoChunks.push(event.data);
                console.log("eventdata:", event.data);
            } else if (event.data.type === 'audio/webm') {
                audioChunks.push(event.data);
            }
            else{
                console.log("not match")
            }
        }
        console.log("video-chunks:", videoChunks);
        let recordedBlob = event.data;
        console.log("recordedBlob has been assigned")
        console.log(recordedBlob)
    }
}
// this is 
function sendChunkToBackend(blob) {
    const formData = new FormData();
    formData.append('file', blob, 'screen-recording.webm');
    fetch('https://example.com/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Chunk sent successfully:', data);
    })
    .catch(error => {
      console.error('Error sending chunk:', error);
    });
  }
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "request_recording") {
        console.log("requesting recording")
        sendResponse(`processed: ${message.action}`);
        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 9999999999,
                height: 9999999999
            }
        }).then((stream) => {
            onAccessApproved(stream)
        })
    }
    if (message.action === "stopvideo") {
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if (!recorder) return console.log("no recorder")
        recorder.stop();
    }
})
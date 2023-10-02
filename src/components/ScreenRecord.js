import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const ScreenRecord = ({
  screen,
  audio,
  video,
  downloadRecordingPath,
  downloadRecordingType,
  emailToSupport,
}) => {
  const RecordView = () => {
    const {
      status,
      startRecording: startRecord,
      stopRecording: stopRecord,
      mediaBlobUrl,
    } = useReactMediaRecorder({ screen: true, audio, video });

    const startRecording = () => {
      if (status !== "recording") {
        startRecord();
      }
    };

    const stopRecording = () => {
      if (status === "recording") {
        stopRecord();
      }
    };

    const viewRecording = () => {
      window.open(mediaBlobUrl, "_blank").focus();
      console.log(mediaBlobUrl);
    };

    const downloadRecording = () => {
      const pathName = `${downloadRecordingPath}.${downloadRecordingType}`;
      try {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // For IE
          window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
        } else {
          // For Chrome
          const link = document.createElement("a");
          link.href = mediaBlobUrl;
          link.download = pathName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const mailRecording = () => {
      try {
        window.location.href = `mailto:${emailToSupport}?subject=Screen recording&body=Hello%20Team,%0D%0A%0D%0A${mediaBlobUrl}`;
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          {status && status !== "stopped" && (
            <p className="text-base">
              Screen Recording Status: {status && status.toUpperCase()}
            </p>
          )}
          {status && status === "recording" && (
            <span className="bg-red-500 animate-ping w-[5px] h-[5px] rounded p-1 ml-2"></span>
          )}
        </div>
        <div className="flex justify-end">
          {status && status !== "recording" && (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-full ml-2"
              onClick={startRecording}
            >
              {mediaBlobUrl ? "Restart Recording" : "Start Recording"}
            </button>
          )}
          {status && status === "recording" && (
            <button
              className="px-3 py-1 bg-red-500 text-white rounded-full ml-2"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
          )}
          {mediaBlobUrl && status && status === "stopped" && (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-full ml-2"
              onClick={viewRecording}
            >
              View
            </button>
          )}
          {downloadRecordingType &&
            mediaBlobUrl &&
            status &&
            status === "stopped" && (
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-full ml-2"
                onClick={downloadRecording}
              >
                Download
              </button>
            )}
          {emailToSupport && mediaBlobUrl && status && status === "stopped" && (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded-full ml-2"
              onClick={mailRecording}
            >
              Email To Support
            </button>
          )}
        </div>
      </div>
    );
  };

  return <div>{RecordView()}</div>;
};

export default ScreenRecord;

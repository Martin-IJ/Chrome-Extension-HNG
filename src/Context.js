import React, { useContext } from "react";
// import axios from "axios";
import { useReactMediaRecorder } from "react-media-recorder";

const AppContext = React.createContext();

const AppProvider = ({
  children,
  screen,
  audio,
  video,
  downloadRecordingPath,
  downloadRecordingType,
  emailToSupport,
}) => {
  const {
    status,
    startRecording: startRecord,
    stopRecording: stopRecord,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    screen: {
      audio: true,
      video: true,
    },
  });

  // ==== Change the file format to MP4 =====
  // npm install react-media-recorder @extendable/media-recorder
  // useReactMediaRecorder({
  //   video: true,
  //   audio: true,
  //   onStop: (blobUrl) => {
  //     // Handle the recorded MP4 file here
  //     console.log("Recorded MP4 file:", blobUrl);
  //   },
  //   mediaRecorderOptions: {
  //     mimeType: "video/mp4", // Set the desired MIME type for MP4 format
  //   },
  // });

  // ======Target all Window to screen record========
  // screen: true, audio, video

  // ======Target the just Window to screen record========
  // mediaStreamConstraints: {
  //   video: {
  //     mediaSource: 'window',
  //   },
  //   audio,
  // },

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

  // Converting the mediaBlob data to base 64 string
  const convertMediaToBase64 = (mediaBlobUrl) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(",")[1]); // Extract base64 data from the result
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = () => {
        reject("Failed to load media data.");
      };
      xhr.open("GET", mediaBlobUrl);
      xhr.send();
    });
  };

  // Sending the converted media data to the server
  const sendMediaDataToServer = async (mediaBlobUrl) => {
    try {
      // Convert media data to Base64
      const base64Data = await convertMediaToBase64(mediaBlobUrl);

      // Send the Base64 data to the server
      const response = await fetch("/api/save-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Data }),
      });

      if (response.ok) {
        // Media data successfully sent to the server
      } else {
        // Handle errors
      }
    } catch (error) {
      console.error("Error sending media data:", error);
    }
  };

  // const fetchMediaData = async () => {
  //   try {
  //     const response = await fetch(mediaBlobUrl);

  //     if (response.ok) {
  //       const mediaData = await response.blob();

  //       // Send the media data to the backend API
  //       const formData = new FormData();
  //       formData.append("mediaFile", mediaData);

  //       // Use axios or fetch to send the data to your backend endpoint
  //       await axios.post("/api/upload-media", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });

  //       console.log("Media data sent to the backend.");
  //     } else {
  //       console.error("Failed to fetch media data");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or sending media data:", error);
  //   }
  // };
  // // Call the fetchMediaData function when needed
  // fetchMediaData();

  // const sendMediaDataToServer = async (mediaBlobUrl) => {
  //   try {
  //     const response = await fetch('/api/save-media', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ mediaBlobUrl }),
  //     });

  //     if (response.ok) {
  //       // Media data successfully sent to the server
  //     } else {
  //       // Handle errors
  //     }
  //   } catch (error) {
  //     console.error('Error sending media data:', error);
  //   }
  // };

  return (
    <AppContext.Provider
      value={{
        startRecording,
        stopRecording,
        viewRecording,
        downloadRecording,
        mailRecording,
        status,
        sendMediaDataToServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };

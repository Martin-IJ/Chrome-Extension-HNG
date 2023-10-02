document.getElementById('startRecordingButton').addEventListener('click', async () => {
    // Request screen sharing permission
    try {
      const tab = await chrome.scripting.executeScript({
        target: { tabId: chrome.tabs.getCurrent().id },
        function: requestScreenSharing,
      });
      
      // Start recording logic here
    } catch (error) {
      console.error('Error requesting screen sharing permission:', error);
    }
  });
  
  // Function to request screen sharing permission
  function requestScreenSharing() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        // Handle the stream for recording
        // Start recording logic here
      })
      .catch((error) => {
        console.error('Error requesting screen sharing permission:', error);
      });
  }
  
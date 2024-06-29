export function speechRecognition(recordedAudio: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!recordedAudio) {
      reject("No recorded audio provided");
      return;
    }
    console.log("Sending recording to server");
    const formData = new FormData();
    formData.append("audioFile", recordedAudio, "recording.webm");

    fetch("http://localhost:5000/upload_audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Success: 200 response code");
          return response.json();
        } else {
          reject("Request failed with status: " + response.status);
          return null; // Prevent further processing in the promise chain
        }
      })
      .then((data) => {
        if (data) {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

export function uploadImageToFirebase(file: File) {
  return new Promise((resolve, reject) => {
    const imageName = new Date().getTime() + file.name;
    const storageRef = ref(storage, imageName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      }
    );
  });
}

export function uploadVideoToFirebase(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate if the file is a video
    if (!file.type.startsWith("video/")) {
      reject(new Error("Invalid file type. Please upload a video."));
      return;
    }

    const videoName = `videos/${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, videoName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress.toFixed(2)}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Video available at:", downloadURL);
          resolve(downloadURL);
        } catch (error) {
          console.error("Failed to get download URL:", error);
          reject(error);
        }
      }
    );
  });
}

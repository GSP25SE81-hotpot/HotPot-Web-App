import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";

function uploadImageToFirebase(file: File) {
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

export default uploadImageToFirebase;

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebaseConfig";

async function upload(uri: string, name: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const imageref = ref(storage, `images/${name}`);
  const result = await uploadBytes(imageref, blob);
  const downloadUrl = await getDownloadURL(imageref);
  const metadata = result.metadata;

  return { downloadUrl, metadata };
}

export default { upload };
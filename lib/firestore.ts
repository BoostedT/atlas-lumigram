import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';


type Post = {
  imageUrl: string;
  caption: string;
  createdAt: Date;
  createdBy: string;
};

const posts = collection(db, 'posts');

async function addPost(post: Post) {
  await addDoc(posts, post);
}

export default { 
  addPost 
};
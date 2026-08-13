import { USE_APPWRITE, storage, ID, BUCKETS } from "./appwrite/appwrite";

// In mock mode we just keep an object URL in memory so <img> previews work;
// nothing is actually persisted anywhere. Swap VITE_USE_APPWRITE=true to
// upload for real once your buckets exist.

export async function uploadFile(bucketKey, file) {
  const bucketId = BUCKETS[bucketKey] || bucketKey;
  if (USE_APPWRITE) {
    const result = await storage.createFile(bucketId, ID.unique(), file);
    return { fileId: result.$id, previewUrl: storage.getFilePreview(bucketId, result.$id).href };
  }
  return { fileId: `mock-${Date.now()}`, previewUrl: URL.createObjectURL(file) };
}

export async function deleteFile(bucketKey, fileId) {
  const bucketId = BUCKETS[bucketKey] || bucketKey;
  if (USE_APPWRITE) {
    return storage.deleteFile(bucketId, fileId);
  }
  return true;
}

export function getFilePreviewUrl(bucketKey, fileId) {
  const bucketId = BUCKETS[bucketKey] || bucketKey;
  if (USE_APPWRITE) {
    return storage.getFilePreview(bucketId, fileId).href;
  }
  return fileId; // in mock mode fileId is already an object URL
}

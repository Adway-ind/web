const supabase = require("./supabase");

/**
 * Upload a buffer to Supabase Storage and return the public URL.
 * @param {string} bucket - Storage bucket name (covers, gallery, blogs, logos, resumes)
 * @param {string} fileName - File name to store as
 * @param {Buffer} buffer - File content buffer
 * @param {string} contentType - MIME type (e.g. 'image/webp', 'application/pdf')
 * @returns {string} Public URL of the uploaded file
 */
async function uploadToStorage(bucket, fileName, buffer, contentType) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage.
 * @param {string} bucket - Storage bucket name
 * @param {string} fileName - File name to delete
 */
async function deleteFromStorage(bucket, fileName) {
  await supabase.storage.from(bucket).remove([fileName]);
}

module.exports = { uploadToStorage, deleteFromStorage };

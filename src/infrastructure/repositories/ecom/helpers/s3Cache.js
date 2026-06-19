import mongoose from "mongoose";

let cachedS3Url = null;

export async function getS3DisplayUrl() {
  if (cachedS3Url !== null) return cachedS3Url;

  const S3Model = mongoose.model("S3BucketSetting");
  const settings = await S3Model.findOne().select("s3display_url").lean();
  cachedS3Url = settings?.s3display_url || "";
  return cachedS3Url;
}

export function clearS3Cache() {
  cachedS3Url = null;
}

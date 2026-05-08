import S3BucketRepository from "../infrastructure/repositories/chit/super/s3BucketSettingRepository.js";

export default async function s3Helper() {
  try {
    const s3Repo = new S3BucketRepository()

    const s3settings = await s3Repo.getSetting();

    if (!s3settings) {
      throw new Error("S3 configuration not found");
    }

    return {
      s3key: s3settings?.s3key || process.env.AWS_ACCESS_KEY_ID,
      s3secret: s3settings?.s3secret || process.env.AWS_SECRET_ACCESS_KEY,
      s3bucket_name: s3settings?.s3bucket_name || process.env.AWS_S3_BUCKET,
      s3display_url: s3settings?.s3display_url || process.env.AWS_DISPLAY_URL,
      region: s3settings?.region || process.env.AWS_REGION,
    };
  } catch (error) {
    console.error("Error in s3Helper:", error);
    throw error;
  }
}

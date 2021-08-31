import asyncHandler from '../middleware/async';
import { AwsS3 } from '../utils/awsS3';

/**
 * @desc    Upload file to aws s3 - Onboarding
 * @route   POST /api/v2/file/onboarding/upload-url
 * @access  Private
 */
export const uploadFileForOnboarding = asyncHandler(async (req, res, next) => {
  const { fileName, fileType, fileExtension } = req.body;

  let fileKey = '';
  if (fileType === 'onboarding')
    fileKey = `${req.profile._id}/onboarding/${fileName}.${fileExtension}`;
  else fileKey = `${req.profile._id}/doc/${fileName}.${fileExtension}`;

  const params = {
    Bucket: 'employee-op-bucket-777',
    ContentType: fileExtension,
    Expires: 60 * 60,
    Key: fileKey,
  };

  const url = await new AwsS3().getSignedUrl('putObject', params);

  res.status(200).json({
    success: true,
    message: `Created PUT url for file upload for ${fileName}`,
    data: {
      fileKey,
      url,
    },
  });
});

/**
 * @desc    Upload file to aws s3 - Work-order
 * @route   POST /api/v2/file/work-order/upload-url
 * @access  Private
 */
export const uploadFileForWorkOrder = asyncHandler(async (req, res, next) => {
  const { fileName, fileType, fileExtension } = req.body;

  let fileKey = `${req.user.user_id}/docs/${fileType}/${fileName}.${fileExtension}`;

  const params = {
    Bucket: 'employee-op-bucket-777',
    ContentType: 'application/pdf',
    Expires: 60 * 60,
    Key: fileKey,
  };

  const url = await new AwsS3().getSignedUrl('putObject', params);

  res.status(200).json({
    success: true,
    message: `Created PUT url for file upload for ${fileName}`,
    data: {
      fileKey,
      url,
    },
  });
});

/**
 * @desc    Get file from aws s3 - Everything
 * @route   GET /api/v2/file/work-order/get-url
 * @access  Private
 */
export const getFileForEverything = asyncHandler(async (req, res, next) => {
  const { filePath } = req.query;
  const params = {
    Bucket: 'employee-op-bucket-777',
    Expires: 60 * 60,
    Key: `${filePath}`,
  };

  const url = await new AwsS3().getSignedUrl('getObject', params);

  // res.redirect(url)
  res.status(200).json({
    success: true,
    message: `Created GET url to get the file`,
    data: {
      url,
    },
  });
});

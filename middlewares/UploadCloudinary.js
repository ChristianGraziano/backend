const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

const cloudStorageAvatarUser = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "UsersAvatarImage",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const cloudStorageLogo = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "AssociationsLogo",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const AvatarUserImg = multer({ storage: cloudStorageAvatarUser });
const LogoAssociationImg = multer({ storage: cloudStorageLogo });

module.exports = (AvatarUserImg, LogoAssociationImg);

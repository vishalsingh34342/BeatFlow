const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

const uploadMusicToCloud = async (file) => {

  const uploadFile = await toFile(
    file.buffer,
    file.originalname
  );

  const result = await imageKit.files.upload({
    file: uploadFile,
    fileName: file.originalname,
    folder: "/music"
  });

  return result.url;
};

module.exports = {
  uploadMusicToCloud
};
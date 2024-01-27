function setFolderName(name) {
  return function (req, res, next) {
    req.folderName = name;
    next();
  };
}
module.exports = setFolderName;

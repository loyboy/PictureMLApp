var Jimp = require("jimp");
var mkdirp = require("mkdirp");
const fs = require("fs");

var imagetypes = { "image/jpeg": ".jpg", "image/png": ".png" };
var cropSize = { width: 20, height: 20 };

class ImageCropper {
  constructor(dataobject) {
    this.data = dataobject;
  }

  SendToDirectory(writedirectory, readdirectory) {
    
    for (var k in this.data.photos) {
      var points = this.getPoints(k, this.data.points);
      if (points !== undefined && points !== null) {
        points.forEach(async (point) => {
            var photo = this.data.photos[k]; //get one photo
            //create a path to store the Cropped file
            var dir = writedirectory + "/" + photo.filename;
            try {
              mkdirp(dir, function(err) {
                if (err) console.error(err);
                else console.log("Done creating directory!"); //Successfully created the Path
              });
            } catch (err) {
              console.log(err);
            }
            var thepath = readdirectory + photo.path;
            await this.ReadAndWriteImage(thepath, photo, dir, point)
        })
      }
    }
   
  }

  /**
   * ThePath - The default path where the Image file is to be read
   *  Photo - This is the photograph file
   *  Dir - This is the directory of the Cropped file where it will be saved
   *  Point - This is the point to start to crop
   */
  async ReadAndWriteImage(thepath, photo, dir, point) {
    if (fs.existsSync(thepath + imagetypes[photo.mimetype])){
      return Jimp.read(thepath + imagetypes[photo.mimetype])
        .then(pic => {
           pic
            .crop(
              parseInt(point.x),
              parseInt(point.y),
              cropSize.width,
              cropSize.height
            )
            .write(dir + "/cropped_" + point.id + imagetypes[photo.mimetype]);
        })
        .then(data => data)
        .catch(err => {
          console.error(err);
      })
    }
    else{
          console.log("File does not exist: " + thepath + imagetypes[photo.mimetype])
    }
  }

  getPoints(indexOfPhoto, testArray) {
    let stack = []
    for (var i = 0; i < testArray.length; i++) {
      var _index = Number(testArray[i].slide) - 1;
      if (_index === Number(indexOfPhoto)) {
        stack.push(testArray[i])
      }
    }
     return stack
  }
}

module.exports = ImageCropper;

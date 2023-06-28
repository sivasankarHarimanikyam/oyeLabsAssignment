const request = require("request");

function getGoogleHomePage() {
  return new Promise((resolve, reject) => {
    request("http://www.google.com", (err, response, body) => {
      if (err) {
        console.log({ error: err });
        reject(err);
      }
      console.log("statusCode: ", response && response.statusCode);
      console.log({ body });
      resolve(body);
    });
  });
}

getGoogleHomePage()
  .then((result) => console.log("RESULT==>", result))
  .catch((error) => console.log("ERROR==>", error));

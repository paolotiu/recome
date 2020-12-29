exports.handler = async function (event, context, callback) {
  // // your server-side functionality
  // const redirect_uri =
  //   process.env.REDIRECT_URI || "http://localhost:57991/callback";
  // const response = {
  //   statusCode: 200,
  //   headers: {
  //     Location: "https://google.com",
  //   },
  // };
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};

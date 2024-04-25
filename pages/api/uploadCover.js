import formidable from "formidable";
import AWS from "aws-sdk";
import fs from "fs";
import {HttpsProxyAgent} from 'https-proxy-agent';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = process.env.PROXY_ADDR;
const agent = new HttpsProxyAgent(proxy);

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
//   httpOptions: {
//     agent: agent
//   }
// });

export default async function handle(req, res) {
  const { method } = req;

  if (method == 'POST') {
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(400).json({ error: err.message });
        res.end();
        return;
      }
      res.status(200).json({ fields, files });
      res.end();

      const client = new AWS.S3({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        httpOptions: {
          agent: agent
        }
      });
      const ext = files.file[0].originalFilename.split('.').pop();
      const newFilename = Date.now() + '.' + ext;
      const filepath = files.file[0].filepath;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: newFilename,
        Body: fs.createReadStream(filepath),
        ACL: 'public-read',
      };
      client.upload(params, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(data.Location);
      });
    });
  }
}
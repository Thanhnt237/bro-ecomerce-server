const common = require("../../../common/commonFunction");
const { TABLE_NAME } = require("../../../config/tablename");
const _ = require('lodash');
const { finished } = require('stream/promises');

const Mutation = {
    singleUpload: async (parent, { file }) => {
        const { createReadStream, filename, mimetype, encoding } = await file;

        // Invoking the `createReadStream` will return a Readable Stream.
        // See https://nodejs.org/api/stream.html#stream_readable_streams
        const stream = createReadStream();

        // This is purely for demonstration purposes and will overwrite the
        // local-file-output.txt in the current working directory on EACH upload.
        const out = require('fs').createWriteStream('local-file-output.txt');
        stream.pipe(out);
        await finished(out);

        return { filename, mimetype, encoding };
    },

    multipleUpload: async (parent, { file }) => {
        let url = [];
        for (let i = 0; i < file.length; i++) {
            const { createReadStream, filename, mimetype } = await file[i];
            const stream = createReadStream();
            const assetUniqName = fileRenamer(filename);
            const pathName = path.join(__dirname,   `./upload/${assetUniqName}`);
            await stream.pipe(fs.createWriteStream(pathName));
            const urlForArray = `http://localhost:4000/${assetUniqName}`;
            url.push({ url: urlForArray });
        }
        return url;
    },
};

module.exports = Mutation;

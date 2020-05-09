import { config } from 'dotenv';
import * as mongoose from 'mongoose';
import app from './app';
require('source-map-support').install();

config();

const mongoUri = process.env.MONGO_URI;

if(!mongoUri) {
  console.error('MongoDB URI must be set.');
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(_ => {
  const port: number = +process.env.PORT || 3000;
  app.listen(port);

  console.log(`Server running on port ${port}`);
})
.catch(e => {
  console.error("Fail to connect with MongoDB.");
  console.error(e)
});

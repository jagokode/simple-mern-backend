import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

const DB_URL = `mongodb://127.0.0.1:27017/ExpressCrudProject`;

const connection = () => {
	mongoose
		.connect(DB_URL)
		.then(() => console.log('DB connected'))
		.catch((err) => console.log(err));
};

export default connection;

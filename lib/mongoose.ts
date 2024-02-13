import mongoose from 'mongoose';

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(process.env.MONGODB_URL!);
  } catch (error) {
    throw new Error(`Unable to connect to database: ${error}`);
  }
};

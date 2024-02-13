'use server';

import { IThread } from '@/types';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';

export async function createThread(thread: IThread, path: string) {
  try {
    connectToDB();

    const createdThread = await Thread.create(thread);

    await User.findByIdAndUpdate(thread.author, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

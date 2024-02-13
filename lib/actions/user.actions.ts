'use server';

import { IUser } from '@/types';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { revalidatePath } from 'next/cache';

export async function updateUser(userData: IUser, path: string) {
  try {
    connectToDB();

    const { id, username, name, bio, image } = userData;

    await User.findOneAndUpdate(
      { id },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

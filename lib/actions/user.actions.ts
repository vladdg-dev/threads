'use server';

import { IUser } from '@/types';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';

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

export async function fetchUser(id: string) {
  try {
    connectToDB();

    return await User.findOne({ id });
    // .populate({
    //   path: "communities",
    //   model: Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Could not fetch user posts: ${error.message}`);
  }
}
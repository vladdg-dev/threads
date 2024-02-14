'use server';

import { IUser } from '@/types';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { FilterQuery, SortOrder } from 'mongoose';

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

interface FetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}

export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: FetchUsersParams) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, 'i');

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Could not fetch users: ${error.message}`);
  }
}

/**
 * Retrieves activity for a user, including replies to the user's threads.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} - A promise that resolves to an array of replies.
 */
export async function fetchActivity(userId: string): Promise<any> {
  try {
    // Connect to the database
    connectToDB();

    // Find child thread IDs from user threads
    const childThreadIds = (await Thread.find({ author: userId }))
      .flatMap(userThread => userThread.children);

    // Find replies to the user's threads by other users
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id',
    });

    // Return the replies
    return replies;
  } catch (error: any) {
    // Throw an error if fetching activity fails
    throw new Error(`Could not fetch activity: ${error.message}`);
  }
}
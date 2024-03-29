'use server';

import { IComment, IThread } from '@/types';
import { revalidatePath } from 'next/cache';
import { connectToDB } from '../mongoose';

import User from '../models/user.model';
import Thread from '../models/thread.model';
import Community from '../models/community.model';

export async function createThread(thread: IThread, path: string) {
  const { text, author, communityId } = thread;
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 },
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: 'author',
        model: User,
      })
      .populate({
        path: 'community',
        model: Community,
      })
      .populate({
        path: 'children', // Populate the children field
        populate: {
          path: 'author', // Populate the author field within children
          model: User,
          select: '_id name parentId image', // Select only _id and username fields of the author
        },
      });

    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Get the total count of posts

    const threads = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Could not fetch threads: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  try {
    connectToDB();

    const thread = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      }) // Populate the author field with _id and username
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      }) // Populate the community field with _id and name
      .populate({
        path: 'children', // Populate the children field
        populate: [
          {
            path: 'author', // Populate the author field within children
            model: User,
            select: '_id id name parentId image', // Select only _id and username fields of the author
          },
          {
            path: 'children', // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: 'author', // Populate the author field within nested children
              model: User,
              select: '_id id name parentId image', // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Could not fetch thread: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadComment: IComment,
  path: string,
) {
  try {
    connectToDB();

    const originalThread = await Thread.findById(threadComment.parentId);
    if (!originalThread) throw new Error(`Thread not found`);

    const comment = new Thread({
      text: threadComment.text,
      author: threadComment.author,
      parentId: threadComment.parentId,
    });

    const savedThreadComment = await comment.save();

    originalThread.children.push(savedThreadComment._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Could not post comment: ${error.message}`);
  }
}
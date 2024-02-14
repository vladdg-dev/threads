'use server';

import { IComment, IThread } from '@/types';
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

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({
        createdAt: 'desc',
      })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: 'author', model: User })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: User,
          select: '_id name parentId image',
        },
      });

    const totalThreadCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const threads = await threadsQuery.exec();

    const isNext = totalThreadCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Could not fetch threads: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  try {
    connectToDB();

    // TODO: Populate Community
    const thread = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentId image',
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
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
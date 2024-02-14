'use client';

import { FC } from 'react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { usePathname } from 'next/navigation';
import { CommentValidation } from '@/lib/validations/thread';
import Image from 'next/image';
import { IComment } from '@/types';
import { addCommentToThread } from '@/lib/actions/thread.actions';

interface CommentProps {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

const Comment: FC<CommentProps> = ({
  threadId,
  currentUserImage,
  currentUserId,
}) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    const comment: IComment = {
      text: values.thread,
      author: JSON.parse(currentUserId),
      parentId: threadId,
    };
    await addCommentToThread(comment, pathname);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center w-full">
              <FormLabel>
                <Image
                  src={currentUserImage}
                  alt="current user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;

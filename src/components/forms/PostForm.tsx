import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Models } from "appwrite";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isPendingCreatePost } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isPendingUpdatePost } = useUpdatePost();

  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(", ") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    // Check if we are updating an existing post
    if (post && action === "Update") {
      // Attempt to update the post with the new values
      await updatePost({
        ...values,
        postId: post?.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });

      // If the updatePost mutation does not exist, show a toast message
      if (!updatePost) {
        toast({
          title: "Please try again",
        });
      }
      // Navigate to the updated post's page
      return navigate(`/post/${post.$id}`);
    }

    // If creating a new post, call the createPost function with form values and userId
    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    // If the post creation fails, show a toast message
    if (!newPost) {
      toast({
        title: "Please try again",
      });
    } else {
      // On successful post creation, navigate to the home page
      navigate("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className=" shad-textarea custom-scrolbar" {...field} />
              </FormControl>
              <FormMessage className=" shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className=" shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className=" shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" shad-form_label">Add Tags (separated bu comma ", ")</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Art, Learn" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className=" shad-form_message" />
            </FormItem>
          )}
        />
        <div className=" flex gap-4 items-center justify-end">
          <Button type="button" className=" shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className=" shad-button_primary whitespace-nowrap"
            disabled={isPendingCreatePost || isPendingUpdatePost}
          >
            {isPendingCreatePost || isPendingUpdatePost ? "Loading..." : `${action} Post`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;

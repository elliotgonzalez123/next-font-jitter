import { revalidateTag } from "next/cache";

type Post = {
  id: number;
  title: string;
};

export default async function Home() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    cache: "no-store",
    next: {
      tags: ["posts"],
    },
  });
  const data = await res.json();

  //fake DELETE, doesnt actually delete resource see: https://jsonplaceholder.typicode.com/guide/
  async function deletePost(formData: FormData) {
    "use server";
    const id = formData.get("postId");
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    });
    //calling revalidateTag or revalidatePost causes the font to flicker
    revalidateTag("posts");
  }
  return (
    <main className="p-4">
      <h1 className="text-4xl mb-4">Posts:</h1>
      {data.map((post: Post) => (
        <div key={post.id} className="mb-4">
          {post.title}
          <form className="inline ml-4" action={deletePost}>
            <input name="postId" hidden value={post.id} readOnly />
            <button
              className="bg-red-600 text-white rounded-md p-1"
              type="submit"
            >
              Delete
            </button>
          </form>
        </div>
      ))}
    </main>
  );
}

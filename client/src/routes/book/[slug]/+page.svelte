<script>
  import { get, post } from "fetch";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  /**
   * @type {any[]}
   */
  let posts = [];
  let postCommentsMap = {};
  let reply = { enabled: false, commentId: null, replyText: "" };

  onMount(async () => {
    fetchBookPosts();
  });

  async function fetchBookPosts() {
    try {
      const postsData = await get(
        `http://localhost:3000/posts/fetchBookPosts?searchTag=${$page.params.slug}`
      );
      posts = postsData.data || [];
    } catch (e) {}
  }

  /**
   * @param {{ target: HTMLFormElement; }} event
   */
  async function submitPost(event) {
    const formData = new FormData(event.target);
    const formJSON = Object.fromEntries(formData);

    try {
      await post("http://localhost:3000/posts/createPost", {
        ...formJSON,
        // @ts-ignore
        tags: [...(formJSON.tags || []), $page.params.slug],
      });
      fetchBookPosts();
    } catch (e) {}
  }

  async function fetchPostComments(postId) {
    try {
      const postComments = await get(
        `http://localhost:3000/posts/fetchPostComments?postId=${postId}`
      );
      postCommentsMap = {
        ...postCommentsMap,
        [postId]: { loaded: true, data: postComments.data },
      };
    } catch (e) {}
  }
</script>

<div class="p-8">
  <h1>BOOK PAGE!!!</h1>
  <form on:submit|preventDefault={submitPost}>
    <label for="name">Title:</label><br />
    <input type="text" id="title" name="title" class="border" /><br />
    <label for="email">Subject:</label><br />
    <input type="text" id="subject" name="subject" class="border" /><br /><br />
    <input type="submit" value="Submit" />
  </form>

  <div class="rounded-md border">
    {#each posts as post}
      <div class="p-4">
        <div class="text-xl">{post.title}</div>
        {#if reply.commentId === post._id}
          <input class="border" name="reply" bind:value={reply.replyText} />
        {/if}
        <button
          on:click={async () => {
            if (reply.commentId === post._id) {
              await post("http://localhost:3000/authentication/createComment", {
                commentText: "",
                postId: post._id,
              });
            } else {
              reply = { ...reply, enabled: true, commentId: post._id };
            }
          }}
        >
          Reply
        </button>
        {#if postCommentsMap[post._id] && postCommentsMap[post._id].loaded}
          <div class="pl-8">
            {#each postCommentsMap[post._id].data as comment}
              <div>{comment.text}</div>
            {/each}
          </div>
        {/if}
        <button on:click={() => fetchPostComments(post._id)}>
          Comments ({post.commentCount})
        </button>
      </div>
    {/each}
  </div>
</div>

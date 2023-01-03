<script>
  import { onMount } from "svelte";
  import { get } from "fetch";

  let query = "";

  /**
   * @type {any[]}
   */
  let books = [];

  onMount(async () => {
    try {
      const userData = await get("http://localhost:3000/users/getUserData");
      if (userData.status === 403) {
        window.location.href = "/login";
      }
    } catch (e) {}
  });

  async function search() {
    try {
      const response = await get(
        `http://localhost:3000/books/getBooks?title=${query}`
      );

      books = response.data.items.map(
        (/** @type {{ volumeInfo: any; }} */ item) => {
          return item.volumeInfo;
        }
      );
    } catch (e) {}
  }
</script>

<div class="flex flex-col justify-center items-center">
  <div class="w-2/4 border p-10">
    <h1 class="text-lg font-bold mb-6">Welcome to Bookly</h1>
    <!-- {#if} -->
    <p class="mb-6">
      This is the landing page for our book API. Use the search form below to
      find books by title:
    </p>

    <form on:submit|preventDefault={search} class="flex flex-col">
      <input
        type="text"
        bind:value={query}
        placeholder="Search for a book"
        class="w-1/2 border"
      />
      <button type="submit">Search</button>
    </form>

    {#each books as book}
      <a href={`/book/${book.title}`}>{book.title}</a>
    {/each}
  </div>
</div>

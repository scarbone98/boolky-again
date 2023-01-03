<script>
  import { post, get } from "fetch";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  import md5 from "md5";

  let firstName = "";
  let email = "";
  let password = "";
  let error = null;

  onMount(async () => {
    const tokenCheck = await get(
      `http://localhost:3000/authentication/validToken?token=${localStorage.getItem(
        "auth"
      )}`
    );
    if (tokenCheck.valid) {
      goto("/");
    }
  });

  async function signUp() {
    const userData = await post("http://localhost:3000/authentication/signUp", {
      firstName,
      email: email,
      password: md5(password),
    });
  }

  async function login() {
    try {
      const userData = await post(
        "http://localhost:3000/authentication/login",
        {
          email: email,
          password: md5(password),
        }
      );
      localStorage.setItem("auth", userData.data.token);
      goto("/");
    } catch (e) {
      console.log(e);
      error = e;
    }
  }
</script>

<div class="flex flex-col justify-center items-center">
  <div class="w-2/4 border p-10">
    <h1 class="text-lg font-bold mb-6">Login</h1>
    <form on:submit|preventDefault={login} class="flex flex-col">
      <label for="email">Email:</label><br />
      <input
        type="text"
        bind:value={email}
        placeholder="Email"
        class="w-1/2 border"
      />
      <label for="password">Password:</label><br />
      <input
        type="text"
        bind:value={password}
        placeholder="Password"
        class="w-1/2 border"
      />
      <button type="submit">Login</button>
    </form>
    <form on:submit|preventDefault={signUp} class="flex flex-col">
      <label for="firstName">First Name:</label><br />
      <input
        type="text"
        bind:value={firstName}
        placeholder="firstName"
        class="w-1/2 border"
      />
      <label for="email">Email:</label><br />
      <input
        type="text"
        bind:value={email}
        placeholder="Email"
        class="w-1/2 border"
      />
      <label for="password">Password:</label><br />
      <input
        type="text"
        bind:value={password}
        placeholder="Password"
        class="w-1/2 border"
      />
      <button type="submit">Sign Up</button>
    </form>
  </div>
</div>

<script setup>
	import { ref } from 'vue';
	import router from '../router';

	const email = ref(null);
	const password = ref(null);
	const logErr = ref(false);

	const login = async (e) => {
		e.preventDefault();
		
		const req = await fetch("http://localhost:3000/api/accounts/login/", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email.value,
				password: password.value
			})
		});

		if (req.status === 200) {
			const res = await req.json();
			await router.push("/chat");
		}
		else {
			logErr.value = true;
		}
	}
</script>

<template>
  <main>
    <h1>LOGIN <span style="color: rgb(36, 88, 207);">PAGE</span></h1>

    <form @submit="login">
			
            <div>
                <input type="email" placeholder="Email" v-model="email">
                
            </div>
            <div>
                <input type="password" placeholder="Password" v-model="password">

            </div>
            <p v-if="logErr" class="error">Error : invalid credentials</p>
				<button class="login" type="submit">Login</button>
            
    </form>
  </main>
</template>

<style scoped>
main {
    padding: 2rem;
    color: white;
  }
</style>
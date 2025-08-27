<template>
	<form @submit.prevent="handleSubmit" class="contact-form">
		<div>
			<label for="name">Name</label>
			<input id="name" v-model="form.name" type="text" required />
		</div>
		<div>
			<label for="email">Email</label>
			<input id="email" v-model="form.email" type="email" required />
		</div>
		<div>
			<label for="subject">Subject</label>
			<input id="subject" v-model="form.subject" type="text" required />
		</div>
		<div>
			<label for="message">Message</label>
			<textarea id="message" v-model="form.message" required></textarea>
		</div>
		<div>
			<label>
				<input type="checkbox" v-model="form.newsletter" /> Subscribe to newsletter
			</label>
		</div>
		<button type="submit" :disabled="loading">Send</button>
		<p v-if="error" class="error">{{ error }}</p>
		<p v-if="success" class="success">{{ success }}</p>
	</form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	onSubmit: {
		type: Function,
		default: null
	}
})

const form = ref({
	name: '',
	email: '',
	subject: '',
	message: '',
	newsletter: false
})
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleSubmit() {
	error.value = ''
	success.value = ''
	loading.value = true
	
	try {
		// If onSubmit prop is provided (e.g., in Storybook), use it
		if (props.onSubmit) {
			await props.onSubmit({ ...form.value })
			success.value = 'Message sent successfully!'
			form.value = { name: '', email: '', subject: '', message: '', newsletter: false }
		} else {
			// Otherwise, use Nuxt's $fetch for the actual form submission
			const { $fetch } = useNuxtApp()
			const result = await $fetch('/api/contact', {
				method: 'POST',
				body: { ...form.value }
			})
			
			if (result?.success) {
				success.value = result.message
				form.value = { name: '', email: '', subject: '', message: '', newsletter: false }
			} else {
				error.value = 'Submission failed.'
			}
		}
	} catch (e) {
		error.value = 'An error occurred. Please try again.'
	} finally {
		loading.value = false
	}
}
</script>

<style scoped>
.contact-form {
	max-width: 400px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
.contact-form label {
	font-weight: bold;
}
.contact-form input,
.contact-form textarea {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}
.contact-form button {
	padding: 0.75rem;
	background: #007bff;
	color: #fff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}
.contact-form button:disabled {
	background: #aaa;
	cursor: not-allowed;
}
.error {
	color: #d00;
}
.success {
	color: #080;
}
</style>

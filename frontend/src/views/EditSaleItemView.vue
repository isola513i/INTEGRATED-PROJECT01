<script setup></script>

<template>
	<div class="p-10 max-w-7xl mx-auto text-gray-800">
		<div class="mb-8 flex items-center gap-2">
			<router-link
				to="/sale-items"
				class="text-gray-600 hover:text-black text-xl font-light"
				>Home</router-link
			>
			<span class="text-gray-400">/</span>
			<span class="text-xl text-gray-800 font-light">Edit Sale Item</span>
		</div>

		<div v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</div>

		<SaleItemForm
			v-if="form"
			:form="form"
			:brands="brands"
			:isSubmitting="isSubmitting"
			:isFormValid="isFormValid"
			:isDirty="isDirty"
			@update:form="updateForm"
			@submit="handleSubmit"
			@cancel="handleCancel"
		/>
	</div>
</template>

<template>
  	<div>
		
	</div>
</template>

<script>
import * as Department from '@/api/department'

export default {
	data() {
		return {
			props: {
				label: 'name',
				value: 'id',
				children: 'children',
				checkStrictly: true
			},
			departments: []
		}
	},
	created() {
		this.initDepartments()
	},
	methods: {
		initDepartments() {
			Department.getAllDepartments()
			.then(response => {
				this.departments = response.data.items
			})
		},
		cascaderChange(val,) {
			let value = this.$refs.departmentCascader.getCheckedNodes(true)
			console.log(value)
		}
	}
}
</script>
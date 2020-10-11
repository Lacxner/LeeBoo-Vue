<template>
    <div>
        <!-- 个人信息表单 -->
        <el-form id="personalCenterForm" :model="formData" ref="personalCenterForm" :rules="formRules" status-icon label-width="80px">
            <!-- 头像 -->
            <el-form-item label="头像" prop="avatar" size="medium">
                <el-upload id="avatarUploader" class="avatar-uploader" action="/system/hr/upload" :show-file-list="false"
                :multiple="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                :on-error="handleAvatarError" :on-progress="handleAvatarProgress">
                    <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <!-- 名称 -->
            <el-form-item label="名称" prop="name" size="medium">
                <el-input type="input" v-model="formData.name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 手机号 -->
            <el-form-item label="手机号码" prop="phone" size="medium">
                <el-input type="input" v-model="formData.phone" autocomplete="off"></el-input>
            </el-form-item>
            <!-- QQ -->
            <el-form-item label="QQ" prop="qq" size="medium">
                <el-input type="input" v-model="formData.qq" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 地址 -->
            <el-form-item label="地址" prop="address" size="medium" style="width: 500px;">
                <el-input type="input" v-model="formData.address" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 备注 -->
            <el-form-item label="备注" prop="remark" size="medium" style="width: 500px;">
                <el-input type="textarea" :rows="4" v-model="formData.remark"></el-input>
            </el-form-item>
        </el-form>

        <!-- 重设密码对话框 -->
        <el-dialog title="修改密码" width="30%" :visible.sync="resetPassDialogVisible" :close-on-click-modal="false"
        append-to-body @closed="resetPasswordFormData">
            <!-- 编辑Hr表单 -->
            <el-form :model="passwordFormData" ref="passwordForm" :rules="resetPassFormRules" status-icon label-width="80px">
                <!-- Hr密码 -->
                <el-form-item label="密码" prop="password" size="medium">
                    <el-input type="input" v-model="passwordFormData.password" autocomplete="off"></el-input>
                </el-form-item>
                <!-- Hr再次确认密码 -->
                <el-form-item label="确认密码" prop="checkPassword" size="medium">
                    <el-input type="input" v-model="passwordFormData.checkPassword" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>

            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="resetPassDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="resetPassword" size="medium">确定</el-button>
            </span>
        </el-dialog>

        <!-- 底部 -->
        <span slot="footer" style="display: flex; justify-content: flex-start">
            <el-button @click="resetPassDialogVisible = true" size="medium" type="warning" style="width: 100px">修改密码</el-button>
            <el-button type="primary" @click="save" size="medium" :loading="saving" style="width: 100px">保 存</el-button>
        </span>
    </div>
</template>

<script>
import * as Hr from '@/api/hr'
import * as Message from '@/utils/message'

export default {
    data() {
        // 再次确认密码的自定义校验器
        let validateCheckPassword = (rule, value, callback) => {
            // 判断两次密码输入是否一致
            if (value === this.addFormData.password || value === this.passwordFormData.password) {
                callback()
            } else {
                callback(new Error('两次输入密码不一致!'))
            }
        }

        return {
            // 是否打开重设密码对话框
            resetPassDialogVisible: false,
            // 头像上传中提示
            uploading: null,
            // 个人信息加载中提示
            loading: null,
            // 保存中提示
			saving: false,
            // 头像上传中提示
            avatarUploading: null,
            // 个人信息数据
            formData: {
                id: null,
                name: null,
                phone: null,
                qq: null,
                address: null,
                avatar: null,
                remark: null
            },
            // 表单校验规则
            formRules: {
                name: [
                    { required: true, message: '名称不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '名称长度必须在2~12之间！',  trigger: 'blur' },
                    { pattern: /^[\w_-（）\u4e00-\u9fa5]{2,12}$/, message: '操作员名称含有非法字符！', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '手机号码不能为空！', trigger: 'blur' },
                    { min: 11, max: 11, message: '手机号码长度必须为11位！',  trigger: 'blur' },
                    { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '手机号码含有非法字符！', trigger: 'blur' }
                ],
                qq: [
                    { required: true, message: 'QQ不能为空！', trigger: 'blur' },
                    { min: 5, max: 16, message: 'QQ长度必须在5~16之间',  trigger: 'blur' },
                    { pattern: /^\d{5,16}$/, message: 'QQ含有非法字符！', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '地址不能为空！', trigger: 'blur' },
                    { min: 4, max: 24, message: '地址长度必须在4~24之间',  trigger: 'blur' },
                    { pattern: /^[\w（）\u4e00-\u9fa5]{4,24}$/, message: '地址含有非法字符！', trigger: 'blur' }
                ],
                remark: [
                    { min: 1, max: 30, message: '备注长度必须在1~30之间！',  trigger: 'blur' }
                ]
            },
            // 重设密码表单数据
            passwordFormData: {
                id: 0,
                password: '',
                checkPassword: ''
            },
            // 重设密码表单校验规则
            resetPassFormRules: {
                password: [
                    { required: true, message: '密码不能为空！', trigger: 'blur' },
                    { min: 4, max: 12, message: '密码长度必须在4~12之间！',  trigger: 'blur' },
                    { pattern: /^\w{4,12}$/, message: '密码含有非法字符！', trigger: 'blur' }
                ],
                checkPassword: [
                    { required: true, message: '请再次确认密码！', trigger: 'blur' },
                    { validator: validateCheckPassword, trigger: 'blur' }
                ]
            },
        }
    },
    mounted() {
        this.loading = this.$loading({
            lock: true,
            target: document.getElementById('personalCenterForm'),
            text: '加载中'
        })
        this.refreshMyself()
    },
    methods: {
        /**
         * 获取个人信息
         */
        refreshMyself(res) {
            Hr.getMyself()
            .then(response => {
                this.formData = response.data.item
                Message.handle(res)
                this.saving = false
                this.loading.close()
            })
        },
        /**
         * 重设密码
         */
        resetPassword() {
            this.$refs.passwordForm.validate((valid) => {
                if (valid) {
                    // 设置要重设密码Hr的id
                    this.passwordFormData.id = this.formData.id

                    Hr.updateHrPassword(this.passwordFormData)
                    .then(response => {
                        this.resetPassDialogVisible = false
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 保存修改
         */
        save() {
            this.$refs.personalCenterForm.validate((valid) => {
                if (valid) {
                    this.saving = true
                    // 修改职位
                    Hr.updateHr(this.formData)
                    .then(response => {
                        localStorage.setItem('user', JSON.stringify(this.formData))
                        Message.handle(response)
                        this.$store.commit('changeUser', { ...this.formData })
                        this.saving = false
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 重置密码表单并清除校验结果
         */
        resetPasswordFormData() {
            this.$refs.passwordForm.resetFields()
        },
        /**
         * 头像上传成功时的回调函数
         */
        handleAvatarSuccess(response, file) {
            // 更新当前头像的Url
            this.formData.avatar = response.data.item
            localStorage.setItem('user', JSON.stringify(this.formData))
            this.$store.commit('changeUser', { ...this.formData })
            this.uploading.close()
            this.$message.success('头像上传成功！')

            // 更新数据库中头像的Url
            Hr.updateHrAvatar(this.formData)
        },
        /**
         * 头像上传失败时的回调函数
         */
        handleAvatarError(error, file) {
            this.$message.error('头像上传失败！')
        },
        /**
         * 头像上传前的回调函数
         */
        beforeAvatarUpload(file) {
            const isTypeOK = file.type === 'image/jpeg' || 'image/png' || 'image/x-png' || 'image/bmp' || 'image/gif'
            const isLt2M = file.size / 1024 / 1024 < 5

            if (!isTypeOK) {
                this.$message.error('上传头像只能是 JPG、PNG、GIF 格式!')
                return false
            }
            if (!isLt2M) {
                this.$message.error('上传头像的大小不能超过 5MB!')
                return false
            }

            this.uploading = this.$loading({
                lock: true,
                target: document.getElementById('avatarUploader'),
                text: '上传中'
            })
            return true
        },
        handleAvatarProgress(event, file, fileList) {
            console.log(event)
        }
    }
}
</script>

<style scoped>
.el-form-item {
    width: 350px;
}
.avatar-uploader {
    width: 149px;
    height: 149px;
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.avatar-uploader /deep/ .el-upload:hover {
    border-color: #000000;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
}
.avatar {
    width: 148px;
    height: 148px;
    display: block;
}
</style>
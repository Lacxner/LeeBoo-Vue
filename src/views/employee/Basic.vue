<template>
    <div>
        <!-- 顶部 -->
        <div style="display: flex; justify-content: space-between">
            <div>
                <!-- 可根据员工名称和创建时间搜索 -->
                <el-input placeholder="请输入关键字进行筛选" v-model="search" clearable style="width: 400px; text-align: center" size="medium">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <!-- 高级搜索按钮 -->
                <el-button type="primary" @click="searchDialogVisible = true" style="margin-left: 20px" size="medium" icon="fa fa-filter"> 高级搜索</el-button>
                <!-- 重置按钮 -->
                <el-button type="primary" @click="resetSearchFormData" size="medium" icon="fa fa-times"></el-button>
            </div>
            <div>
                <!-- 添加员工按钮 -->
                <el-button type="primary" @click="openDialog(null)" style="margin-left: 20px" size="medium" icon="el-icon-plus" :loading="addLoading">添加员工</el-button>
                <!-- 导入员工按钮 -->
                <el-button type="primary" @click="importDialogVisible = true" style="margin-left: 20px" size="medium" :loading="uploadLoading">
                    <i class="fa fa-download" aria-hidden="true"></i> 导入
                </el-button>
                <!-- 导出员工按钮 -->
                <el-button type="primary" @click="exportExcel" size="medium">
                    <i class="fa fa-upload" aria-hidden="true"></i> 导出
                </el-button>
            </div>
        </div>

        <!-- 中间部分 -->
        <!-- 员工列表 -->
        <el-table :data="tableData.filter(data => !search
            || data.name.toLowerCase().includes(search.toLowerCase())
            || data.department.name.toLowerCase().includes(search.toLowerCase())
            || data.rank.name.toLowerCase().includes(search.toLowerCase())
            || data.position.name.toLowerCase().includes(search.toLowerCase()))"
        ref="employeeTable" max-height="920" fit @selection-change="handleSelectionChange" v-loading="tableLoading" element-loading-text="加载中">
            <!-- 勾选框 -->
            <el-table-column :resizable="false" fixed header-align="center" align="center" type="selection" width="80"></el-table-column>
            <!-- 序号 -->
            <el-table-column :resizable="false" fixed header-align="center" align="center" prop="id" label="序号" width="80">
                <template slot-scope="scope">
                    {{ (currentPage - 1) * pageSize + scope.$index + 1 }} <!-- 序号的定义规则 -->
                </template>
            </el-table-column>
            <!-- 姓名 -->
            <el-table-column :resizable="false" fixed header-align="center" align="center" prop="name" label="姓名" width="120"></el-table-column>
            <!-- 工号 -->
            <el-table-column :resizable="false" fixed header-align="center" align="center" prop="workID" label="工号" width="120"></el-table-column>
            <!-- 性别 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="gender" label="性别" width="80"></el-table-column>
            <!-- 出生日期 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="birthday" label="出生日期" width="160">
                <template slot-scope="scope">
                    {{ formatDateS2H(scope.row.birthday) }}
                </template>
            </el-table-column>
            <!-- 身份证号 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="idCard" label="身份证号" width="200"></el-table-column>
            <!-- 民族 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="nation.name" label="民族" width="110"></el-table-column>
            <!-- 籍贯 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="nativePlace" label="籍贯" width="110" show-overflow-tooltip></el-table-column>
            <!-- 政治面貌 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="politics.name" label="政治面貌" width="100" show-overflow-tooltip></el-table-column>
            <!-- 婚否 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="wedlock" label="婚否" width="90"></el-table-column>
            <!-- 邮箱 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="email" label="邮箱" width="200" show-overflow-tooltip></el-table-column>
            <!-- 手机号码 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="phone" label="手机号码" width="140"></el-table-column>
            <!-- 地址 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="address" label="地址" width="200" show-overflow-tooltip></el-table-column>
            <!-- 部门 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="department.name" label="部门" width="130" show-overflow-tooltip></el-table-column>
            <!-- 职称 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="rank.name" label="职称" width="150" show-overflow-tooltip></el-table-column>
            <!-- 职位 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="position.name" label="职位" width="150" show-overflow-tooltip></el-table-column>
            <!-- 聘用形式 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="engageForm" label="聘用形式" width="120" show-overflow-tooltip></el-table-column>
            <!-- 最高学历 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="tiptopDegree" label="最高学历" width="90" show-overflow-tooltip></el-table-column>
            <!-- 毕业院校 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="school" label="毕业院校" width="150" show-overflow-tooltip></el-table-column>
            <!-- 专业 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="specialty" label="专业" width="170" show-overflow-tooltip></el-table-column>
            <!-- 在职状态 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="workState" label="在职状态" width="90"></el-table-column>
            <!-- 入职日期 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="beginDate" label="入职日期" width="160">
                <template slot-scope="scope">
                    {{ formatDateS2H(scope.row.beginDate) }}
                </template>
            </el-table-column>
            <!-- 转正日期 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="conversionDate" label="转正日期" width="160">
                <template slot-scope="scope">
                    {{ formatDateS2H(scope.row.conversionDate) }}
                </template>
            </el-table-column>
            <!-- 合同起始日期 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="beginContract" label="合同起始日期" width="160">
                <template slot-scope="scope">
                    {{ formatDateS2H(scope.row.beginContract) }}
                </template>
            </el-table-column>
            <!-- 合同期限 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="contractTerm" label="合同期限" width="90">
                <template slot-scope="scope">
                    {{ scope.row.contractTerm + '年' }}
                </template>
            </el-table-column>
            <!-- 合同终止日期 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="endContract" label="合同终止日期" width="160">
                <template slot-scope="scope">
                    {{ formatDateS2H(scope.row.endContract) }}
                </template>
            </el-table-column>
            <!-- 工龄 -->
            <el-table-column :resizable="false" header-align="center" align="center" prop="workAge" label="工龄" width="90">
                <template slot-scope="scope">
                    {{ scope.row.workAge + '年' }}
                </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column :resizable="false" fixed="right" header-align="center" align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <!-- 编辑按钮 -->
                    <el-button size="mini" style="width: 70px" @click="openDialog(scope.row)">
                    <i class="el-icon-edit"></i> 编辑</el-button>
                    <!-- 删除按钮 -->
                    <el-button size="mini" type="danger" style="width: 70px" @click="deleteEmployee(scope.row.id)">
                    <i class="fa fa-trash"></i> 删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 导入员工对话框 -->
        <el-dialog title="导入员工" :visible.sync="importDialogVisible" width="400px" :close-on-click-modal="false">
            <el-upload ref="uploadEmployee" class="upload-demo" name="file" drag action="/employee/basic/upload" :limit="1" :show-file-list="false"
            :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传 Excel 文件，且不超过1MB！</div>
            </el-upload>

            <!-- 对话框底部按钮 -->
            <span slot="footer" style="display: flex; justify-content: space-between">
                <el-button type="warning" @click="exportTemplateExcel" size="medium">下载模板</el-button>
                <el-button @click="importDialogVisible = false" size="medium">关 闭</el-button>
            </span>
        </el-dialog>

        <!-- 添加或编辑员工对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="formDialogVisible" width="1400px" :close-on-click-modal="false" @closed="resetEmployeeFormData">
            <!-- 员工表单 -->
            <el-form :model="employeeFormData" ref="employeeForm" :rules="formRules"  status-icon label-width="52px">
                <!-- 第一行 -->
                <el-row :gutter="20">
                    <!-- 姓名 -->
                    <el-col :span="5">
                        <div class="grid-content bg-purple">
                            <el-form-item label="姓名" prop="name" size="medium">
                                <el-input type="input" v-model="employeeFormData.name" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 性别 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="性别" prop="gender" size="medium" :required="true">
                                <el-radio v-model="employeeFormData.gender" label="男">男</el-radio>
                                <el-radio v-model="employeeFormData.gender" label="女">女</el-radio>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 身份证号 -->
                    <el-col :span="7">
                        <div class="grid-content bg-purple">
                            <el-form-item label="身份证号" prop="idCard" size="medium" label-width="80px">
                                <el-input type="input" v-model="employeeFormData.idCard" autocomplete="off" @change="computeBirthday"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 出生日期 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="出生日期" prop="birthday" size="medium" label-width="80px">
                                <el-date-picker v-model="employeeFormData.birthday" align="center" type="date" placeholder="选择日期"  style="width: 100%"
                                format="yyyy年MM月dd日" value-format="yyyy-MM-dd" readonly disabled></el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>

                    <!-- 民族 -->
                    <el-col :span="5">
                        <div class="grid-content bg-purple">
                            <el-form-item label="民族" prop="nation.id" size="medium" :required="true">
                                <el-select v-model="employeeFormData.nation.id" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="nation in nations" :key="nation.id" :label="nation.name" :value="nation.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 籍贯 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="籍贯" prop="nativePlace" size="medium">
                                <el-input type="input" v-model="employeeFormData.nativePlace" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 政治面貌 -->
                    <el-col :span="7">
                        <div class="grid-content bg-purple">
                            <el-form-item label="政治面貌" prop="politics.id" size="medium" label-width="80px" :required="true">
                                <el-select v-model="employeeFormData.politics.id" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="politics in politicsArray" :key="politics.id" :label="politics.name" :value="politics.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 婚否 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="婚否" prop="wedlock" size="medium" label-width="80px" :required="true">
                                <el-radio v-model="employeeFormData.wedlock" label="未婚">未婚</el-radio>
                                <el-radio v-model="employeeFormData.wedlock" label="已婚">已婚</el-radio>
                                <el-radio v-model="employeeFormData.wedlock" label="离异">离异</el-radio>
                            </el-form-item>
                        </div>
                    </el-col>

                    <!-- 邮箱 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="邮箱" prop="email" size="medium">
                                <el-input type="input" v-model="employeeFormData.email" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 手机号码 -->
                    <el-col :span="5">
                        <div class="grid-content bg-purple">
                            <el-form-item label="手机号码" prop="phone" size="medium" label-width="80px">
                                <el-input type="input" v-model="employeeFormData.phone" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 地址 -->
                    <el-col :span="7">
                        <div class="grid-content bg-purple">
                            <el-form-item label="地址" prop="address" size="medium">
                                <el-input type="input" v-model="employeeFormData.address" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 聘用合同 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="聘用合同" prop="engageForm" size="medium" label-width="80px" :required="true">
                                <el-radio v-model="employeeFormData.engageForm" label="劳动合同">劳动合同</el-radio>
                                <el-radio v-model="employeeFormData.engageForm" label="劳务合同">劳务合同</el-radio>
                            </el-form-item>
                        </div>
                    </el-col>

                    <!-- 部门 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="部门" prop="department.id" size="medium">
                                <el-cascader ref="employeeDepartmentCascader" :options="departments" v-model="employeeFormData.department.id" :props="props"
                                :show-all-levels="false" style="width: 100%"></el-cascader>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 职称 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="职称" prop="rank.id" size="medium">
                                <el-select v-model="employeeFormData.rank.id" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="rank in ranks" :key="rank.id" :label="rank.name" :value="rank.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 职位 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="职位" prop="position.id" size="medium">
                                <el-select v-model="employeeFormData.position.id" placeholder="请选择" style="width: 100%">
                                    <el-option v-for="position in positions" :key="position.id" :label="position.name" :value="position.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 最高学历 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="最高学历" prop="tiptopDegree" size="medium" label-width="80px" :required="true">
                                <el-select v-model="employeeFormData.tiptopDegree" placeholder="请选择" style="width: 100%">
                                    <el-option label="本科" value="本科"></el-option>
                                    <el-option label="大专" value="大专"></el-option>
                                    <el-option label="硕士" value="硕士"></el-option>
                                    <el-option label="博士" value="博士"></el-option>
                                    <el-option label="高中" value="高中"></el-option>
                                    <el-option label="初中" value="初中"></el-option>
                                    <el-option label="小学" value="小学"></el-option>
                                    <el-option label="其他" value="其他"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>

                    <!-- 毕业院校 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="毕业院校" prop="school" size="medium" label-width="80px">
                                <el-input type="input" v-model="employeeFormData.school" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 专业 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="专业" prop="specialty" size="medium">
                                <el-input type="input" v-model="employeeFormData.specialty" autocomplete="off"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 工号 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="工号" prop="workID" size="medium" :required="true">
                                <el-input type="input" v-model="employeeFormData.workID" autocomplete="off" disabled></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 在职状态 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="在职状态" prop="workState" size="medium" label-width="80px" :required="true">
                                <el-radio v-model="employeeFormData.workState" label="在职" :disabled="workStateDisabled">在职</el-radio>
                                <el-radio v-model="employeeFormData.workState" label="离职" :disabled="workStateDisabled">离职</el-radio>
                            </el-form-item>
                        </div>
                    </el-col>

                    <!-- 入职日期 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="入职日期" prop="beginDate" size="medium" label-width="80px" :required="true">
                                <el-date-picker v-model="employeeFormData.beginDate" align="center" type="date" placeholder="选择日期" style="width: 100%"
                                format="yyyy年MM月dd日" value-format="yyyy-MM-dd" readonly disabled></el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 转正日期 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="转正日期" prop="conversionDate" size="medium" label-width="80px">
                                <el-date-picker v-model="employeeFormData.conversionDate" align="center" type="date" placeholder="选择日期" style="width: 100%"
                                :picker-options="pickerOptions" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 合同起始日期 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="合同起始日期" prop="beginContract" size="medium" label-width="108px">
                                <el-date-picker v-model="employeeFormData.beginContract" align="center" type="date" placeholder="选择日期" style="width: 100%"
                                format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                    <!-- 合同终止日期 -->
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <el-form-item label="合同终止日期" prop="endContract" size="medium" label-width="108px">
                                <el-date-picker v-model="employeeFormData.endContract" align="center" type="date" placeholder="选择日期" style="width: 100%"
                                :picker-options="pickerOptions" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="formDialogVisible = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="addOrEditEmployee" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 高级搜索对话框 -->
        <el-dialog title="高级搜索" :visible.sync="searchDialogVisible" width="500px" :close-on-click-modal="false">
            <!-- 员工表单 -->
            <el-form :model="searchFormData" ref="searchForm" :rules="searchRules"  status-icon label-width="96px">
                <!-- 工号 -->
                <el-form-item label="工号" prop="workID" size="medium">
                    <el-input type="input" v-model="searchFormData.workID" autocomplete="off" clearable></el-input>
                </el-form-item>
                <!-- 姓名 -->
                <el-form-item label="姓名" prop="name" size="medium">
                    <el-input type="input" v-model="searchFormData.name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <!-- 手机号码 -->
                <el-form-item label="手机号码" prop="phone" size="medium">
                    <el-input type="input" v-model="searchFormData.phone" autocomplete="off" clearable></el-input>
                </el-form-item>
                <!-- 部门 -->
                <el-form-item label="部门" prop="department.id" size="medium">
                    <el-cascader ref="searchDepartmentCascader" :options="departments" v-model="searchFormData.department.id" :props="props"
                    :show-all-levels="false" style="width: 100%" clearable></el-cascader>
                </el-form-item>
                <!-- 职称 -->
                <el-form-item label="职称" prop="rank.id" size="medium">
                    <el-select v-model="searchFormData.rank.id" placeholder="请选择" style="width: 100%" clearable>
                        <el-option v-for="rank in ranks" :key="rank.id" :label="rank.name" :value="rank.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 职位 -->
                <el-form-item label="职位" prop="position.id" size="medium">
                    <el-select v-model="searchFormData.position.id" placeholder="请选择" style="width: 100%" clearable>
                        <el-option v-for="position in positions" :key="position.id" :label="position.name" :value="position.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 合同起始日期 -->
                <el-form-item label="合同起始日期" prop="beginContract" size="medium">
                    <el-date-picker v-model="searchFormData.beginContract" align="center" type="date" placeholder="选择日期" style="width: 100%"
                    format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <!-- 合同终止日期 -->
                <el-form-item label="合同终止日期" prop="endContract" size="medium">
                    <el-date-picker v-model="searchFormData.endContract" align="center" type="date" placeholder="选择日期" style="width: 100%"
                     format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-form>

            <!-- 对话框底部按钮 -->
            <span slot="footer">
                <el-button @click="searchDialogVisible = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="advancedSearch" size="medium">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 底部 -->
        <div style="display: flex; justify-content: space-between">
            <div>
                <!-- 批量删除员工按钮 -->
                <el-button type="danger" @click="deleteSelection" size="medium" icon="fa fa-trash" :loading="batchDeleteLoading"> 批量删除</el-button>
                <!-- 取消全部的选中项按钮 -->
                <el-button @click="cancelSelection" size="medium" icon="fa fa-ban"> 全部取消</el-button>
            </div>

            <!-- 分页 -->
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
            @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage"
            :page-sizes="[8, 16, 32, 64, total]" :page-size="pageSize"></el-pagination>
        </div>
    </div>
</template>

<script>
import * as Employee from '@/api/employee'
import * as Message from '@/utils/message'
import * as Formatter from '@/utils/formatter'
import * as Generic from '@/utils/generic'

export default {
    data() {
        return {
            // 批量删除中提示
            batchDeleteLoading: false,
            // 添加中提示
            addLoading: false,
            // 表格加载中提示
            tableLoading: true,
            // 导入按钮加载中提示
            uploadLoading: false,
            // 搜索内容
            search: '',
            // 总员工数
            total: 0,
            // 当前页码
            currentPage: 1,
            // 每页显示数
            pageSize: 8,
            // 添加或编辑时表单数据
            employeeFormData: {
                name: null,
                gender: '男',
                idCard: null,
                birthday: null,
                nation: {
                    id: 1
                },
                nativePlace: null,
                politics: {
                    id: 13,
                },
                wedlock: '未婚',
                email: null,
                phone: null,
                address: null,
                department: {
                    id: null
                },
                rank: {
                    id: null
                },
                position: {
                    id: null
                },
                engageForm: '劳动合同',
                tiptopDegree: '本科',
                school: null,
                specialty: null,
                workID: '00000000',
                workState: '在职',
                beginDate: new Date(),
                conversionDate: null,
                beginContract: null,
                contractTerm: 1,
                endContract: null,
                workAge: 0
            },
            /**
             * 高级搜索表单数据
             */
            searchFormData: {
                name: null,
                workID: null,
                phone: null,
                department: {
                    id: null
                },
                rank: {
                    id: null
                },
                position: {
                    id: null
                },
                beginContract: null,
                endContract: null
            },
            // 是否正在使用高级搜索
            isAdvancedSearch: false,
            // 添加员工表单中的在职状态是否被禁用
            workStateDisabled: true,
            // 表单的民族选项
            nations: [],
            // 表单的政治面貌选项
            politicsArray: [],
            // 部门级联选择器的属性映射
            props: {
				label: 'name',
				value: 'id',
				children: 'children',
                checkStrictly: true,
                expandTrigger: 'hover'
			},
            // 表单的部门选项
            departments: [],
            // 表单的职位选项
            positions: [],
            // 表单的职称选项
            ranks: [],
            // 日期选择器的限制条件
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now()
                }
            },
            // 对话框标题
            dialogTitle: '添加员工',
            // 员工表单校验规则
            formRules: {
                name: [
                    { required: true, message: '姓名不能为空！', trigger: 'blur' },
                    { min: 2, max: 5, message: '姓名长度必须在2~5之间！',  trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '姓名含有非法字符！', trigger: 'blur' }
                ],
                idCard: [
                    { required: true, message: '身份证号不能为空！', trigger: 'blur' },
                    { min: 18, max: 18, message: '身份证号长度必须为18位！',  trigger: 'blur' },
                    { pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/, message: '身份证号含有非法字符！', trigger: 'blur' }
                ],
                birthday: [
                    { required: true , message: '身份证号不能为空！', trigger: 'change' }
                ],
                nativePlace: [
                    { required: true, message: '籍贯不能为空！', trigger: 'blur' },
                    { min: 4, max: 12, message: '籍贯长度必须在4~12之间！',  trigger: 'blur' },
                    { pattern: /^[\u4e00-\u9fa5]{4,12}$/, message: '籍贯含有非法字符！', trigger: 'blur' }
                ],
                email: [
                    { required: true, type: 'email', message: '邮箱不能为空！', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '手机号码不能为空！', trigger: 'blur' },
                    { min: 11, max: 11, message: '手机号码长度必须为11位！',  trigger: 'blur' },
                    { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '手机号码含有非法字符！', trigger: 'blur' }
                ],
                address: [
                    { required: true, message: '地址不能为空！', trigger: 'blur' },
                    { min: 4, max: 24, message: '地址长度必须在4~24之间！',  trigger: 'blur' },
                    { pattern: /^[\w_-（）\u4e00-\u9fa5]{4,24}$/, message: '地址含有非法字符！', trigger: 'blur' }
                ],
                'department.id': [
                    { required: true, message: '请选择部门！', trigger: 'blur' },
                ],
                'rank.id': [
                    { required: true, message: '请选择职称！', trigger: 'blur' },
                ],
                'position.id': [
                    { required: true, message: '请选择职位！', trigger: 'blur' },
                ],
                school: [
                    { required: true, message: '毕业院校不能为空！', trigger: 'blur' },
                    { min: 4, max: 16, message: '毕业院校长度必须在4~16之间！',  trigger: 'blur' },
                    { pattern: /^[\w（）\u4e00-\u9fa5]{4,16}$/, message: '毕业院校含有非法字符！', trigger: 'blur' }
                ],
                specialty: [
                    { required: true, message: '专业不能为空！', trigger: 'blur' },
                    { min: 2, max: 12, message: '专业长度必须在4~12之间！',  trigger: 'blur' },
                    { pattern: /^[\w（）\u4e00-\u9fa5]{2,12}$/, message: '专业含有非法字符！', trigger: 'blur' }
                ],
                conversionDate: [
                    { required: true, message: '请选择转正日期！', trigger: 'blur' },
                ],
                beginContract: [
                    { required: true, message: '请选择合同起始日期！', trigger: 'blur' },
                ],
                endContract: [
                    { required: true, message: '请选择合同起始日期！', trigger: 'blur' },
                ],
            },
            // 高级搜索表单校验规则
            searchRules: {
                name: [
                    { pattern: /^[\u4e00-\u9fa5]+$/, message: '姓名含有非法字符！', trigger: 'blur' }
                ],
                workID: [
                    { min: 1, max: 8, message: '工号长度必须在1~8之间！',  trigger: 'blur' },
                    { pattern: /^\d{1,8}$/, message: '工号含有非法字符！', trigger: 'blur' }
                ],
                phone: [
                    { min: 11, max: 11, message: '手机号码长度必须为11位！',  trigger: 'blur' },
                    { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '手机号码含有非法字符！', trigger: 'blur' }
                ]
            },
            // 是否打开添加或编辑员工对话框
            formDialogVisible: false,
            // 是否打开导入对话框
            importDialogVisible: false,
            // 是否打开高级搜索对话框
            searchDialogVisible: false,
            // 表格数据
            tableData: [],
            // 所有的多选项
            multipleSelection: []
        }
    },
    created() {
        this.refreshAllEmployees()
        this.initBasicOptions()
    },
    filters: {
        /**
         * 计算工龄
         */
        
    },
    methods: {
        /**
         * 获取所有员工
         */
        refreshAllEmployees(res) {
            // 获取所有员工
            Employee.getAllEmployees(this.currentPage, this.pageSize)
            .then(response => {
                // 全部员工
                this.tableData = response.data.items
                // 员工总数
                this.total = response.data.total
                Message.handle(res)
                this.tableLoading = false
            })
        },
        /**
         * 导出Excel员工信息表至本地
         */
        exportExcel() {
            this.$confirm('是否要将员工信息导入 Excel ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                window.open('http://localhost:8080/employee/basic/download', '_parent')
            }).catch(() => {})
        },
        /**
         * 导出Excel员工模板至本地
         */
        exportTemplateExcel() {
            window.open('http://localhost:8080/employee/basic/downloadTemplate', '_parent')
        },
        /**
         * 文件上传前的钩子函数
         */
        beforeUpload(file) {
            if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                this.$message.error({
                    message: '文件格式不正确！'
                })
                return false
            }

            let _1MB = 1024 * 1024
            if (file.size >= _1MB) {
                this.$messag.errore({
                    message: '文件大小超出1MB！'
                })
                return false
            }

            this.uploadLoading = true
            this.importDialogVisible = false
        },
        /**
         * 上传成功的回调函数
         */
        onSuccess() {
            this.uploadLoading = false
            this.$refs.uploadEmployee.clearFiles()
            this.$message({
                message: '导入成功！',
                type: 'success'
            })
        },
        /**
         * 上传失败的回调函数
         */
        onError() {
            this.uploadLoading = false
            this.$refs.uploadEmployee.clearFiles()
            this.$message.error({
                message: '导入失败！'
            })
        },
        /**
         * 初始化表单下拉菜单的选项
         */
        initBasicOptions() {
            Employee.initBasicOptions()
            .then(response => {
                this.nations = response.data.nations
                this.politicsArray = response.data.politics
                this.departments = response.data.departments
                this.positions = response.data.positions
                this.ranks = response.data.ranks
            })
        },
        /**
         * 切换页面时的点击事件
         */
        handleCurrentChange() {
            this.tableLoading = true
            if (!this.isAdvancedSearch) {
                this.refreshAllEmployees()
            } else {
                this.advancedSearch()
            }
        },
        /**
         * 切换每页显示数时的点击事件
         */
        handleSizeChange(val) {
            this.pageSize = val
            this.tableLoading = true
            if (!this.isAdvancedSearch) {
                this.refreshAllEmployees()
            } else {
                this.advancedSearch()
            }
        },
        /**
         * 点击添加或编辑按钮时打开对话框，对话框会动态适应
         * 如果是修改操作就传入当前要编辑的员工，反之添加就传入null
         */
        openDialog(currentEmployee) {
            // 根据方法是否传入员工来判断是添加或是编辑对话框
            if (currentEmployee) {
                this.dialogTitle = '修改员工'

                // 数据回显
                this.$nextTick(() => {
                    this.employeeFormData = Generic.deeper(currentEmployee)
                })
            } else {
                this.dialogTitle = '添加员工'

                Employee.getMaxWorkID()
                .then(response => {
                    this.employeeFormData.workID = response.data.item
                })
            }
            this.formDialogVisible = true
        },
        /**
         * 添加或编辑员工
         */
        addOrEditEmployee() {
            this.$refs.employeeForm.validate((valid) => {
                if (valid) {
                    // 点击了确定后立马关闭对话框并开启加载中提示，提高用户体验
                    this.formDialogVisible = false
                    this.tableLoading = true

                    // 获取级联选择器当前选中项的id，因为级联选择器获取的是选中项路径中所有项的id数组
                    if (typeof(this.employeeFormData.department.id) !== 'number' && this.employeeFormData.department.id instanceof Array) {
                        // 当前选中项的id位于数组的末尾
                        let lastIndex = this.employeeFormData.department.id.length - 1
                        this.employeeFormData.department.id = this.employeeFormData.department.id[lastIndex]
                    }

                    // 如果当前表单数据的id属性有值就代表要修改，反之就表示添加
                    if (this.employeeFormData.id) {
                        // 修改前计算工龄和合同终止日期
                        this.employeeFormData.workAge =  this.computeWorkAge()
                        this.employeeFormData.contractTerm = this.computeContractTerm()

                        // 修改员工
                        Employee.updateEmployee(this.employeeFormData)
                        .then(response => {
                            if (!this.isAdvancedSearch) {
                                this.refreshAllEmployees(response)
                            } else {
                                this.advancedSearch(response)
                            }
                        })
                    } else {
                        this.addLoading = true
                        this.employeeFormData.beginDate = Formatter.formatDateR2S(this.employeeFormData.beginDate)

                        // 添加前计算工龄和合同终止日期
                        this.employeeFormData.workAge =  this.computeWorkAge()
                        this.employeeFormData.contractTerm = this.computeContractTerm()

                        // 添加员工
                        Employee.addEmployee(this.employeeFormData)
                        .then(response => {
                            if (!this.isAdvancedSearch) {
                                this.refreshAllEmployees(response)
                            } else {
                                this.advancedSearch(response)
                            }
                            this.addLoading = false
                        })
                    }
                } else {
                    return false
                }
            })
        },
        /**
         * 删除员工
         */
        deleteEmployee(id) {
            // 再次确认删除
            this.$confirm('是否确定要删除这条数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 删除指定员工
                this.tableLoading = true
                Employee.deleteEmployeeById(id)
                .then(response => {
                    if (!this.isAdvancedSearch) {
                        this.refreshAllEmployees(response)
                    } else {
                        this.advancedSearch(response)
                    }
                })
            }).catch(action => {})
        },
        /**
         * 批量删除选中项
         */
        deleteSelection() {
            // 再次确认删除
            this.$confirm(`是否确定要删除这 ${this.multipleSelection.length} 条数据?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.multipleSelection.length > 0) {
                    this.batchDeleteLoading = true
                    this.tableLoading = true
                    // 提取出所有选中员工的id并封装成一个数组
                    let ids = []
                    this.multipleSelection.forEach(selection => {
                        ids.push(selection.id)
                    })
                    
                    // 批量删除选中的员工，删除成功后刷新员工列表
                    Employee.deleteBatchEmployeeByIds(ids)
                    .then(response => {
                        if (!this.isAdvancedSearch) {
                            this.refreshAllEmployees(response)
                        } else {
                            this.advancedSearch(response)
                        }
                        this.batchDeleteLoading = false
                    })
                }
            }).catch(action => {})
        },
        /**
         * 取消所有选中项
         */
        cancelSelection() {
            if (this.multipleSelection.length > 0) {
                this.$refs.employeeTable.clearSelection()
            }
        },
        /**
         * 更新选中的多选项
         */
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        /**
         * 重置添加或编辑员工表单并清除校验结果
         */
        resetEmployeeFormData() {
            this.$refs.employeeForm.resetFields()
            this.$refs.employeeDepartmentCascader.$refs.panel.clearCheckedNodes()
        },
        /**
         * 重置高级搜索表单并清除校验结果
         */
        resetSearchFormData() {
            this.$refs.searchForm.resetFields()
            this.$refs.searchDepartmentCascader.$refs.panel.clearCheckedNodes()
            this.isAdvancedSearch = false

            // 刷新页面
            this.tableLoading = true
            this.refreshAllEmployees()
        },
        /**
         * 计算工龄
         */
        computeWorkAge() {
            let formatedBeginDate = new Date(this.employeeFormData.beginDate)
            let nowDate = new Date()
            let workAge

            // 获取月份差
            let monthDifference = (nowDate.getMonth() + 1) - (formatedBeginDate.getMonth() + 1)
            if (monthDifference > 0) {
                // 视情况忽略小数部分
                if ((monthDifference / 12) < 0.1) {
                    workAge = nowDate.getFullYear() - formatedBeginDate.getFullYear()
                } else {
                    // 计算出的工龄是String类型，必须强制类型转换为Number类型
                    workAge = Number((nowDate.getFullYear() - formatedBeginDate.getFullYear() + monthDifference / 12).toFixed(1))
                }
            } else {
                monthDifference = 12 - formatedBeginDate.getMonth() + 1 + nowDate.getMonth() + 1
                // 视情况忽略小数部分
                if (monthDifference / 12 < 0.1) {
                    workAge = nowDate.getFullYear() - formatedBeginDate.getFullYear() - 1
                } else {
                    // 计算出的工龄是String类型，必须强制类型转换为Number类型
                    workAge = Number((nowDate.getFullYear() - formatedBeginDate.getFullYear() - 1 + monthDifference / 12).toFixed(1))
                }
            }
            return workAge
        },
        /**
         * 计算合同期限
         */
        computeContractTerm() {
            let formatedBeginContract = new Date(this.employeeFormData.beginContract)
            let formatedEndContract = new Date(this.employeeFormData.endContract)
            let contractTerm

            // 获取月份差
            let monthDifference = (formatedEndContract.getMonth() + 1) - (formatedBeginContract.getMonth() + 1)
            if (monthDifference > 0) {
                // 视情况忽略小数部分
                if ((monthDifference / 12) < 0.1) {
                    contractTerm = formatedEndContract.getFullYear() - formatedBeginContract.getFullYear()
                } else {
                    // 计算出的工龄是String类型，必须强制类型转换为Number类型
                    contractTerm = Number((formatedEndContract.getFullYear() - formatedBeginContract.getFullYear() + monthDifference / 12).toFixed(1))
                }
            } else {
                monthDifference = 12 - formatedBeginContract.getMonth() + 1 + formatedEndContract.getMonth() + 1
                // 视情况忽略小数部分
                if (monthDifference / 12 < 0.1) {
                    contractTerm = formatedEndContract.getFullYear() - formatedBeginContract.getFullYear() - 1
                } else {
                    // 计算出的工龄是String类型，必须强制类型转换为Number类型
                    contractTerm = Number((formatedEndContract.getFullYear() - formatedBeginContract.getFullYear() - 1 + monthDifference / 12).toFixed(1))
                }
            }
            return contractTerm
        },
        /**
         * 输入身份证号自动填充出生日期
         */
        computeBirthday() {
            if (this.employeeFormData.idCard.length >= 14) {
                this.employeeFormData.birthday = this.employeeFormData.idCard.substr(6, 4) + '-' + this.employeeFormData.idCard.substr(10, 2) + '-' + this.employeeFormData.idCard.substr(12, 2)
            }
        },
        /**
         * 格式化表格中的日期
         */
        formatDateS2H(date) {
            return Formatter.formatDateS2H(date)
        },
        /**
         * 高级搜索员工
         */
        advancedSearch(res) {
            this.$refs.searchForm.validate((valid) => {
                if (valid) {
                    this.searchDialogVisible = false
                    this.tableLoading = true

                    // 获取级联选择器当前选中项的id，因为级联选择器获取的是选中项路径中所有项的id数组
                    if (typeof(this.searchFormData.department.id) !== 'number' && this.searchFormData.department.id instanceof Array) {
                        // 当前选中项的id位于数组的末尾
                        let lastIndex = this.searchFormData.department.id.length - 1
                        this.searchFormData.department.id = this.searchFormData.department.id[lastIndex]
                    }

                    // 获取所有员工
                    Employee.searchEmployees(this.searchFormData, this.currentPage, this.pageSize)
                    .then(response => {
                        // 全部员工
                        this.tableData = response.data.items
                        // 员工总数
                        this.total = response.data.total
                        Message.handle(res)
                        this.tableLoading = false
                        this.isAdvancedSearch = true
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.el-table {
    margin: 20px 0px;
}
.el-pagination /deep/ .el-pagination__total, .el-pagination /deep/  .el-pagination__jump {
    font-weight: 600;
}
</style>


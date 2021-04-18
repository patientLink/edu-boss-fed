<template>
  <div class='resource-list'>
    <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="form" label-width="80px" size="medium" style="width: 400px">
        <el-form-item prop="name" label="资源名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="资源路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" label="资源分类">
          <el-select v-model="form.categoryId" placeholder="请选择资源分类" clearable>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in resourceCategories"
              :key="item.id"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="isLoading" @click="onSubmit">查询搜索</el-button>
          <el-button @click="onReset" :disabled="isLoading" >重置</el-button>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-button @click="dialogFormVisible=true" >添加</el-button>
      <el-button @click="$router.push({name: 'resource-category'})">资源分类</el-button>
    </div>
    <el-dialog title="编辑资源" :visible.sync="dialogFormVisible" width="600px" @close="onResetEditForm">
      <el-form :model="editForm" style="width: 450px">
        <el-form-item label="资源名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" :label-width="formLabelWidth">
          <el-input v-model="editForm.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" :label-width="formLabelWidth">
          <el-select v-model="editForm.categoryId" placeholder="请选择资源分类">
            <el-option
              v-for="item in resourceCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="4" v-model="editForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="isEditing" @click="onCreateOrEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-table
      :data="resources"
      border
      style="margin-bottom: 20px"
      v-loading="isLoading">
      <el-table-column
        type="index"
        label="编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="资源名称">
      </el-table-column>
      <el-table-column
        prop="url"
        label="资源路径">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="添加时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="form.current"
      :page-sizes="[5, 10, 20]"
      :page-size="form.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      :disabled="isLoading">
    </el-pagination>
  </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Form } from 'element-ui'
import {
  getResourcePages,
  deleteResouce,
  createOrUpdateResource,
  getResourceDetail
} from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'

const defaultForm = {
  name: '',
  url: '',
  categoryId: null,
  description: '',
  id: null
}

export default Vue.extend({
  name: 'ResouceList',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        url: '',
        categoryId: null,
        current: 1,
        size: 5
      },
      editForm: Object.assign({}, defaultForm),
      dialogFormVisible: false,
      formLabelWidth: '120px',
      totalCount: 0,
      resourceCategories: [],
      isLoading: false,
      isEditing: false
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    onResetEditForm () {
      this.editForm = Object.assign({}, defaultForm)
    },
    async onCreateOrEdit () {
      const isCreate = this.editForm.id === null
      this.isEditing = true
      try {
        const { data } = await createOrUpdateResource(this.editForm)
        if (data.code === '000000') {
          this.$message.success(isCreate ? '资源已添加' : '资源已修改')
          this.dialogFormVisible = false
          this.loadResources()
        }
      } catch (err) {
        console.log(err)
      }
      this.isEditing = false
    },
    async handleEdit (item: any) {
      this.dialogFormVisible = true
      const { data } = await getResourceDetail(item.id)
      if (data.code === '000000') {
        const { id, name, url, categoryId, description } = data.data
        this.editForm = { id, name, url, categoryId, description }
      } else {
        this.$message.info('获取资源信息失败')
      }
    },
    handleDelete (item: any) {
      this.$confirm('确认删除该资源吗?', '删除提示', {})
        .then(async () => {
          const { data } = await deleteResouce(item.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadResources()
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.info('已取消删除')
        })
    },
    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange () {
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1
      this.loadResources()
    }
  }
})
</script>

<style lang='scss' scoped>
</style>

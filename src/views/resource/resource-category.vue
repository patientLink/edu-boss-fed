<template>
  <div class='resource-category'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="dialogFormVisible=true" >添加</el-button>
      </div>
      <el-dialog :title="editForm.id === null ? '添加分类' : '编辑分类'" :visible.sync="dialogFormVisible" width="600px" @close="onResetEditForm">
        <el-form :model="editForm" style="width: 450px">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="editForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input v-model="editForm.sort" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" :disabled="isEditing" @click="onCreateOrEdit">确 定</el-button>
        </div>
      </el-dialog>
      <el-table
        :data="categories"
        border
        style="margin-bottom: 20px"
        v-loading="isLoading">
        <el-table-column
          type="index"
          label="编号"
          width="100"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          >
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
          >
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          >
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
    </el-card>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import {
  getResourceCategories,
  createOrUpdateResourceCategory,
  deleteResourceCategory
} from '@/services/resource-category'

const defaultForm = {
  id: null,
  name: '',
  sort: 0
}

export default Vue.extend({
  name: 'ResourceCategory',
  data () {
    return {
      categories: [],
      editForm: Object.assign({}, defaultForm),
      dialogFormVisible: false,
      formLabelWidth: '120px',
      isLoading: false,
      isEditing: false
    }
  },
  created () {
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      this.isLoading = true
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.categories = data.data
      } else {
        this.$message.info('获取资源分类列表失败')
      }
      this.isLoading = false
    },
    async onCreateOrEdit () {
      const isCreate = this.editForm.id === null
      this.isEditing = true
      try {
        const { data } = await createOrUpdateResourceCategory(this.editForm)
        if (data.code === '000000') {
          this.$message.success(isCreate ? '分类已添加' : '分类已修改')
          this.dialogFormVisible = false
          this.loadResourceCategories()
        }
      } catch (err) {
        console.log(err)
        // this.$message.info('操作失败，请重新提交')
      }
      this.isEditing = false
    },
    async handleEdit (item: any) {
      this.dialogFormVisible = true
      this.editForm.name = item.name
      this.editForm.id = item.id
      this.editForm.sort = item.sort
    },
    handleDelete (item: any) {
      this.$confirm('确认删除该资源分类吗?', '删除提示', {})
        .then(async () => {
          const { data } = await deleteResourceCategory(item.id)
          if (data.code === '000000') {
            this.$message.success('删除成功')
            this.loadResourceCategories()
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.info('已取消删除')
        })
    },
    onResetEditForm () {
      this.editForm = Object.assign({}, defaultForm)
    }
  }
})
</script>

<style lang='scss' scoped>
</style>

<template>
  <div>
    <template v-for="col in columns">
      <!-- 显示操作 -->
      <template v-if="col.key =='operating'">
        <el-table-column :key="col.key" :prop="col.key" :label="col.label" show-overflow-tooltip :width="col.width" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>

      <!-- 显示复选框 -->
      <template v-else-if="col.key=='checked'">
        <el-table-column type="selection" :key="col.key"></el-table-column>
      </template>

      <!-- 显示复选框 -->
      <template v-else-if="col.key =='id'">
        <el-table-column :key="col.key" sortable :prop="col.key" :label="col.label" :width="col.width"></el-table-column>
      </template>

      <el-table-column v-else :key="col.key" :prop="col.key" :label="col.label" show-overflow-tooltip :width="col.width"></el-table-column>
    </template>
  </div>
</template>
<script>

export default {
  name: "tableItem",
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 删除表格项
    handleDelete(index, row) {
      this.$emit('handleDelete', index, row)
    },
    // 编辑表格
    handleEdit(index, row) {
      this.$emit('handleEdit', row)
    },
  }
};
</script>


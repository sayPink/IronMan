<template>
  <el-pagination
    background
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="PageSize"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalCount"
  ></el-pagination>
</template>

<script>
export default {
  name: "pageing",
  props: {
    // 默认显示第几页
    currentPage: {
      type: Number,
      default: 1
    },
    // 默认每页显示的条数（可修改）
    PageSize: {
      type: Number,
      default: 12
    },
    // 个数选择器（可修改）
    pageSizes: {
      type: Array,
      default: () => {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      }
    },
    // 总条数
    totalCount: {
      type: Number,
      default: 1
    }
  },
  
  methods: {
    handleCurrentChange(page) {
      this.$emit("handleCurrentChange", page);
    },
    handleSizeChange(page) {
      this.$emit("handleSizeChange", page);
    }
  }
};
</script>


<template>
  <section>
    <div class="content-wrap">
      <el-button size="mini" @click="toggleSelection()">批量删除</el-button>

      <!-- <el-select v-model="value4" size="mini" clearable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>-->

      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        header-align="center"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <table-item :columns="columns" @handleDelete="handleDelete" @handleEdit="handleEdit"></table-item>
      </el-table>
    </div>

    <!-- 分页 S -->
    <pageing
      :totalCount="totalCount"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></pageing>
    <!-- 分页 E -->

    <!-- 编辑 S -->
    <el-dialog title="编辑" :modal="isDialog" :visible.sync="centerDialogVisible" width="50%" center>
      <div class="block dialog-wrepper">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="dialogData.nickname"></el-input>
          </el-form-item>

          <el-form-item label="活动性质">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="活动形式">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 E -->
  </section>
</template>

<script>
import { shopTransferList } from "@/api/shop";
import pageing from "@/components/pageing";
import tableItem from "@/components/tableItem";
export default {
  name: "shopTransfer",
  components: {
    pageing,
    tableItem
  },
  props: {
    food: {
      type: String,
      default: "apple"
    }
  },
  // 页面还没有渲染时的方法  这里没有this
  // beforeRouteEnter(to, from, next) {
  // console.log(to.name);
  // next();
  // r如果想用this 可以在next生成一个实例
  // next(vm =>{
  //   console.log(vm)
  // })
  // },
  // 离开页调用方法
  // beforeRouteLeave(to, from, next) {
  // next();
  // const leave = confirm("您确定要离开吗？");
  // if (leave) next();
  // else next(false);
  // },
  data() {
    return {
      // 表头数据 这里的key对应要显示的字段名称   切记
      columns: [
        {
          key: "operating",
          label: "操作",
          width: "200"
        },
        {
          key: "checked",
          width: "50"
        },
        {
          key: "id",
          label: "id",
          width: "80"
        },
        {
          key: "contact_name",
          label: "姓名",
          width: "100"
        },
        {
          key: "format_city_id",
          label: "城市",
          width: "100"
        },
        {
          key: "contact_phone",
          label: "手机号码",
          width: "150"
        },
        {
          key: "category",
          label: "类型",
          width: "150"
        },
        {
          key: "title",
          label: "标题"
        }
      ],
      // 表格总数据
      tableData: [],
      multipleSelection: [], //记录表格选中的值
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      loading: true, //添加loading
      centerDialogVisible: false,
      dialogData: "",
      isDialog: false, //不要遮罩
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  created() {
    this.shopTransferList();
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    // 批量删除
    toggleSelection(rows, index) {
      this.tableData = this.tableData.filter(u => {
        let i = true;
        this.multipleSelection.forEach(v => {
          if (v.id === u.id) {
            i = false;
          }
        });
        return i;
      });
    },

    // 每页显示的条数
    handleSizeChange(val) {
      this.loading = true;
      // 改变每页显示的条数
      this.PageSize = val;
      this.shopTransferList();
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1;
    },
    // 显示第几页
    handleCurrentChange(val) {
      this.loading = true;
      // 改变默认的页数
      this.currentPage = val;
      this.shopTransferList();
    },
    // 获取用户列表
    shopTransferList() {
      let param = {
        page_size: this.PageSize,
        page_num: this.currentPage
      };
      shopTransferList(param)
        .then(res => {
          if (res.data.code != 1)
            return this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          this.loading = false;
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.total_records;
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    // 表格自定义排序
    formatter(row, column) {
      console.log(row.address);
    },
    // 编辑表格
    handleEdit(id) {
      this.centerDialogVisible = !this.centerDialogVisible;
    },
    // 删除表格
    handleDelete(index, row) {
      this.deleData = this.tableData.splice(index, 1);
    },
    //选中的值
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>


<template>
  <div>
    <quill-editor :content="content" v-on:onEditorChange="onEditorChange"></quill-editor>
  </div>
</template>

<script>
import quillEditor from "@/components/quillEditor";
export default {
  name: "email",
  components: {
    quillEditor
  },
  data() {
    return {
      content: "<h2>我是富文本</h2>"
    };
  },
  methods: {
    handleClick() {
      this.$bus.$emit("on-click", "hello");
    },

    // 富文本改变值时保存
    onEditorChange(res) {
      this.content = res;
    }
  },
  mounted() {
    // console.log(this.$bus);
  }
};
</script>
<style>
</style>


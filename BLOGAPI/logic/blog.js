const { moveFile } = require('./upload');
const { execute, music_path, music_bg, blog_path } = require('../utils/config');
const { error, success } = require('../utils/utils');// 获取所有用户

// 获取博客列表
const getBlogList = async (req, res) => {
  try {
    let { search, page_num, page_size } = req.body;
    if (!page_num) page_num = 1;
    if (!page_size) page_size = 12;
    let page = Number(page_num - 1) * page_size;
    let pageSize = Number(page_size);
    let where = 'where 1=1';
    if (search !== 1 && search) {
      where = `where a.class_id = ${ search }`
    }
    let rows = await execute(`select a.*,c.class_name from blog_list as a left join blog_class c on a.class_id = c.id ${ where } and a.status <> 0 ORDER BY  a.is_top desc, a.create_time desc limit ?,?`, [page, pageSize])
    rows.map(async(key, index) => {
      if (rows[index].cover) {
        rows[index].cover_path = `${blog_path}${ rows[index].cover}`;
      }
      let tagList = await execute(`select * from blog_tag where id in (?) and status <> 0`, [rows[index].tag_id.split(',')]);
      rows[index].tag_name = tagList
    })
    let _rows = await execute(`select count(*) as total from blog_list a ${ where } and status <> 0`);
    let total = _rows[0].total;
    let total_page = Math.ceil(_rows[0].total / page_size);
    let r = { code: 1, msg: '查询成功', total, total_page }
    r.data = rows;
    res.send(r);
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 添加博客
const addBlog = async (req, res) => {
  try {
    let { markdown, html, cover, title, class_id, tag_id } = req.body;
    if (!title) return res.send(error('歌名不能为空'));
    if (!cover) return res.send(error('图片不能为空'));
    if (!class_id) return res.send(error('音乐作者不能为空'));
    if (!tag_id) return res.send(error('音乐地址不能为空'));
    if (!markdown) return res.send(error('内容不能为空'));
    if (!html) return res.send(error('内容不能为空'));
    await execute('insert into blog_list(`title`, cover, class_id, tag_id, markdown, html, create_time, update_time)value(?,?,?,?,?,?,?,?)', [title, cover, class_id, tag_id, markdown, html, new Date().getTime(), new Date().getTime()]);
    res.send(success('新增成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 编辑博客
const editBlog = async (req, res) => {
  try {
    let { markdown, html, cover, title, class_id, tag_id, id } = req.body;
    if (!id) return res.send(error('id不能为空'));
    if (!title) return res.send(error('歌名不能为空'));
    if (!cover) return res.send(error('图片不能为空'));
    if (!class_id) return res.send(error('音乐作者不能为空'));
    if (!tag_id) return res.send(error('音乐地址不能为空'));
    if (!markdown) return res.send(error('内容不能为空'));
    if (!html) return res.send(error('内容不能为空'));
    await execute('update blog_list set `title`=?, cover=?, class_id=?, tag_id=?, markdown=?, html=?, create_time=?, update_time=? where id=?', [title, cover, class_id, tag_id, markdown, html, new Date().getTime(), new Date().getTime(), id]);
    res.send(success('修改成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}



// 删除博客
const deleteBlog = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) return res.send(error('id不能为空'));
    let newId = null
    if (id.toString().indexOf(',') == -1) {
      newId = id
    } else {
      newId = id.split(',')
    }
    await execute('update blog_list set status = 0, update_time = ? where id in (?)', [new Date().getTime(), newId]);
    res.send(success('删除成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 取消置顶或者置顶
const cancelTop = async (req, res) => {
  try {
    let { id, is_top } = req.body;
    if (!id) return res.send(error('id不能为空'));
    if (is_top === '') return res.send(error('is_top不能为空'));
    let newId = null
    if(id.toString().indexOf(',') == -1){
      newId = id
    }else{
      newId = id.split(',')
    }
    await execute('update blog_list set is_top = ?, update_time = ? where id in (?)', [is_top, new Date().getTime(), newId]);
    res.send(success('操作成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 获取music列表
const getMusicList = async (req, res) => {
  try {
    let { page_num, page_size } = req.body;
    if (!page_num) page_num = 1;
    if (!page_size) page_size = 10;
    let page = Number(page_num - 1) * page_size;
    let pageSize = Number(page_size);
    let result = await execute(`select * from music_list where status <> 0 limit ?,?`, [page, pageSize])
    if(result.length === 0)return res.send(success(`查询音乐为空`, result));
    result.map((key, index) => {
      if (result[index].song_url) {
        result[index].song_path = `${music_path}${ result[index].song_url}`;
        result[index].bg_path = `${music_bg}${ result[index].bg_url}`;
      }
    })
    let _rows = await execute(`select count(*) as total from music_list where status <> 0`);
    let total = _rows[0].total;
    let total_page = Math.ceil(_rows[0].total / page_size);
    let r = { code: 1, msg: '查询成功', total, total_page }
    r.data = result.sort(() => Math.random() > .5 ? -1 : 1);
    res.send(r);
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 删除音乐
const deleteMusic = async (req, res) => {
  try {
    let { id } = req.body;
    if(!id)return res.send(error('id不能为空'));
    await execute('update music_list set `status` = 0 where id = ?', [id])
    res.send(success('删除成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 添加音乐
const addMusic = async (req, res) => {
  try {
    let { song_name, source, singer, song_url, bg_url, describe } = req.body;
    if (!song_name) return res.send(error('歌名不能为空'));
    if (!source) return res.send(error('图片来源不能为空'));
    if (!singer) return res.send(error('音乐作者不能为空'));
    if (!song_url) return res.send(error('音乐地址不能为空'));
    if (!bg_url) return res.send(error('图片地址不能为空'));
    let new_bg_url = bg_url.split('_')
    let new_song_url = song_url.split('_')
    await moveFile(bg_url, 'music_bg')
    await moveFile(song_url, 'music')
    await execute('insert into music_list(song_name,source,singer,song_url,bg_url,`describe`,create_time)value(?,?,?,?,?,?,?)', [song_name, source, singer, new_song_url[new_song_url.length - 1], new_bg_url[new_bg_url.length - 1], describe, new Date().getTime()]);
    res.send(success('新增成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 添加音乐
const musicDetail = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) return res.send(error('id不能为空'));
    let result = await execute('select * from music_list where id=?', [id]);
    res.send(success('获取成功', result));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 编辑音乐
const editMusic = async (req, res) => {
  try {
    let { id, song_name, source, singer, song_url, bg_url, describe } = req.body;
    if (!id) return res.send(error('id不能为空'));
    if (!song_name) return res.send(error('歌名不能为空'));
    if (!source) return res.send(error('图片来源不能为空'));
    if (!singer) return res.send(error('音乐作者不能为空'));
    if (!song_url) return res.send(error('音乐地址不能为空'));
    if (!bg_url) return res.send(error('图片地址不能为空'));
    let result = await execute(`select * from music_list where id = ?`, [id]);
    if (result.length <= 0) return res.send(error('歌曲不存在'))
    let new_bg_url = bg_url.split('_')
    let new_song_url = song_url.split('_')
    if (result[0].bg_url !== bg_url) {
      await moveFile(bg_url, 'music_bg')
    }
    if (result[0].song_url !== song_url) {
      await moveFile(song_url, 'music')
    }
    await execute('update music_list set `song_name`=?, `source`=?, `singer`=?, `song_url`=?, `bg_url`=?, `describe`=?, `create_time`=? where `id` = ?', [song_name, source, singer, new_song_url[new_song_url.length - 1], new_bg_url[new_bg_url.length - 1], describe, new Date().getTime(), id])
    res.send(success('修改成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 获取博客详情
const getBlogDetail = async (req, res) => {
  try {
    let { id } = req.body;
    if(!id)return res.send(error('id不能为空'));
    let result = await execute(`select * from blog_list where id = ? and status <> 0`, [id])
    if(result.length === 0)return res.send(success(`没有查询到ID为${id}的文章`, result));
    result.map((key, index) => {
      if (result[index].cover) {
        result[index].cover_url = `${blog_path}${ result[index].cover}`;
      }
    })
    res.send(success('查询成功', result));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 获取博客class
const getBlogClassNameList = async (req, res) => {
  try {
    let result = await execute(`select * from blog_list where status <> 0`)
    let _rows = await execute(`select a.class_name, a.id, count(l.class_id) total from blog_class a left join blog_list l on a.id = l.class_id where a.status <> 0 group by a.class_name,a.id ORDER BY a.id asc`)
    _rows[0].total = result.length
    res.send(success('查询成功', _rows));
  } catch (e) {
    console.error(e)
    res.send(error('服务器错误'))
  }
}

// 编辑博客class
const editBlogClass = async (req, res) => {
  try {
    let { id, class_name } = req.body;
    if(!id)return res.send(error('id不能为空'));
    if(!class_name) return res.send(error('分类不能为空'));
    await execute('update blog_class set `class_name` = ? where id = ?', [class_name, id])
    res.send(success('修改成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 添加博客class
const addBlogClass = async (req, res) => {
  try {
    let { class_name } = req.body;
    if (!class_name) return res.send(error('分类不能为空'));
    let result = await execute(`select * from blog_class where class_name = ?`, [class_name]);
    if (result.length > 0) return res.send(error('分类已存在'))
    await execute(`insert into blog_class(class_name)value(?)`, [class_name]);
    res.send(success('新增成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 删除博客class
const deleteBlogClass = async (req, res) => {
  try {
    let { id } = req.body;
    if(!id)return res.send(error('id不能为空'));
    await execute('update blog_class set `status` = 0 where id = ?', [id])
    res.send(success('删除成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 获取博客tag
const getBlogTagList = async (req, res) => {
  try {
    let result = await execute(`select * from blog_tag where status <> 0`)
    res.send(success('查询成功', result));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 编辑博客tag
const editBlogTag = async (req, res) => {
  try {
    let { id, tag_name } = req.body;
    if(!id)return res.send(error('id不能为空'));
    if(!tag_name) return res.send(error('标签不能为空'));
    await execute('update blog_tag set `tag_name` = ? where id = ?', [tag_name, id])
    res.send(success('修改成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 添加博客tag
const addBlogTag = async (req, res) => {
  try {
    let { tag_name } = req.body;
    if(!tag_name) return res.send(error('标签不能为空'));
    let result = await execute(`select * from blog_tag where tag_name = ?`, [tag_name]);
    if(result.length > 0)return res.send(error('标签已存在'))
    await execute(`insert into blog_tag(tag_name)value(?)`, [tag_name]);
    res.send(success('新增成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 删除博客tag
const deleteBlogTag = async (req, res) => {
  try {
    let { id } = req.body;
    if(!id)return res.send(error('id不能为空'));
    await execute('update blog_tag set `status` = 0 where id = ?', [id])
    res.send(success('删除成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 博客点赞
const getBlogLike = async (req, res) => {
  try {
    let { id } = req.body;
    if(!id)return res.send(error('id不能为空'));
    let result =  await execute('update blog_list set `like` = `like` + 1 where id = ?',[id])
    if (!result.affectedRows) return res.send(error('点赞失败id或者其它错误'))
    res.send(success('点赞成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 博客点击量
const getBlogHits = async (req, res) => {
  try {
    let { id } = req.body;
    if(!id)return res.send(error('id不能为空'));
    let result =  await execute('update blog_list set `hits` = `hits` + 1 where id = ?',[id])
    if (!result.affectedRows) return res.send(error('点击量添加失败'))
    res.send(success('点击量添加成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

module.exports = {
  getBlogList,
  addBlog,
  editBlog,
  cancelTop,
  deleteBlog,
  getBlogLike,
  getMusicList,
  getBlogHits,
  getBlogDetail,
  getBlogTagList,
  editBlogTag,
  deleteBlogTag,
  addBlogTag,
  getBlogClassNameList,
  editBlogClass,
  addBlogClass,
  deleteBlogClass,
  deleteMusic,
  addMusic,
  editMusic,
  musicDetail
}

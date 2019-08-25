const { moveFile } = require('./upload');
const {  execute, createToken, verifyToken, sever_url } = require('../utils/config');
const { error, success, timestampToTime } = require('../utils/utils');

// 获取所有用户
const getUserAll = async (req, res) => {
  try {
    let { search, page_num, page_size } = req.body;
    if (!page_num) page_num = 1;
    if (!page_size) page_size = 10;
    let page = Number(page_num - 1) * page_size;
    let pageSize = Number(page_size);
    let where = 'where 1=1';
    if (search) {
      where = `where contact_phone like '%${ search }%' or nickname like '%${ search }%'`
    }
    let rows = await execute(`select * from user ${ where } and status <> -1 limit ?,?`, [page, pageSize])
    rows.map((key, index) => {
      if (rows[index].thumb_img_url) {
        rows[index].url = `${sever_url}${ rows[index].thumb_img_url }`;
      }
      delete rows[index].password
    })
    let _rows = await execute(`select count(*) as  total from user ${ where } and status <> -1`);
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

// 用户登录
const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username) return res.status(200).send(error('用户名不能为空')).end();
    if (!password) return res.status(200).send(error('密码不能为空')).end();
    let login = await execute(`select * from user where nickname = ?`, [username]);
    if (login.length <= 0) return res.send(error('用户不存在'));
    if (login[0].status === -1) return res.send(error('账号已禁用'));
    let isPassword = (password === login[0].password);
    if (!isPassword) return res.send(error('密码不正确'));
    // Token 数据
    const userInfo = { admin: true, name: login[0].id, }
    const token = await createToken(userInfo);
    await execute(`update user set token=?,login_time=? WHERE id=?`, [token, new Date().getTime(), login[0].id])
    res.send(success('登录成功', token));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 验证token
const getUserInfo = async (req, res) => {
  try {
    let r = { code: -1, msg: 'token失效', }
    let { token } = req.body;
    if (!token) return res.status(200).send({code: 0, msg: 'token为空'});
    let user = await verifyToken(token);
    if (user.iat >= user.exp) return res.send(r);
    let userInfo = await execute(`select * from user where id = ?`, [user.name]);
    if (userInfo[0].token !== token) return res.send(r)
    userInfo[0].thumb_img_url = `${sever_url}${ userInfo[0].thumb_img_url}`;
    delete userInfo[0].password;
    res.send(success('验证成功', userInfo));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 注册
const register = async (req, res) => {
  try {
    let {  username, password } = req.body;
    if (!username) return res.status(200).send(error('用户名不能为空')).end();
    if (!password) return res.status(200).send(error('密码不能为空')).end();
    let validateUser = await execute(`select * from user where nickname = ?`, [username]);
    if (validateUser.length > 0) return res.send(error('用户已存在'));
    let time = new Date().getTime();
    await execute(`insert into user(nickname,password,create_time,update_time)value(?,?,?,?)`, [username, password, time, time]);
    res.send(success('注册成功'))
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 修改密码
const editPassword = async (req, res) => {
  try {
    let { id, password, new_password } = req.body;
    if (!id && id != 0) return res.send(error('id不能为空'));
    if (!password) return res.send(error('密码不能为空'));
    if (!new_password) return res.status(200).send(error('新密码不能为空'));
    let validateUser = await execute(`select * from user where id = ?`, [id]);
    if (validateUser.length <= 0) return res.send(error('用户不存在'));
    let isPassword = (password === validateUser[0].password);
    if (!isPassword) return res.send(error('原始密码不正确'));
    await execute(`update user set password=?, update_time=? WHERE id=?`, [new_password, new Date().getTime(), id])
    res.send(success('修改密码成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 修改用户信息
const editUserInfo = async (req, res) => {
  try {
    let { id, sex_id, status, portrait, contact_phone } = req.body;
    if (!id && id != 0) return res.status(200).send(error('id不能为空')).end();
    let validateUser = await execute(`select * from user where id = ?`, [id]);
    if (validateUser.length <= 0) return res.send(error('用户不存在'));
    let userInfo = await execute(`select * from user where id = ?`,[id]);
    let new_portrait = portrait.split('_')
    if (portrait !== userInfo[0].thumb_img_url) { await moveFile(portrait, 'user_picture') }
    await execute(`update user set thumb_img_url=?, sex_id=?, status=?, contact_phone=?, update_time=? where id in (?)`, [new_portrait[new_portrait.length - 1], sex_id, status, contact_phone, new Date().getTime(), id]);
    res.send(success('修改用户信息成功'));
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 删除用户
const deleteUserInfoAll = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) return res.send(error('id不能为空'));
    let newId = null
    if (id.toString().indexOf(',') == -1) {
      newId = id
    } else {
      newId = id.split(',')
    }
    await execute(`update user set status = '-1', update_time=? where id in (?)`, [new Date().getTime(), newId]);
    res.send(success('删除用户信息成功'))
  } catch (e) {
    res.send(error('服务器错误'))
    console.error(e)
  }
}

// 全局验证 token 
const validateToken = async (req, res, next) => {
  if (req.get('token')) {
    try {
      let r = {  code: -1,  msg: 'token失效', }
      let user = await verifyToken(req.get('token'));
      if (user.iat >= user.exp) return res.send(r);
      let userInfo = await execute(`select * from user where id = ?`, [user.name]);
      if (userInfo[0].token !== req.get('token')) return res.send(r)
      next()
    } catch (e) {
      console.error(e)
    }
  } else {
    let t = {  code: -1,  msg: '请求头添加token', }
    res.send(t)
  }
}

module.exports = {
  login,
  register,
  getUserAll,
  validateToken,
  editUserInfo,
  editPassword,
  getUserInfo,
  deleteUserInfoAll
}

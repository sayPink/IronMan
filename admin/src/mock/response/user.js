import Mock from 'mockjs'

const Random = Mock.Random;


export const userInfoList = (options) => {
  const template = {
    'list|100-200': [{
      'id|+1': 1,
      'nickname': Random.cname(),
      'address': Random.province(),
      'date': Random.date('yyyy-MM-dd'),
      'content|1-20': 'GH123DSED',
      'title': Random.cparagraph(5, 10),
      'image': Random.image('30x30'),
      'birthday': Random.date('yyyy-MM-dd')
    }],
  }
  return Mock.mock(template)
}



export const setUserInfo = (options) => {
  //第二种方法
  const template = {
    'str|2-4': 'lison',
    'name|5': 'lison',
    'age|+2': 18,
    'num|4-10': 0,
    'float|3-10.2-5': 0,
    'bool|1': true, //概率 1/2
    'bool2|1-9': true, //概率 1/10 公式min/(min+max)
    'obj|2': {
      a: 'aa',
      b: 'bb',
      c: 'cc'
    },
    'obj|1-2': {
      a: 'aa',
      b: 'bb',
      c: 'cc'
    },
    'arr|2-4': [1, 2, 3],
    'arr2|2': ['a', 'b'],
    'func': () => {
      return 'this is created by function'
    },
    'reg': /[1-9][a-z]/,
    email: Mock.mock('@email'), //占位符
    range: Random.range[3, 6, 1],
  }
  return Mock.mock(template)

  // 第一种方法
  //   return {
  //     code: 1,
  //     data: [{
  //       name: 'lison',
  //       id: 1
  //     }, {
  //       name: '777',
  //       id: 2
  //     }]
  //   }
}


export const getUserInfo = (options) => {
  const template = {
    'nickname': Random.cname(),
    'id': Random.integer(1, 5),
    'title': Random.cparagraph(5, 10),
    'token|1-20': 'GGH123D456SESED',
    'thumbImg': Random.image('30x30'),
    'bigThumbImg': Random.image('80x80')
  }
  return Mock.mock(template)
}

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    default: {
      return
    }
  }
}

async function sendTemplateMessage(event) {
  const { OPENID } = cloud.getWXContext()
  
  const sendResult = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    templateId: 'hi06XFZXHrayi3Jr5q1psqwTc93hWWEN_x2_e4nVM30',
    formId: event.formId,
    page: 'pages/openapi/openapi',
    data: {
      keyword1: {
        value: event.name,
      },
      keyword2: {
        value: event.number,
      },
      keyword3: {
        value: event.school,
      },
      keyword4: {
        value: event.classname,
      },
      keyword5: {
        value: event.tel,
      },
      keyword6: {
        value: event.active,
      },
      keyword7: {
        value: event.time,
      },
      keyword8: {
        value: '报名成功',
      }
    }
  })
  return sendResult
}

async function getWXACode(event) {

  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}

async function getOpenData(event) {
  // 需 wx-server-sdk >= 0.5.0
  return cloud.getOpenData({
    list: event.openData.list,
  })
}

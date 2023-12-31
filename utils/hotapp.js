var hotAppHost = "https://wxapi.hotapp.cn",
  hotAppKey = "",
  hotAppUUID = "",
  userInfo = "",
  hotAppVersion = "1.4.0",
  hotAppUUIDCache = "hotAppUUID",
  hotAppEventCache = "hotAppEvent",
  hotAppOpenIdCache = "hotAppOpenId",
  uploadType = 0,
  debugarr = [],
  hotAppDebug = !1;

function onError(a, f, b) {
  var c = getSystemInfo(),
    d = getUserInfo(),
    e = hotAppHost + "/api/error";
  a = {
    appkey: getHotAppKey(),
    system_info: c,
    user_info: d,
    version: f,
    msg: a
  };
  http(e, a, b)
}

function getVersion() {
  return hotAppVersion
}

function setDebug(a) {
  hotAppDebug = void 0 === a ? !1 : a
}

function log(a) {
  hotAppDebug
}

function getOpenID() {
  return wx.getStorageSync(hotAppOpenIdCache)
}

function setOpenID(a) {
  wx.setStorageSync(hotAppOpenIdCache, a)
}

function getLocalKey() {
  var a = wx.getStorageSync("key");
  if (a) return a;
  a = userInfo.avatarUrl ? hotAppKey + userInfo.avatarUrl : hotAppKey + parseInt(9E4 * Math.random() + 1E4, 10);
  a = hex_md5(a);
  wx.setStorageSync("key", a);
  return a
}

function getFakeOpenID() {
  var a = getOpenID();
  return a ? a : getLocalKey()
}

function getPrefix(a) {
  return a + "_" + getFakeOpenID()
}

function genPrimaryKey(a) {
  var f = Date.parse(new Date);
  return a + "_" + getFakeOpenID() + "_" + 1E3 * f
}

function replaceOpenIdKey(a, f) {
  if (!getOpenID()) return "function" == typeof f && f(!1);
  var b = a.replace("_" + getLocalKey() + "_", "_" + getOpenID() + "_");
  return "function" == typeof f && f(b)
}

function login(a) {
  if (!hotAppKey) return "function" == typeof a && a(getFakeOpenID());
  var f = getOpenID();
  if (f) return "function" == typeof a && a(f);
  wx.login({
    success: function (b) {
      if (b.code) wx.request({
        url: hotAppHost + "/data/wechat/login",
        data: {
          hotAppKey: getHotAppKey(),
          code: b.code
        },
        method: "POST",
        success: function (b) {
          return (b = b.data.openid) ? (setOpenID(b), "function" == typeof a && a(b)) : "function" == typeof a && a(getFakeOpenID())
        },
        fail: function () {
          return "function" == typeof a && a(getFakeOpenID())
        }
      });
      else return "function" == typeof a &&
        a(getFakeOpenID())
    },
    fail: function () {
      return "function" == typeof a && a(getFakeOpenID())
    }
  })
}

function init(a) {
  if (!a) return log("appkey\u4e0d\u80fd\u4e3a\u7a7a"), "function" == typeof cb && cb(!1);
  if (hotAppKey) return log("\u5df2\u7ecf\u521d\u59cb\u5316\u8fc7\u4e86"), "function" == typeof cb && cb(!1);
  hotAppKey = a;
  wx.login({
    success: function (a) {
      getOpenID() ? wx.getUserInfo({
        success: function (a) {
          userInfo = a.userInfo;
          sendLaunch()
        }
      }) : getHotAppUUID() ? wx.getUserInfo({
        success: function (a) {
          userInfo = a.userInfo;
          sendLaunch()
        }
      }) : a.code ? wx.request({
        url: hotAppHost + "/data/wechat/login",
        data: {
          hotAppKey: getHotAppKey(),
          code: a.code
        },
        method: "POST",
        success: function (a) {
          (a = a.data.openid) && setOpenID(a);
          wx.getUserInfo({
            success: function (a) {
              userInfo = a.userInfo;
              sendLaunch()
            }
          })
        },
        fail: function () {
          wx.getUserInfo({
            success: function (a) {
              userInfo = a.userInfo;
              sendLaunch()
            }
          })
        }
      }) : wx.getUserInfo({
        success: function (a) {
          userInfo = a.userInfo;
          sendLaunch()
        }
      })
    },
    fail: function () {
      wx.getUserInfo({
        success: function (a) {
          userInfo = a.userInfo;
          sendLaunch()
        }
      })
    }
  })
}

function sendLaunch() {
  wx.request({
    url: hotAppHost + "/data/wechat/launch",
    data: {
      hotAppKey: getHotAppKey(),
      openId: getOpenID(),
      hotAppUUID: getHotAppUUID(),
      userInfo: getUserInfo(),
      systemInfo: getSystemInfo(),
      phoneTime: Date.parse(new Date) / 1E3,
      hotAppVersion: hotAppVersion
    },
    method: "POST",
    success: function (a) {
      0 == uploadType && (uploadType = a.data.upload_type);
      if (0 != uploadType) {
        var f = wx.getStorageSync("hotAppEvent") || [];
        0 != f.length && wx.request({
          url: hotAppHost + "/data/wechat/event",
          data: {
            hotAppKey: getHotAppKey(),
            openId: wetChatOpenId,
            hotAppUUID: getHotAppUUID(),
            eventArray: f
          },
          method: "POST",
          success: function (a) {
            log(wx.getStorageSync("hotAppEvent") || []);
            log(a.data);
            try {
              wx.removeStorageSync("hotAppEvent")
            } catch (c) {
              log(c)
            }
          },
          fail: function () {
            log("send event fail");
            wx.setStorageSync("hotAppEvent", f)
          }
        })
      }
    },
    fail: function (a) {
      log("send launch fail " + a)
    }
  })
}

function onEvent(a, f) {
  f = void 0 === f ? "" : f;
  if ("" == hotAppKey) log("hotappkey is empty");
  else {
    var b = wx.getStorageSync("hotAppEvent") || [],
      c = {
        eventId: a,
        eventValue: f,
        phoneTime: Date.parse(new Date) / 1E3
      };
    b.push(c);
    0 != uploadType ? wx.setStorageSync("hotAppEvent", b) : wx.request({
      url: hotAppHost + "/data/wechat/event",
      data: {
        hotAppKey: getHotAppKey(),
        openId: getOpenID(),
        hotAppUUID: getHotAppUUID(),
        eventArray: b,
        hotAppVersion: hotAppVersion
      },
      method: "POST",
      success: function (a) {
        log(wx.getStorageSync("hotAppEvent") || []);
        try {
          wx.removeStorageSync("hotAppEvent")
        } catch (b) {
          log(b)
        }
      },
      fail: function () {
        log("send event fail");
        wx.setStorageSync("hotAppEvent", b)
      }
    })
  }
}

function getHotAppUUID() {
  if ("" == hotAppKey) log("hotappkey is empty");
  else {
    if ("" == hotAppUUID)
      if ("" == wx.getStorageSync(hotAppUUIDCache)) {
        if ("" == userInfo) return log("userInfo is null"), "";
        hotAppUUID = "" == userInfo.avatarUrl ? hex_md5(hotAppKey + userInfo.nickName) : hex_md5(hotAppKey + userInfo.avatarUrl);
        wx.setStorageSync(hotAppUUIDCache, hotAppUUID)
      } else hotAppUUID = wx.getStorageSync(hotAppUUIDCache);
    return hotAppUUID
  }
}

function getHotAppKey() {
  return hotAppKey
}

function clearData() {
  hotAppUUID = "";
  wx.clearStorage()
}

function getUserInfo() {
  return userInfo
}

function getSystemInfo() {
  return wx.getSystemInfoSync()
}

function setEventUploadType(a) {
  uploadType = a
}
var hexcase = 0,
  b64pad = "",
  chrsz = 8;

function hex_md5(a) {
  return "uuid_" + binl2hex(core_md5(str2binl(a), a.length * chrsz))
}

function b64_md5(a) {
  return binl2b64(core_md5(str2binl(a), a.length * chrsz))
}

function str_md5(a) {
  return binl2str(core_md5(str2binl(a), a.length * chrsz))
}

function hex_hmac_md5(a, f) {
  return binl2hex(core_hmac_md5(a, f))
}

function b64_hmac_md5(a, f) {
  return binl2b64(core_hmac_md5(a, f))
}

function str_hmac_md5(a, f) {
  return binl2str(core_hmac_md5(a, f))
}

function core_md5(a, f) {
  a[f >> 5] |= 128 << f % 32;
  a[(f + 64 >>> 9 << 4) + 14] = f;
  for (var b = 1732584193, c = -271733879, d = -1732584194, e = 271733878, g = 0; g < a.length; g += 16) var h = b,
    k = c,
    l = d,
    m = e,
    b = md5_ff(b, c, d, e, a[g + 0], 7, -680876936),
    e = md5_ff(e, b, c, d, a[g + 1], 12, -389564586),
    d = md5_ff(d, e, b, c, a[g + 2], 17, 606105819),
    c = md5_ff(c, d, e, b, a[g + 3], 22, -1044525330),
    b = md5_ff(b, c, d, e, a[g + 4], 7, -176418897),
    e = md5_ff(e, b, c, d, a[g + 5], 12, 1200080426),
    d = md5_ff(d, e, b, c, a[g + 6], 17, -1473231341),
    c = md5_ff(c, d, e, b, a[g + 7], 22, -45705983),
    b = md5_ff(b, c, d, e, a[g + 8], 7,
      1770035416),
    e = md5_ff(e, b, c, d, a[g + 9], 12, -1958414417),
    d = md5_ff(d, e, b, c, a[g + 10], 17, -42063),
    c = md5_ff(c, d, e, b, a[g + 11], 22, -1990404162),
    b = md5_ff(b, c, d, e, a[g + 12], 7, 1804603682),
    e = md5_ff(e, b, c, d, a[g + 13], 12, -40341101),
    d = md5_ff(d, e, b, c, a[g + 14], 17, -1502002290),
    c = md5_ff(c, d, e, b, a[g + 15], 22, 1236535329),
    b = md5_gg(b, c, d, e, a[g + 1], 5, -165796510),
    e = md5_gg(e, b, c, d, a[g + 6], 9, -1069501632),
    d = md5_gg(d, e, b, c, a[g + 11], 14, 643717713),
    c = md5_gg(c, d, e, b, a[g + 0], 20, -373897302),
    b = md5_gg(b, c, d, e, a[g + 5], 5, -701558691),
    e = md5_gg(e, b, c, d, a[g +
      10], 9, 38016083),
    d = md5_gg(d, e, b, c, a[g + 15], 14, -660478335),
    c = md5_gg(c, d, e, b, a[g + 4], 20, -405537848),
    b = md5_gg(b, c, d, e, a[g + 9], 5, 568446438),
    e = md5_gg(e, b, c, d, a[g + 14], 9, -1019803690),
    d = md5_gg(d, e, b, c, a[g + 3], 14, -187363961),
    c = md5_gg(c, d, e, b, a[g + 8], 20, 1163531501),
    b = md5_gg(b, c, d, e, a[g + 13], 5, -1444681467),
    e = md5_gg(e, b, c, d, a[g + 2], 9, -51403784),
    d = md5_gg(d, e, b, c, a[g + 7], 14, 1735328473),
    c = md5_gg(c, d, e, b, a[g + 12], 20, -1926607734),
    b = md5_hh(b, c, d, e, a[g + 5], 4, -378558),
    e = md5_hh(e, b, c, d, a[g + 8], 11, -2022574463),
    d = md5_hh(d, e, b, c, a[g +
      11], 16, 1839030562),
    c = md5_hh(c, d, e, b, a[g + 14], 23, -35309556),
    b = md5_hh(b, c, d, e, a[g + 1], 4, -1530992060),
    e = md5_hh(e, b, c, d, a[g + 4], 11, 1272893353),
    d = md5_hh(d, e, b, c, a[g + 7], 16, -155497632),
    c = md5_hh(c, d, e, b, a[g + 10], 23, -1094730640),
    b = md5_hh(b, c, d, e, a[g + 13], 4, 681279174),
    e = md5_hh(e, b, c, d, a[g + 0], 11, -358537222),
    d = md5_hh(d, e, b, c, a[g + 3], 16, -722521979),
    c = md5_hh(c, d, e, b, a[g + 6], 23, 76029189),
    b = md5_hh(b, c, d, e, a[g + 9], 4, -640364487),
    e = md5_hh(e, b, c, d, a[g + 12], 11, -421815835),
    d = md5_hh(d, e, b, c, a[g + 15], 16, 530742520),
    c = md5_hh(c, d, e,
      b, a[g + 2], 23, -995338651),
    b = md5_ii(b, c, d, e, a[g + 0], 6, -198630844),
    e = md5_ii(e, b, c, d, a[g + 7], 10, 1126891415),
    d = md5_ii(d, e, b, c, a[g + 14], 15, -1416354905),
    c = md5_ii(c, d, e, b, a[g + 5], 21, -57434055),
    b = md5_ii(b, c, d, e, a[g + 12], 6, 1700485571),
    e = md5_ii(e, b, c, d, a[g + 3], 10, -1894986606),
    d = md5_ii(d, e, b, c, a[g + 10], 15, -1051523),
    c = md5_ii(c, d, e, b, a[g + 1], 21, -2054922799),
    b = md5_ii(b, c, d, e, a[g + 8], 6, 1873313359),
    e = md5_ii(e, b, c, d, a[g + 15], 10, -30611744),
    d = md5_ii(d, e, b, c, a[g + 6], 15, -1560198380),
    c = md5_ii(c, d, e, b, a[g + 13], 21, 1309151649),
    b = md5_ii(b,
      c, d, e, a[g + 4], 6, -145523070),
    e = md5_ii(e, b, c, d, a[g + 11], 10, -1120210379),
    d = md5_ii(d, e, b, c, a[g + 2], 15, 718787259),
    c = md5_ii(c, d, e, b, a[g + 9], 21, -343485551),
    b = safe_add(b, h),
    c = safe_add(c, k),
    d = safe_add(d, l),
    e = safe_add(e, m);
  return [b, c, d, e]
}

function md5_cmn(a, f, b, c, d, e) {
  return safe_add(bit_rol(safe_add(safe_add(f, a), safe_add(c, e)), d), b)
}

function md5_ff(a, f, b, c, d, e, g) {
  return md5_cmn(f & b | ~f & c, a, f, d, e, g)
}

function md5_gg(a, f, b, c, d, e, g) {
  return md5_cmn(f & c | b & ~c, a, f, d, e, g)
}

function md5_hh(a, f, b, c, d, e, g) {
  return md5_cmn(f ^ b ^ c, a, f, d, e, g)
}

function md5_ii(a, f, b, c, d, e, g) {
  return md5_cmn(b ^ (f | ~c), a, f, d, e, g)
}

function core_hmac_md5(a, f) {
  var b = str2binl(a);
  16 < b.length && (b = core_md5(b, a.length * chrsz));
  for (var c = Array(16), d = Array(16), e = 0; 16 > e; e++) c[e] = b[e] ^ 909522486, d[e] = b[e] ^ 1549556828;
  b = core_md5(c.concat(str2binl(f)), 512 + f.length * chrsz);
  return core_md5(d.concat(b), 640)
}

function safe_add(a, f) {
  var b = (a & 65535) + (f & 65535);
  return (a >> 16) + (f >> 16) + (b >> 16) << 16 | b & 65535
}

function bit_rol(a, f) {
  return a << f | a >>> 32 - f
}

function str2binl(a) {
  for (var f = [], b = (1 << chrsz) - 1, c = 0; c < a.length * chrsz; c += chrsz) f[c >> 5] |= (a.charCodeAt(c / chrsz) & b) << c % 32;
  return f
}

function binl2str(a) {
  for (var f = "", b = (1 << chrsz) - 1, c = 0; c < 32 * a.length; c += chrsz) f += String.fromCharCode(a[c >> 5] >>> c % 32 & b);
  return f
}

function binl2hex(a) {
  for (var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", b = "", c = 0; c < 4 * a.length; c++) b += f.charAt(a[c >> 2] >> c % 4 * 8 + 4 & 15) + f.charAt(a[c >> 2] >> c % 4 * 8 & 15);
  return b
}

function binl2b64(a) {
  for (var f = "", b = 0; b < 4 * a.length; b += 3)
    for (var c = (a[b >> 2] >> b % 4 * 8 & 255) << 16 | (a[b + 1 >> 2] >> (b + 1) % 4 * 8 & 255) << 8 | a[b + 2 >> 2] >> (b + 2) % 4 * 8 & 255, d = 0; 4 > d; d++) f = 8 * b + 6 * d > 32 * a.length ? f + b64pad : f + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c >> 6 * (3 - d) & 63);
  return f
}

function searchkey(a, f) {
  var b = hotAppHost + "/api/searchkey",
    c = {
      appkey: hotAppKey
    },
    d;
  for (d in a) c[d] = a[d];
  http(b, c, f)
}

function get(a, f) {
  http(hotAppHost + "/api/get", {
    appkey: hotAppKey,
    key: a
  }, f)
}

function post(a, f, b) {
  http(hotAppHost + "/api/post", {
    appkey: hotAppKey,
    key: a,
    value: f
  }, b)
}

function del(a, f) {
  var b = hotAppHost + "/api/delete",
    c = {
      appkey: getHotAppKey(),
      key: a
    };
  http(b, c, f)
}

function feedback(a, f, b, c) {
  var d = getSystemInfo(),
    e = getUserInfo();
  if (!e) return log("userinfo is empty"), "function" == typeof c && c(!1);
  var g = hotAppHost + "/api/feedback";
  a = {
    appkey: getHotAppKey(),
    content: a,
    openid: getOpenID() ? getOpenID() : getFakeOpenID(),
    content_type: f,
    contract_info: b,
    system_info: d,
    user_info: e
  };
  http(g, a, c)
}

function uploadFeedbackImage(a) {
  wx.chooseImage({
    success: function (f) {
      console.log(f);
      wx.uploadFile({
        url: hotAppHost + "/api/feedback/image/upload",
        filePath: f.tempFilePaths[0],
        name: "file",
        formData: {
          appkey: getHotAppKey()
        },
        success: function (b) {
          b = JSON.parse(b.data);
          return 0 == b.ret ? "function" == typeof a && a(b.image_url) : "function" == typeof a && a(!1)
        },
        fail: function (b) {
          return "function" == typeof a && a(!1)
        }
      })
    },
    fail: function (f) {
      return "function" == typeof a && a(!1)
    }
  })
}

function http(a, f, b) {
  wx.request({
    url: a,
    data: f,
    method: "POST",
    header: {
      "content-type": "application/json"
    },
    success: function (a) {
      return "function" == typeof b && b(a.data)
    },
    fail: function () {
      return "function" == typeof b && b(!1)
    }
  })
}

function request(a) {
  0 == a.useProxy ? wx.request({
    url: a.url,
    data: a.data,
    header: a.header,
    method: a.method,
    success: function (f) {
      a.success(f)
    },
    fail: function (f) {
      a.fail(f)
    },
    complete: function (f) {
      a.complete(f)
    }
  }) : "" == hotAppKey ? log("hotappkey is empty") : wx.request({
    url: hotAppHost + "/proxy/?appkey=" + hotAppKey + "&url=" + a.url,
    data: a.data,
    header: a.header,
    method: a.method,
    success: function (f) {
      a.success(f)
    },
    fail: function (f) {
      a.fail(f)
    },
    complete: function (f) {
      a.complete(f)
    }
  })
}

function onLoad(a, f) {
  "object" == typeof a && a.__route__ ? "object" != typeof f || 0 == Object.getOwnPropertyNames(f).length ? log("param error") : "" == hotAppKey ? log("hotapp key is empty") : login(function (b) {
    var c = hotAppHost + "/data/wechat/param";
    b = {
      hotAppKey: hotAppKey,
      page: a.__route__,
      openId: b,
      hotAppUUID: getHotAppUUID(),
      paraInfo: f
    };
    http(c, b)
  }) : log("param error")
}
module.exports = {
  init: init,
  onEvent: onEvent,
  setEventUploadType: setEventUploadType,
  clearData: clearData,
  wxlogin: login,
  getFakeOpenID: getFakeOpenID,
  getOpenID: getOpenID,
  getPrefix: getPrefix,
  genPrimaryKey: genPrimaryKey,
  replaceOpenIdKey: replaceOpenIdKey,
  searchkey: searchkey,
  get: get,
  post: post,
  del: del,
  request: request,
  getVersion: getVersion,
  setDebug: setDebug,
  feedback: feedback,
  uploadFeedbackImage: uploadFeedbackImage,
  onError: onError,
  onLoad: onLoad
};
'use strict';
const cloud = require('wx-server-sdk')
 
cloud.init()
 
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	var moblie = event.weRunData.data.phoneNumber;
	return moblie;
}
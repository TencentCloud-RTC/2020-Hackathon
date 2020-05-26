//
//  TEURLStringMacros.h
//  TRTCEducation
//
//  Created by caijunlai on 2020/5/6.
//  Copyright © 2020 caijunlai. All rights reserved.
//

#ifndef TEURLStringMacros_h
#define TEURLStringMacros_h

#define TE_BASE_URL @"http://212.64.102.106:8046"

#define LOGIN_URL @"/server-uaa/oauth/token"
#define LOGOUT_URL @"/service-core/user/loginOut"

#define QUERY_COURSE_LIST @"/service-core/course/queryCourseList"
#define QUERY_MEMBER_LIST @"/service-core/liveRoomStudent/queryStudentList"
#define ENTER_LIVEROOM @"/service-core/liveRoomStudent/intoLiveRoom"
#define EXIT_LIVEROOM @"/service-core/liveRoomStudent/outLiveRoom"
#define ONLINE_MEMBER_LIST @"/service-core/onlineVoice/queryOnlineMemberList"
#define DELETE_ONLINE_MEMBER @"/service-core/onlineVoice/deleteOnlineMember"
#endif /* TEURLStringMacros_h */

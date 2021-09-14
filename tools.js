/**
 * @constructor
 * @description ITSONE API
 * @author soonhyeong
 * @version 0.0.1
 * @date 21. 09. 14
 */

// 자바처럼 쓰기 위해 작성
String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};

function chkMobile() {
  var mobileKeyWords = new Array('iPhone', 'iPod', 'iPad', 'BlackBerry', 'Android', 'Windows CE', 'MOT', 'SAMSUNG', 'SonyEricsson');
  for (var word in mobileKeyWords) {
    if (navigator.userAgent.match(mobileKeyWords[word]) != null) {
      location.href = "/mobile/index.asp";
      break;
    }
  }
}

// replace All
function replaceAll(str, searchStr, replaceStr) {
	  return str.split(searchStr).join(replaceStr);
}

// 특수문자 변환
function convertSpecialCharacters(content) {
	var returnValue = content;

	returnValue = replaceAll(returnValue, "&#039;", "'");
	returnValue = replaceAll(returnValue, "&amp;amp;", "&");
	returnValue = replaceAll(returnValue, "&amp;", "&");
	returnValue = replaceAll(returnValue, "&lt;", "<");
	returnValue = replaceAll(returnValue, "&gt;", ">");
	returnValue = replaceAll(returnValue, "&quot;", "\"");

	return returnValue;
}

// 서버 통신
function mAjax(sUrl, params, method, proYn, fnSuccess) {
  if(proYn) {
    progressStart();
  }

  var fnError = function(jqXHR, textStatus, errorThrown) {
    progressStop();
    alert("서버와의 통신에 오류가 있습니다. 잠시 후 다시 시도하여 주세요.");

    if(method == "POST") {
      var sParams = "";
      var i = 0;

      for(var key in params) {
        if(i == 0) {
          sParams += String.format("{0}={1}", key, params[key]);
        } else {
          sParams += String.format("&{0}={1}", key, params[key]);
        }
        i++;
      }

      console.log(sUrl + "?" + sParams);
    }
  };

  if(method == "GET") {
    var sParams = "";
    var i = 0;

    for(var key in params) {
      if(i == 0) {
        sParams += String.format("{0}={1}", key, params[key]);
      } else {
        sParams += String.format("&{0}={1}", key, params[key]);
      }
      i++;
    }

    console.log(sUrl + "?" + sParams);

    setTimeout(function() {
      $.ajax({ "async" : true
        , "type" : "GET"
        , "url" : sUrl
        , "data" : encodeURI(sParams)
        , "cache" : false
        , "success" : function(data) {
          progressStop();
          fnSuccess(data);
        }
        , "error" : fnError
        , "dataType" : "json"
        , "contentType" : "application/json; charset=utf-8"
      });
    }, 300);
  } else if(method == "POST") {
  	setTimeout(function() {
      $.ajax({ "async" : true
      	, "type" : "POST"
    		, "url" : sUrl
    		, "data" : params
    		, "cache" : false
    		, "success" : function(data) {
				progressStop();
    			var obj = JSON.parse(data);
    			fnSuccess(obj);
    		}
    		, "error" : fnError
      });
  	}, 300);
  }
}

function mFileAjax(sUrl, formData, fnSuccess) {
	var fnError = function(jqXHR, textStatus, errorThrown) {
		progressStop();
        alert("서버와의 통신에 오류가 있습니다. 잠시 후 다시 시도하여 주세요.");
    };

    if (fnSuccess != null) {
    	$.ajax({
            type : 'post',
            url : sUrl,
            data : formData,
            processData : false,
            contentType : false,
            success : function(data) {
            	fnSuccess(JSON.parse(data));
            },
            error : fnError
        });
    }
}

function moneyFormat(n) {
	if(n == null || n == "") {
		return "0";
	} else {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

/*
 * 캘린더 생성
 * */
function getCalendar(year, month) {
	var returnObj = [];
	var lastDay = new Date(year, Number(month), 0).dd();

	for(day=1; day<=lastDay; day++) {
		var tmpObj;
		var d = new Date(year, Number(month) - 1, day);

		tmpObj = {
			"date" : d.yyyymmdd(),
			"day" : d.dd(),
			"week" : d.weeknum() + 1
		}

		returnObj.push(tmpObj);
	}

	return returnObj;
}

/* 날짜 포맷
 * ex) new Date().yyyymmdd()
 *  */
function getDateFormat(sDate) {
	return new Date(sDate.substring(0, 4) + "-" + sDate.substring(4, 6) + "-" + sDate.substring(6, 8))
}

function addDate(sDate, value) {
	var day = Number(sDate.substring(6, 8)) + value;

	return new Date(sDate.substring(0, 4), Number(sDate.substring(4, 6)) - 1, day);
}

function addMonth(sDate, value) {
	var month = Number(sDate.substring(4, 6)) + (value - 1);

	return new Date(sDate.substring(0, 4), month, 1);
}

function addMonth2(sDate, value) {
	var month = Number(sDate.substring(4, 6)) + (value - 1);

	return new Date(sDate.substring(0, 4), month, Number(sDate.substring(6, 8)));
}

Date.prototype.yyyymmddhhmm = function() {
	var mm = this.getMonth() + 1;
	var dd = this.getDate();
	var hh = this.getHours();
	var mi = this.getMinutes();

	return [this.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd, (hh>9 ? '' : '0') + hh, (mi>9 ? '' : '0') + mi].join('');
};

Date.prototype.yyyymmdd = function() {
	var mm = this.getMonth() + 1;
	var dd = this.getDate();

	return [this.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('');
};

Date.prototype.yyyymm = function() {
	var mm = this.getMonth() + 1;

	return [this.getFullYear(), (mm>9 ? '' : '0') + mm].join('');
};

Date.prototype.yyyy = function() {
	return this.getFullYear();
};

Date.prototype.yy = function() {
	return this.getFullYear().toString().substring(2, 4)
};

Date.prototype.mm = function() {
	var mm = this.getMonth() + 1;

	return (mm>9 ? '' : '0') + mm;
};

Date.prototype.dd = function() {
	var dd = this.getDate();

	return (dd>9 ? '' : '0') + dd;
};

Date.prototype.week = function() {
	var week = ['일', '월', '화', '수', '목', '금', '토'];

	var dayOfWeek = week[this.getDay()];

	return dayOfWeek;
};

Date.prototype.hh = function() {
	var hh = this.getHours();

	return (hh>9 ? '' : '0') + hh;
};

Date.prototype.weeknum = function() {
	return this.getDay();
};

function getTimeStamp() {
  var d = new Date();
  var s = leadingZeros(d.getFullYear(), 4) + leadingZeros(d.getMonth() + 1, 2) + leadingZeros(d.getDate(), 2) +
          leadingZeros(d.getHours(), 2) + leadingZeros(d.getMinutes(), 2) + leadingZeros(d.getSeconds(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

/* 폰 번호 포멧 */
function phoneNumberFormat(phone, div) {
	return phone.substring(0, 3) + div + phone.substring(3, 7) + div + phone.substring(7, 11);
}

/* 프로그래스 모달 */
function progressStart() {
	$.preloader.start({
        modal: true,
        src : "/images/sprites.png"
    });
}

function progressStop() {
    $.preloader.stop();
}

var setCookie = function(name, value, day) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + day);

	var cookie_value = escape(value) + '; expires=' + exdate.toUTCString();
	document.cookie = name + '=' + cookie_value;
};

var getCookie = function(name) {
	var x, y;
	var val = document.cookie.split(';');

	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, '');
		if (x == name) {
		  return unescape(y);
		}
	}
};

/**
 * 파일명에서 확장자명 추출
 * @param filename   파일명
 * @returns _fileExt 확장자명
 */
function getExtensionOfFilename(filename) {
    var _fileExt = "";
    try {
      var _fileLen = filename.length;

      /**
       * lastIndexOf('.')
       * 뒤에서부터 '.'의 위치를 찾기위한 함수
       * 검색 문자의 위치를 반환한다.
       * 파일 이름에 '.'이 포함되는 경우가 있기 때문에 lastIndexOf() 사용
       */
      var _lastDot = filename.lastIndexOf('.');

      // 확장자 명만 추출한 후 소문자로 변경
      _fileExt = filename.substring(_lastDot + 1, _fileLen).toLowerCase();
    } catch(e) {

    }

    return _fileExt;
}

function ValidateNumber(pm_obj){
    var e1 = event.srcElement;
    var num="0123456789";
    event.returnValue = true;

    for (var i=0;i<e1.value.length;i++)
    if (-1 == num.indexOf(e1.value.charAt(i)))
       event.returnValue = false;

    if (!event.returnValue) {
      alert("숫자만 입력가능합니다.");
      pm_obj.value = "";
      pm_obj.focus();
    }
}

/**
 * 파일이 이미지인지 확인
 * @param filename 파일명
 * @returns
 */
function isImage(fileName) {
  var rValue = false;
  var s = getExtensionOfFilename(fileName);
  s = s.toLowerCase();

  switch(s) {
    case "bmp":
    case "gif":
    case "jpg":
    case "jpeg":
    case "png":
      rValue = true;
      break;
  }

  return rValue;
}

function getByteLengh(val){
    var codeByte = 0;
    for (var idx = 0; idx < val.length; idx++) {
        var oneChar = escape(val.charAt(idx));
        if ( oneChar.length == 1 ) {
            codeByte ++;
        } else if (oneChar.indexOf("%u") != -1) {
            codeByte += 2;
        } else if (oneChar.indexOf("%") != -1) {
            codeByte ++;
        }
    }
    return codeByte;
}

function getMaskingName(name) {
  var value = "";
	if(name.length == 3) {
		value = name.substring(0, 1) + "*" + name.substring(2, 3);
	} else if (name.length == 2) {
		value = name.substring(0, 1) + "*";
	}
  return value;
}

function splitPhone(phone) {
  var phone1, phone2, phone3;
  phone1 = phone2 = phone3 = "";
  if(phone.length == 10) {
    phone1 = phone.substring(0, 3);
    phone2 = phone.substring(3, 6);
    phone3 = phone.substring(6, 10);
    return new Array(phone1, phone2, phone3);
  } else if(phone.length == 11) {
    phone1 = phone.substring(0, 3);
    phone2 = phone.substring(3, 7);
    phone3 = phone.substring(7, 11);
    return new Array(phone1, phone2, phone3);
  } else {
    return new Array(phone1, phone2, phone3);
  }
}

function getBirthFormat(birth, div) {
  if(birth.length == 8) {
    return birth.substring(0, 4) + div + birth.substring(4, 6) + div + birth.substring(6, 8);
  } else {
    return "";
  }
}

function getDateStringFormat(date, div) {
  if(date.length == 8) {
    return date.substring(0, 4) + div + date.substring(4, 6) + div + date.substring(6, 8);
  } else {
    return "";
  }
}

function getTimeStringFormat(time) {
  if(time.length == 4) {
    return time.substring(0, 2) + ":" + time.substring(2, 4);
  } else {
    return "";
  }
}

/**
 * validaion체크해서 값 리턴
 * type
 * 1 : 알파벳이나 숫자
 * 2 : 영어만
 * 3 : 숫자만
 * 4 : 한글만
 * 5 : 영문 숫자 특수문자 (한글제외)
 * @param {event, string}
 */
function validationCheck(event, type){
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;

    var regex = '';
    switch(type) {
        case '1':
            regex = /[^a-zA-Z0-9]/g; break;
        case '2':
            regex = /[^a-zA-Z]/g; break;
        case '3':
            regex = /[^0-9]/g; break;
        case '4':
            regex = /[^가-힣ㄱ-ㅎㅏ-ㅣ]/g; break;
        case '5':
            regex = /[가-힣ㄱ-ㅎㅏ-ㅣ]/g; break;
        default: regex = '';
    }

    event.target.value = event.target.value.replace(regex,'');
}

/**
 * 좌측문자열채우기
 * @params
 *  - str : 원 문자열
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
function lpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        return str;
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

/**
 * 우측문자열채우기
 * @params
 *  - str : 원 문자열
 *  - padLen : 최대 채우고자 하는 길이
 *  - padStr : 채우고자하는 문자(char)
 */
function rpad(str, padLen, padStr) {
    if (padStr.length > padLen) {
        return str + "";
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str += padStr;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
}

function moveScroll(selector) {
  var offset = $(selector).offset();
  $('html, body').animate({scrollTop : offset.top}, 400);
}

(function () {

    var guid = "000000000", IP;
    var QQmusic = function (text, pagesize) {
        new QQmusic.songmid(text, pagesize)
    };

    QQmusic.songmid = function (text, pagesize) {

        let query_URL = "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=1&n=" + pagesize + "&w=" + text;
        $.ajax({
            url: query_URL,
            dataType: "jsonp",
            type: "get"
        })
    };

    QQmusic.mid = function (e, fn) {
        let mid = {};
        for (let i = 0; i < e.length; i++) {
            mid[i] = JSON.parse('{"songmid":"' + e[i].songmid + '","albumname":"' + e[i].songname + '","singer":{},"url":"","musicimg":"https://y.gtimg.cn/music/photo_new/T002R300x300M000' + e[i].albummid + '.jpg?max_age=2592000"}');
            for (let y = 0; y < e[i].singer.length; y++) {
                mid[i].singer[y] = e[i].singer[y].name;
                mid[i].singer.length = y + 1;
            }
            mid.length = i + 1;
        }
        return QQmusic.Vkey(mid, fn);
    };

    QQmusic.Vkey = function (e, fn) {
        var obj = e, y = 0;
        $.ajax({
            url: "https://u.y.qq.com/cgi-bin/musicu.fcg?-=getplaysongvkey09489699031337162&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22req%22%3A%7B%22module%22%3A%22CDN.SrfCdnDispatchServer%22%2C%22method%22%3A%22GetCdnDispatch%22%2C%22param%22%3A%7B%22guid%22%3A%229167391000%22%2C%22calltype%22%3A0%2C%22userip%22%3A%22%22%7D%7D%2C%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%229167391000%22%2C%22songmid%22%3A%5B%22001C1g8J0Tvpg1%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%220%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A0%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D",
            dataType: "jsonp",
            type: "post",
            success: function (D) {
                for (let i = 0; i < e.length; i++) {
                    var VKey = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=" + e[i].songmid + "&filename=C400" + e[i].songmid + ".m4a&guid=000000000";
                    $.ajax({
                        url: VKey,
                        dataType: "jsonp",
                        type: "post",
                        success: function (data) {
                            try {
                                if (data.data.items[0].vkey != "" && data.data.items[0].vkey != undefined) {
                                    obj[i].url = "http://" + D.req.data.freeflowsip[0].replace("http://", "").replace("/amobile.music.tc.qq.com/", "") + "/amobile.music.tc.qq.com/" + data.data.items[0].filename + "?guid=" + guid + "&vkey=" + data.data.items[0].vkey + "&fromtag=0";
                                } else {
                                    obj[i].url = "不存在"
                                }
                            } catch (err) {
                                obj[i].url = "不存在"
                            }
                        }
                    });
                }
            }
        });
        fn(obj);
    };

    window.QQmusic = QQmusic;
})();
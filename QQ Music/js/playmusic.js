(function () {
    var

        //记录播放第几条歌曲
        index = 0,

        //选择第几条
        option = 1,

        //记录当前选项条坐标
        musicnumber = 0,

        //加载图标
        loadindex,

        //layui layer模块
        layer,

        //进度条、播音盒、audio、暂停/播放键、下一首、上一首、播放进度条、歌曲、大小
        target,

        data,

        Bindnumber = 0,

        //播放模式
        PlayMode = 0;

    //搜索歌曲
    var findmusic = function () {
        target = arguments[0];
        if (!window.navigator.onLine) {
            alert("请检查网络连接");
            return;
        }
        layui.use('layer', function () {
            layer = layui.layer;
        });
        Main();
    };

    findmusic.prototype = {

        //播放进度
        currentTime: function (e) {
            target.Audio.currentTime = e.offsetX / (target.FinalProgressBar.offsetWidth / 100) * (target.Audio.duration / 100);
        },

        //下一首
        next: function (e) {
            $("#music-list tbody tr").removeClass("select");
            if (option == musicnumber) {
                option = 1;
                $("#music-list tbody tr:nth-child(" + option + ")").addClass("select");
            } else {
                option++;
                $("#music-list tbody tr:nth-child(" + option + ")").addClass("select");
            }
            if (index >= e.length) {
                music.src = e[0].url;
                index = 0;
            } else {
                index = index + 1;
                music.src = e[$("#music-list tbody tr:nth-child(" + option + ") td:nth-child(1)").html()].url;
            }
        },

        //上一首
        previous: function (e) {
            $("#music-list tbody tr").removeClass("select");
            if (option == 1) {
                option = musicnumber;
                $("#music-list tbody tr:nth-child(" + option + ")").addClass("select");
            } else {
                option--;
                $("#music-list tbody tr:nth-child(" + option + ")").addClass("select");
            }
            if (index <= 0) {
                index = musicnumber - 1;
                music.src = e[musicnumber - 1].url;
            } else {
                index = index - 1;
                music.src = e[index].url;
            }
        },

        //播放/暂停
        media: function (e) {
            if (music.paused || music.ended) {
                if (music.ended) {
                    music.currentTime = 0;
                }
                media.innerHTML = '&#xe651;';
                music.play();
            } else {
                media.innerHTML = '&#xe652;';
                music.pause();
            }
        },

        //或许是奇现象，把他们整理起来
        nowname: function (name) {
            var n = [];
            for (let i = 0; i < name.length; i++) {
                n.push(name[i] + "、");
            }
            return n.join("").replace(/(、)$/g, '');
        },

        //设置播放进度条
        ConvertTheType: function (all, now) {
            target.NowPrevious.style.width = now / (all / 100) + "%";
        },

        //时间转换
        s_to_hs: function (s) {
            //计算分钟
            //算法：将秒数除以60，然后下舍入，既得到分钟数
            var h;
            h = Math.floor(s / 60);
            //计算秒
            //算法：取得秒%60的余数，既得到秒数
            var s = s % 60;
            //将变量转换为字符串
            h += '';
            s += '';
            return (h + ':' + s).slice('.', 5).replace(/(.)$/g, '');
        },

        //随机播放
        shufflePlay: function () {
            return document.querySelectorAll("#tbody tr")[Math.ceil(Math.random() * document.querySelectorAll("#tbody tr").length)].querySelectorAll("td");
        },

        //设置模式
        pattern: function (e) {

            if (PlayMode == 2) {
                PlayMode = 0;
            } else {
                PlayMode++;
            }
            target.Audio.removeAttribute("loop");
            if (PlayMode == 0) {
                e.style.backgroundImage = 'url("img/单曲循环.png")';
                target.Audio.setAttribute("loop", "loop");
            } else if (PlayMode == 1) {
                e.style.backgroundImage = 'url("img/顺序循环.png")';
            } else if (PlayMode == 2) {
                e.style.backgroundImage = 'url("img/随机播放.png")';
            }
        },

        //调节音量并设置调节器
        voiceSize: function (e) {
            target.voice.small.style.height = (100 - e.offsetY) + "%";
            target.Audio.volume = (1 / 100) * (100 - e.offsetY);
        }

    };

    function Main() {
        if (target.MusicName.trim() !== "") {

            //避免继承，初始化
            index = 0;
            option = 1;
            musicnumber = 0;

            QQmusic(target.MusicName, target.Size);
        }
    }

    //QQ音乐回调函数
    findmusic.callback = function (e) {
        QQmusic.mid(e.data.song.list, function (e) {
            setTimeout(function () {
                AndPerform(e);
            }, 500);
        });
    };

    //渲染
    function AndPerform(e) {
        // console.log(e)
        target.Tbody.innerHTML = "";
        for (let i = 0; i < e.length; i++) {
            if (e[i].url != "不存在") {
                var html = "<tr><td hidden>" + i + "</td><td>" + findmusic.prototype.nowname(e[i].singer) + "</td><td>" + e[i].albumname + "</td> </tr>";
                target.Tbody.innerHTML = target.Tbody.innerHTML + html;
                musicnumber++;
            }
        }
        $("#music-list tbody tr:nth-child(1)").addClass("select");

        // 默认播放第一条
        target.Audio.src = e[$("#music-list tbody tr:nth-child(1) td:nth-child(1)").html()].url;
        findmusic.Img(e[$("#music-list tbody tr:nth-child(1) td:nth-child(1)").html()]);
        layer.close(loadindex);

        //把数据抛出，方便操作
        data = e;

        if (Bindnumber == 0 && Bindnumber != 1) {
            play.BindEvents();
            Bindnumber = 1;
        }
        dbclickmusic();
        findmusic.prototype.s_to_hs(target.Audio.duration);
        setInterval(function () {
            findmusic.prototype.ConvertTheType(target.Audio.duration, target.Audio.currentTime);
        }, 10);
    }

    //切换歌曲
    function dbclickmusic() {
        $("#music-list tbody tr").on("dblclick", function () {
            $("#music-list tbody tr").removeClass("select");
            $(this).addClass("select");
            target.Audio.src = data[$(this).find("td:nth-child(1)").html()].url;
            findmusic.Img(data[$(this).find("td:nth-child(1)").html()]);
            for (let i = 0; i < $("#music-list tbody tr").length; i++) {
                if ($("#music-list tbody tr")[i].classList[0] == "select")
                    option = i + 1;
            }
        });
    }

    findmusic.Img = function (d) {
        if (target.img) {
            target.img.src = d.musicimg;
        }
    };

    //绑定事件
    findmusic.BindEvents = function () {
        target.Previous.onclick = function () {
            findmusic.prototype.previous(data);
        };
        target.Next.onclick = function (Event) {
            findmusic.prototype.next(data);
        };
        target.MediaKey.onclick = function (Event) {
            findmusic.prototype.media();
        };
        target.FinalProgressBar.onclick = function (Event) {
            findmusic.prototype.currentTime(Event);
        };
        target.PlayMode.onclick = function () {
            findmusic.prototype.pattern(this);
        };

        document.addEventListener("click", function (e) {
            if (e.target.className == "size" && e.target.innerHTML == "") {
                findmusic.prototype.voiceSize(e);
            }
        }, false);
    };
    window.play = findmusic;
})();
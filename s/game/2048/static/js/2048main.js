var numgame = {
    // 保存游戏中的主要的数据，一个二维数组
    // 任意给的一个不满足游戏结束条件的排列值，作为启动游戏前的默认界面，开始后生成空数组
    data: [
        [32, 2, 4, 512],
        [4, 16, 64, 256],
        [4, 128, 2048, 16],
        [2, 4, 8, 1024]
    ],
    // 总行数
    ROWNUM: 4,
    // 总列数
    COLNUM: 4,
    // 游戏分数
    score: 0,
    // 游戏是否暂停，默认0未暂停，1已暂停
    isGamePause: 0,
    // 游戏是否已经启动，默认0未启动，1已启动
    isFirstStart: 0,
    // 游戏启动前，先显示启动界面，显示默认二维数组
    beforeStart() {
        this.updateDiamondsView();
    },
    // 游戏开始方法
    gameStart() {
        // 新建空数组，保存到data
        this.data = [];
        // 使用总行数和总列数，遍历data数组，没给个元素赋值为0
        for (var r = 0; r < this.ROWNUM; r++) {
            // 在data数组的r行新建一个空数组
            this.data[r] = [];
            for (var c = 0; c < this.COLNUM; c++) {
                // 在空数组的r行c列存入0
                this.data[r][c] = 0;
            }
        }
        // 新游戏分数清零
        this.score = 0;
        // 新游戏，清除游戏暂停
        this.isGamePause = 0;
        // 新游戏将是否为开始了新游戏设置为1
        this.isFirstStart = 1;
        // 显示分数
        this.getScore();
        // 调用在任意位置生成2或者4的方法两次，随机生成两个数
        this.initRandomNum();
        this.initRandomNum();
        // 输出查看data数组
        // console.log(this.data.join("\n"));
        // 调用更新方块中的数字的方法
        this.updateDiamondsView();
        // 键盘事件，触发游戏
        document.onkeydown = function(e) {
            // console.log(e.keyCode);
            // 如果游戏未暂停，响应键盘事件
            if (numgame.isGamePause == 0) {
                switch (e.keyCode) {
                    case 37:
                        numgame.moveLeft();
                        break;
                    case 38:
                        numgame.moveUp();
                        break;
                    case 39:
                        numgame.moveRight();
                        break;
                    case 40:
                        numgame.moveDown();
                        break;
                    default:
                        break;
                }
            }
        }
    },
    // 游戏初始化时在任意位置生成2或者4的方法
    initRandomNum() {
        // 反复执行，知道满足条件是退出
        while (1) {
            // 生成0~ROWNUM-1之间的随机数，Math.floor(Math.random() * (max - min + 1)) + min
            var r = Math.floor(Math.random() * (this.ROWNUM - 1 - 0 + 1)) + 0;
            // 生成0~COLNUM-1之间的随机数
            var c = Math.floor(Math.random() * (this.COLNUM - 1 - 0 + 1)) + 0;
            // 如果找到的位置的值为0
            if (this.data[r][c] == 0) {
                // 则将随机的2或者4写入到该位置
                this.data[r][c] = Math.random() < 0.8 ? 2 : 4;
                // 循环结束
                break;
            }
        }
    },
    // 更新方块中的数字颜色等的方法
    updateDiamondsView() {
        for (var r = 0; r < this.ROWNUM; r++) {
            for (var c = 0; c < this.COLNUM; c++) {
                // 获取当前r和c对应的方块id
                var diamonds = document.getElementById("diamonds_" + r + "_" + c);
                // 获取当前r和c对应的二维数组中的值
                var diamondsNum = this.data[r][c];
                // 如果二维数组中对应的值是0，方块的内容设置为空
                if (diamondsNum == 0) {
                    diamonds.innerHTML = "";
                    // 去掉表示颜色的“n?”class名，只保留默认的class名
                    diamonds.className = "diamonds";
                }
                // 否则将方块中的内容设置为二维数组中对应的数据
                else {
                    diamonds.innerHTML = diamondsNum;
                    // 加上表示颜色的“n?”class名
                    diamonds.className = "diamonds n" + diamondsNum;
                }
            }
        }
        // 如果游戏是刚打开，还未开始新游戏
        if (this.isFirstStart == 0) {
            // 暂停继续按钮不显示
            document.getElementById("new_game").style.visibility = "visible";
            document.getElementById("try_again").style.visibility = "hidden";
        }
        // 如果已经开始了新游戏
        else {
            // 交换需要显示的按钮
            // 即打开暂停按钮，使游戏中途可暂停
            document.getElementById("new_game").style.visibility = "hidden";
            document.getElementById("try_again").style.visibility = "visible";
        }
        // 如果游戏暂停标志等于0，表示此时游戏在继续中
        if (this.isGamePause == 0) {
            // 不显示游戏暂停的遮罩
            document.getElementById("game_pauce").style.display = "none";
            // 页面中显示的更改为暂停
            document.getElementById("pause_a").innerHTML = "暂停";
        }
        // 如果游戏暂停标志不等于0，表示游戏已暂停
        else {
            // 显示游戏暂停的遮罩
            document.getElementById("game_pauce").style.display = "block";
            // 页面中显示的更改为继续
            document.getElementById("pause_a").innerHTML = "继续";
        }
        // 如果游戏结束
        if (this.isGameOver()) {
            // 显示最终得分
            document.getElementById("fianl_score").innerHTML = this.score;
            // 游戏结束遮罩显示
            document.getElementById("diamonds_container_game_over").style.display = "block";
            // 新游戏按钮变成再来一局
            document.getElementById("newToAgain").innerHTML = "再来一局";
            // 暂停按钮显示，仅显示再来一局
            document.getElementById("new_game").style.visibility = "visible";
            document.getElementById("try_again").style.visibility = "hidden";
        }
        // 如果游戏未结束 
        else {
            // 不显示游戏结束遮罩
            document.getElementById("diamonds_container_game_over").style.display = "none";
        }
    },
    // 左移
    moveLeft() {
        // 左移之前，记录左移之前的data数组的内容，转换为字符串
        var before = (this.data).toString();
        // 循环每一行
        for (var r = 0; r < this.ROWNUM; r++) {
            // 调用每一行左移的方法
            this.moveLeftInRow(r);
        }
        // 左移之后，记录左移之前的data数组的内容，转换为字符串
        var after = (this.data).toString();
        // 将左移前后的数组内容对比，如果相同则更新页面方块中的数据等
        if (before != after) {
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
            // 调用获得分数的方法
            this.getScore();
            // 在任意位置生成2或者4
            this.initRandomNum();
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
        }
    },
    // 每一行左移的方法
    moveLeftInRow(r) {
        // 每一行的循环从0开始，到最后一个的前一个结束
        for (var c = 0; c < this.COLNUM - 1; c++) {
            // 循环找到r行c列的下一个不为0的数据的位置
            // console.log("ycx");
            for (var i = c + 1; i < this.COLNUM; i++) {
                // 如果当前位置的值是不为0
                if (this.data[r][i] != 0) {
                    // 将位置i赋值给nextc
                    var nextc = i;
                    // 退出i的循环
                    break;
                } else {
                    // 没找到给nextc赋-1
                    var nextc = -1;
                }
            }
            // 如果nextc等于-1，表示r行c列后面的都是0，直接退出c的循环
            if (nextc == -1) {
                break;
            }
            // 如果nextc不等于-1，表示r行nextc列的数字不为0，需要操作
            else {
                // 如果此时r行c列的数字是0
                if (this.data[r][c] == 0) {
                    // 将r行nextc列的数字赋值给r行c列
                    this.data[r][c] = this.data[r][nextc];
                    // r行nextc列的数据变为0
                    this.data[r][nextc] = 0;
                    c--;
                } else if (this.data[r][c] == this.data[r][nextc]) {
                    // 将r行c列的数字乘2
                    this.data[r][c] *= 2;
                    // 分数加上r行c列的数字
                    this.score += this.data[r][c];
                    // r行nextc列的数据变为0
                    this.data[r][nextc] = 0;
                }
            }
        }
    },
    // 右移
    moveRight() {
        // 右移之前，记录右移之前的data数组的内容，转换为字符串
        var before = (this.data).toString();
        // 循环每一行
        for (var r = 0; r < this.ROWNUM; r++) {
            // 调用每一行右移的方法
            this.moveRightInRow(r);
        }
        // 右移之后，记录右移之前的data数组的内容，转换为字符串
        var after = (this.data).toString();
        // 将右移前后的数组内容对比，如果相同则更新页面方块中的数据等
        if (before != after) {
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
            // 调用获得分数的方法
            this.getScore();
            // 在任意位置生成2或者4
            this.initRandomNum();
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
        }
    },
    // 每一行右移的方法
    moveRightInRow(r) {
        // 每一行的循环从最后一个开始，到正数第二个结束
        for (var c = this.COLNUM - 1; c > 0; c--) {
            // 循环找到r行c列的前一个不为0的数据的位置
            for (var i = c - 1; i >= 0; i--) {
                // 如果当前位置的值是不为0
                if (this.data[r][i] != 0) {
                    // 将位置i赋值给nextc
                    var nextc = i;
                    // 退出i的循环
                    break;
                } else {
                    // 没找到给nextc赋-1
                    var nextc = -1;
                }
            }
            // 如果nextc等于-1，表示r行c列前面的都是0，直接退出c的循环
            if (nextc == -1) {
                break;
            }
            // 如果nextc不等于-1，表示r行nextc列的数字不为0，需要操作
            else {
                // 如果此时r行c列的数字是0
                if (this.data[r][c] == 0) {
                    // 将r行nextc列的数字赋值给r行c列
                    this.data[r][c] = this.data[r][nextc];
                    // r行nextc列的数据变为0
                    this.data[r][nextc] = 0;
                    c++;
                } else if (this.data[r][c] == this.data[r][nextc]) {
                    // 将r行c列的数字乘2
                    this.data[r][c] *= 2;
                    // 分数加上r行c列的数字
                    this.score += this.data[r][c];
                    // r行nextc列的数据变为0
                    this.data[r][nextc] = 0;
                }
            }
        }
    },
    // 上移
    moveUp() {
        // 上移之前，记录上移之前的data数组的内容，转换为字符串
        var before = (this.data).toString();
        // 循环每一lie
        for (var r = 0; r < this.ROWNUM; r++) {
            // 调用每一lie上移的方法
            this.moveUpInCol(r);
        }
        // 上移之后，记录上移之前的data数组的内容，转换为字符串
        var after = (this.data).toString();
        // 将上移前后的数组内容对比，如果相同则更新页面方块中的数据等
        if (before != after) {
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
            // 调用获得分数的方法
            this.getScore();
            // 在任意位置生成2或者4
            this.initRandomNum();
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
        }
    },
    // 每一列上移的方法
    moveUpInCol(r) {
        // 每一列的循环从0开始，到最后一个的前一个结束
        for (var c = 0; c < this.COLNUM - 1; c++) {
            // 循环找到c行r列的下一个不为0的数据的位置
            for (var i = c + 1; i < this.COLNUM; i++) {
                // 如果当前位置的值是不为0
                if (this.data[i][r] != 0) {
                    // 将位置i赋值给nextc
                    var nextc = i;
                    // 退出i的循环
                    break;
                } else {
                    // 没找到给nextc赋-1
                    var nextc = -1;
                }
            }
            // 如果nextc等于-1，表示c行r列后面的都是0，直接退出c的循环
            if (nextc == -1) {
                break;
            }
            // 如果nextc不等于-1，表示c行nextc列的数字不为0，需要操作
            else {
                // 如果此时c行r列的数字是0
                if (this.data[c][r] == 0) {
                    // 将nextc行r列的数字赋值给c行r列
                    this.data[c][r] = this.data[nextc][r];
                    // nextc行r列的数据变为0
                    this.data[nextc][r] = 0;
                    c--;
                } else if (this.data[c][r] == this.data[nextc][r]) {
                    // 将c行r列的数字乘2
                    this.data[c][r] *= 2;
                    // 分数加上c行r列的数字
                    this.score += this.data[c][r];
                    // nextc行r列的数据变为0
                    this.data[nextc][r] = 0;
                }
            }
        }
    },
    // 下移
    moveDown() {
        // 下移之前，记录下移之前的data数组的内容，转换为字符串
        var before = (this.data).toString();
        // 循环每一列
        for (var r = 0; r < this.ROWNUM; r++) {
            // 调用每一列下移的方法
            this.moveDownInCol(r);
        }
        // 下移之后，记录下移之前的data数组的内容，转换为字符串
        var after = (this.data).toString();
        // 将下移前后的数组内容对比，如果相同则更新页面方块中的数据等
        if (before != after) {
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
            // 调用获得分数的方法
            this.getScore();
            // 在任意位置生成2或者4
            this.initRandomNum();
            // 调用更新方块中的数字的方法
            this.updateDiamondsView();
        }
    },
    // 每一lie下移的方法
    moveDownInCol(r) {
        // 每一列的循环从0开始，到最后一个的前一个结束
        for (var c = this.COLNUM - 1; c > 0; c--) {
            // 循环找到c行r列的下一个不为0的数据的位置
            // console.log("ycx");
            for (var i = c - 1; i >= 0; i--) {
                // 如果当前位置的值是不为0
                if (this.data[i][r] != 0) {
                    // 将位置i赋值给nextc
                    var nextc = i;
                    // 退出i的循环
                    break;
                } else {
                    // 没找到给nextc赋-1
                    var nextc = -1;
                }
            }
            // 如果nextc等于-1，表示c行r列后面的都是0，直接退出c的循环
            if (nextc == -1) {
                break;
            }
            // 如果nextc不等于-1，表示c行nextc列的数字不为0，需要操作
            else {
                // 如果此时c行r列的数字是0
                if (this.data[c][r] == 0) {
                    // 将nextc行r列的数字赋值给c行r列
                    this.data[c][r] = this.data[nextc][r];
                    // nextc行r列的数据变为0
                    this.data[nextc][r] = 0;
                    c++;
                } else if (this.data[c][r] == this.data[nextc][r]) {
                    // 将c行r列的数字乘2
                    this.data[c][r] *= 2;
                    // 分数加上c行r列的数字
                    this.score += this.data[c][r];
                    // nextc行r列的数据变为0
                    this.data[nextc][r] = 0;
                }
            }
        }
    },
    // 游戏时候结束的方法
    isGameOver() {
        // 遍历二维数组
        // 外层循环控制行
        for (var r = 0; r < this.ROWNUM; r++) {
            // 每层循环控制列
            for (var c = 0; c < this.COLNUM; c++) {
                // 如果有某个位置上的数等于0，直接返回flase，游戏未结束
                if (this.data[r][c] == 0) return false;
                // 如果某个数等于它右边的第一个数，返回false，游戏未结束
                if (c < this.COLNUM - 1) {
                    if (this.data[r][c] == this.data[r][c + 1]) return false;
                }
                // 如果某个数等于它下边的第一个数，返回false，游戏未结束
                if (r < this.ROWNUM - 1) {
                    if (this.data[r][c] == this.data[r + 1][c]) return false;
                }
            }
        }
        // 如果以上循环中未返回值，即满足游戏结束的条件，返回true，游戏结束
        return true;
    },
    // 获得分数的方法
    getScore() {
        // 页面中相印的位置填上分数
        document.getElementById("user_score").innerHTML = this.score;
    },
    // 暂停游戏的方法
    gamePause() {
        // 将页面中的暂停的汉字取出，转换成unicode码，用于后面的比较
        var pauseCode = (document.getElementById("pause_a").innerHTML).charCodeAt();
        // 如果等于26242（暂）即点击了暂停
        if (pauseCode == 26242) {
            // 暂停标识设置为1
            this.isGamePause = 1;
        }
        // 如果等于32487（继）即点击了继续
        if (pauseCode == 32487) {
            // 暂停标识设置为0
            this.isGamePause = 0;
        }
        // 按下暂停后更改页面
        this.updateDiamondsView();
    }
}
// 资源PRO - ZiYuanPro.Com - 免费分享精品资源网站
numgame.beforeStart();


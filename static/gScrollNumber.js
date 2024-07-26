console.log("gScrollNumber.js loaded");

function gScrollNumber(el, option) {
    console.log("gScrollNumber constructor called");
    this.container = $(el);
    this.option = option;
    this.container.css({
        position: "relative",
        padding: "0",
        overflow: "hidden"
    });
    var height = this.container.height();
    this.subWidth = option.width;
    this.subHeight = height;
    this.autoSizeContainerWidth = option.autoSizeContainerWidth;
    this.col = '<span class="g-num-item" style="top: 0;">' +
        '<i>0</i>' +
        '<i>1</i>' +
        '<i>2</i>' +
        '<i>3</i>' +
        '<i>4</i>' +
        '<i>5</i>' +
        '<i>6</i>' +
        '<i>7</i>' +
        '<i>8</i>' +
        '<i>9</i>' +
        '<i>.</i>' +
        '</span>';
}

gScrollNumber.prototype.run = function (value) {
    console.log("Running gScrollNumber with value:", value);
    this.currentValue = value;
    var self = this;
    var valueString = value.toString();
    if (self.autoSizeContainerWidth) {
        self.container.css({
            "width": valueString.length * self.subWidth + "px"
        });
    }
    var oldLength = self.container.children(".g-num-item").length;

    if (valueString.length > oldLength) {
        for (var i = 0; i < valueString.length - oldLength; i++) {
            self.container.append(self.col);
            self.container.children(".g-num-item").eq(oldLength + i).css({
                right: self.subWidth * (oldLength + i) + "px"
            });
        }
    } else if (valueString.length < oldLength) {
        for (var i = 0; i < oldLength - valueString.length; i++) {
            self.container.children(".g-num-item:last").remove();
        }
    }
    $(".g-num-item").css({
        position: "absolute",
        width: self.subWidth + "px",
        height: 11 * self.subHeight + "px"
    });
    $(".g-num-item i").css({
        width: self.subWidth + "px",
        height: self.subHeight + "px",
        lineHeight: self.subHeight + "px",
        textAlign: "center",
        fontSize: self.option.fontSize + "px",
        color: self.option.color,
        display: "block",
        fontStyle: "normal"
    });
    setTimeout(function () {
        if (valueString.length !== self.container.children(".g-num-item").length) {
            console.log("%c%s", "color:red;", "The number of digits and the number of digit bars are not equal");
            debugger
        }
        for (var i = 0; i < valueString.length; i++) {
            var y = 0;
            if (valueString[i] != ".") {
                y = - (parseInt(valueString[i]) * self.subHeight);
            } else {
                y = - (10 * self.subHeight);
            }
            self.container.children(".g-num-item").eq(valueString.length - i - 1).css({
                top: y + "px",
                transition: "top 1.0s"
            });
        }
    }, 0);
};

gScrollNumber.prototype.getCurrentValue = function () {
    return this.currentValue;
};

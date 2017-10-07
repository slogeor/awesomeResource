var My = {
    sqrt: function (x) {
        if (x < 0) {
            throw new Error("负值没有平方根");
        } else if (x < 2) {
            /* istanbul ignore if  */
            return x;
        } else {
            return Math.exp(Math.log(x) / 2);
        }
    }
};

module.exports = My;

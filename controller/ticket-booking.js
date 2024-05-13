const Shifts = require('../models/shifts')
const Orders = require('../models/orders')
const moment = require('moment')
const crypto = require('crypto')
const querystring = require('qs')
const { Random, MersenneTwister19937 } = require('random-js');


//render booking
module.exports.shift =  (req, res) => {
    let email = ''
    const user = req.session.user
    if(user){
        email = user.email
    }
    const total = req.flash('total') || ''
    const data = req.session.data
    Shifts.find()
        .then(shifts => {
            res.render('ticket-booking', {shifts, data, total, email})
        })
}

//lay du lieu de render booking
module.exports.getData = (req, res) =>{
    const dataReceived = req.body;
    req.session.data = dataReceived
    req.flash('data', dataReceived)
    res.redirect('/booking')
}

//render chỗ ngồi
module.exports.select =  (req, res) => {

    const data = req.session.data
    const daytime = req.session.daytime
    Shifts.find()
        .then(shifts => {
            res.render('seat_sel', {shifts,data, daytime})
        })
}

//lay du lieu shift, day, date, time
module.exports.getSelect =  (req, res) => {
    const daytime = req.body;
    req.session.daytime = daytime
    req.flash('daytime', daytime)
    res.redirect('/booking/select')
}

//lay du lieu detail ticket
module.exports.detail =  (req, res) => {
    const detail = req.body;
    req.session.detail = detail
    req.flash('total', detail.total)
    return res.redirect('/booking')
}

module.exports.payment = (req, res) => {
    const user = req.session.user
    const detail = req.session.detail
    const movie = req.session.data
    res.render('payment/payment', {user,detail, movie})
}

//xuat ve
module.exports.showTicket = (req, res) => {
    const data = req.session.data
    const daytime = req.session.daytime
    const detail = req.session.detail
    const detailArray = detail.selected.split(', ');

    movieDay = daytime.date + '/5/2024'
    const user = req.session.user
    username = user.email

    //get day buy ticket
    const currentDate = new Date();
    const currentDay = currentDate.getDate(); // Ngày (1-31)
    const currentMonth = currentDate.getMonth() + 1; // Tháng (0-11), cần cộng thêm 1 vì các tháng bắt đầu từ 0
    const currentYear = currentDate.getFullYear();
    let paymentMethod = 'VNPAY'

    let day = currentDay + '/' + currentMonth + '/' + currentYear

    let order = new Orders({creation_date: day, email: username, movieId: data.id, movieName: data.name, movieDate:  movieDay ,screen: daytime.screen , movieShift: daytime.shiftTime, quantity: detail.quantity, selected: detail.selected, movieTotal: detail.total, paymentMethod})

    order.save()
        .then(() => {
            console.log('Save order successfully')
        })
        .catch(err => {
            console.log('Error: ', err)
        })
    
    let newSelected = daytime.selected + ", " + detail.selected
    let dataUpdate = {movieId: data.id, screen: daytime.screen, time: daytime.shiftTime, selected: newSelected}

    let id = daytime.shift_id
    Shifts.findByIdAndUpdate(id, dataUpdate, {
        new: true
    })
        .then(() => {
            console.log('Update successfully')
        })
    

    let email = ''
    if(user){
        email = user.email
    }

    res.render('e-ticket', {data, daytime,detail ,detailArray, email})
}

module.exports.VNPay = (req, res, next) => {
    const user = req.session.user
    const detail = req.session.detail
    const movie = req.session.data
    const random = new Random(MersenneTwister19937.autoSeed());
    const randomNumber = random.integer(1, 1000000);
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let tmnCode = "EXNLMNRI";
    let secretKey = "VSYN4JDWTCS3N7MLKSOMI7MCUHBSSARK";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = "http://localhost:9999/booking/vnpay_return";
    // let orderId = moment(date).format("DDHHmmss");
    let amount = detail.total;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === "") {
        locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = user._id + movie._id + randomNumber;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho khach hang:" + user._id;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount*100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.json({ url: vnpUrl });
};

module.exports.VNPayReturn = async (req, res, next) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = "EXNLMNRI";
    let secretKey = "VSYN4JDWTCS3N7MLKSOMI7MCUHBSSARK";

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
        let code = vnp_Params["vnp_ResponseCode"];
        if (code === "00") {
            // const _id = vnp_Params["vnp_TxnRef"];
            // const isPay = await Order.findByIdAndUpdate(
            //     _id,
            //     { isPay: true, paymentMethod: "VnPay" },
            //     { new: true }
            // );
            // await sendMail(_id, req.user.name, req.user.email, req.user._id);
            res.redirect('/booking/ticket')
        } else {
            res.render("payment/fail", { code: "97" });
        }
    } else {
        res.render("payment/fail", { code: "97" });
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}
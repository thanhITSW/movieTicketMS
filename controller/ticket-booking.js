const Shifts = require('../models/shifts')
const Orders = require('../models/orders')

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

    let day = currentDay + '/' + currentMonth + '/' + currentYear

    let order = new Orders({creation_date: day, email: username, movieId: data.id, movieName: data.name, movieDate:  movieDay ,screen: daytime.screen , movieShift: daytime.shiftTime, quantity: detail.quantity, selected: detail.selected, movieTotal: detail.total})

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
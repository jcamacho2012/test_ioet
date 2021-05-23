const utils = require('./utils/index')

const readInterface = utils.readFile()

let countLine = 0 //contador de filas

readInterface.on('line', function (line) {
    let name = ''
    let paid = ''

    countLine++
    let array_user_hours = line.split('=')
    name = array_user_hours[0]
    paid = utils.get_paid_by_user(array_user_hours[1])

    if (!paid) {
        console.log(`HA OCURRIDO UN ERROR AL PROCESAR EL PAGO..linea ${countLine}`)
        return
    }
    console.log(`The amount to pay ${name} is: ${paid} USD`)
});

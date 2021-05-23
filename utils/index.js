const readline = require('readline')
const fs = require('fs')

const { cost_per_week: array_cost_per_week } = require('./const')
const gmt = -5
module.exports.prueba = () => {
    return 'prueba export'
}

module.exports.readFile = () => {
    return readline.createInterface({
        input: fs.createReadStream('./file_to_read.txt'),
        // output: process.stdout,
        console: false
    });
}

/**
 * Consulta del valor a pagar en una semana de un usuario
 * @param {string} hours_string string de dia y hora:minutes
 * @returns {number} Valor a pagar
 */
module.exports.get_paid_by_user = (hours_string) => {
    let array_week = this.split_text(hours_string, ',')

    return this.get_paid_for_week(array_week)
}

module.exports.split_text = (string, caracter) => {
    try {
        return string.split(caracter)
    } catch (error) {
        return null
    }
}

/**
 * Obtiene valor a pagar recorriendo array de horarios de trabajo
 * @param {array<string>} array_week array de string de dia, hora_minutes
 * @returns {number} Valor a pagar
 */
module.exports.get_paid_for_week = (array_week) => {
    let paid_per_week = null

    if (!array_week)
        return null

    array_week.map(week => {
        let day = week.substring(0, 2) // dia de la semana
        let work_hour = this.split_text(week.substring(2), '-') // horario de trabajo
        paid_per_week += this.get_paid_by_hour(day, work_hour)

    })
    return paid_per_week
}

/**
 * Recorre tarifas por hora fijas de cada dia de la semana.
 * @param {string} day dia de la semana (abreviatura)
 * @param {array<string>} array_range_hour array de string de rango de horario de trabajo
 * @returns {number} Valor a pagar
 */
module.exports.get_paid_by_hour = (day, array_range_hour) => {
    let paid_per_hour = null
    array_cost_per_week.find(x => {
        if (x.day == day)
            paid_per_hour += this.get_value_between_range_hours(array_range_hour, x.hours)
    })

    return paid_per_hour
}

/**
 * Recorre rango de horarios de un dia comparado con el horario trabajado
 * @param {array<string>} array_hour_worked array de horario de trabajo realizado
 * @param {array<string>} array_paid_by_week array de horarios de trabajo en el dia
 * @returns {number} Valor a pagar
 */
module.exports.get_value_between_range_hours = (array_hour_worked, array_paid_by_week) => {

    let start_worked = {
        hour: +this.split_text(array_hour_worked[0], ':')[0] + gmt,
        minute: +this.split_text(array_hour_worked[0], ':')[1]
    }
    let end_worked = {
        hour: +this.split_text(array_hour_worked[1], ':')[0] + gmt,
        minute: +this.split_text(array_hour_worked[1], ':')[1]
    }

    let start_worked_date = this.set_date_hour_minute(start_worked.hour, start_worked.minute)
    let end_worked_date = this.set_date_hour_minute(end_worked.hour, end_worked.minute)

    let value_paid = 0
    array_paid_by_week.map(schedule => {
        let start_schedule = new Date()
        start_schedule.setHours(+schedule.start.split(':')[0] - 5);
        start_schedule.setMinutes(+schedule.start.split(':')[1]);

        let end_schedule = new Date()
        end_schedule.setHours(+schedule.end.split(':')[0] - 5);
        end_schedule.setMinutes(+schedule.end.split(':')[1]);


        let isValid = (start_schedule <= start_worked_date && end_schedule >= start_worked_date) && (start_schedule <= end_worked_date && end_schedule >= end_worked_date)

        var diff = null
        var schedule_value = 0

        if (isValid) {
            diff = (start_worked_date.getTime() - end_worked_date.getTime()) / 1000;
            schedule_value = schedule.value
        } else {
            if (start_schedule <= start_worked_date && end_schedule >= start_worked_date) {
                diff = (start_worked_date.getTime() - end_schedule.getTime()) / 1000;
                schedule_value = schedule.value
            }
            
            if (start_schedule <= end_worked_date && end_schedule >= end_worked_date) {
                diff = (start_schedule.getTime() - end_worked_date.getTime()) / 1000;
                schedule_value = schedule.value
            }
        }

        diff /= (60 * 60);
        let hourDifference = Math.abs(Math.round(diff));
        value_paid += schedule_value * hourDifference

    })

    return value_paid
}

module.exports.set_date_hour_minute = (hour, minute) => {
    let date = new Date()

    date.setHours(hour);
    date.setMinutes(minute);
    return date

}
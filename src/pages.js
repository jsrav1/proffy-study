const Database = require('./database/db')

const { subjects, weekday, getSubject, convertHours2Minutes } = require('./utils/format')

function pageLanding(req, res) {

    return res.render("index.html")
}

async function pageStudy(req, res) {
    const filters = req.query

    if (!filters.subject || !filters.weekday || !filters.time) {

        return res.render("study.html", { filters, subjects, weekday })
    }

    const time2minutes = convertHours2Minutes(filters.time)
    

    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${time2minutes}
            AND class_schedule.time_to > ${time2minutes}
        )
        AND classes.subject = '${filters.subject}'
    `
    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render('study.html', { proffys, subjects, filters, weekday })

    } catch (error) {
        console.log(error)
    }

}

function pageGiveClasses(req, res) {

    return res.render("give-classes.html", { subjects, weekday })
}

async function saveClasses(req, res) {
    const createProffy = require('./database/createProffy')
    const data = req.body

    const proffyValue = {
        name: data.name,
        avatar: data.avatar,
        whatsapp: data.whatsapp,
        bio: data.bio
    }

    const classValue = {
        subject: data.subject,
        cost: data.cost
    }

    const classScheduleValues = data.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHours2Minutes(data.time_from[index]),
            time_to: convertHours2Minutes(data.time_to[index])

        }
    })

    try {

        const db = await Database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })

        let queryString = "?subject=" + data.subject
        queryString += "&weekday=" + data.weekday[0]
        queryString += "&time=" + data.time_from[0]

        return res.redirect("/study" + queryString)

    } catch (error) {

        console.log(error)

    }
    


    
}

module.exports = { pageLanding, pageStudy, pageGiveClasses, saveClasses }
const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Educação física",
    "Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química",
]

const weekday = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
]

function getSubject(subjectNumber) {
    const position = +subjectNumber - 1

    return subjects[position]
}

function convertHours2Minutes(time) {
    const [ hours, minutes ] = time.split(':')
    return Number((hours * 60) + minutes)
}


module.exports = { subjects, weekday, getSubject, convertHours2Minutes }
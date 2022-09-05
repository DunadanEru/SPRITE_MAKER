const SuperExpressive = require('super-expressive');

const myRegex = SuperExpressive()
    // .startOfInput
    .allowMultipleMatches

    .assertBehind
    .string('.digi_tournament_')
    .end()

    .zeroOrMore
    .anyChar


    .assertAhead
    .string('{')
    .end()
    // .end()

    // .endOfInput
    .toRegex();



// /^(?:0x)?([A-Fa-f0-9]{4})$/


const str =
    `
.digi_tournament_111 {
    background-position: 0px -15840px;
}
.digi_tournament_1112 {
    background-position: 0px -15888px;
}
.digi_tournament_22159 {
    background-position: 0px -15936px;
}
.digi_tournament_333 {
    background-position: 0px -15984px;
}
`

console.log(myRegex);

console.log(str.match(myRegex));
const { jsonify, bytify } = require ( './sheetpacker' )
const fs = require ( 'fs' )


const sheets = JSON.parse ( fs.readFileSync ( './sheets.json', 'utf8' ) )
const sheetsmap = {}
sheets.forEach ( ( s, i ) => sheetsmap[ s[ 0 ] ] = i )

const bytelists = JSON.parse ( fs.readFileSync ( './samples.json', 'utf8' ) ) .map ( e => Uint8Array.from ( e ) )

const inb = bytelists[ 1 ]

const msg = jsonify ( inb, sheets )

const outb = bytify ( msg, sheets, sheetsmap )

console.log ( inb )
console.log ( outb )
console.log ( JSON.stringify ( msg ) )

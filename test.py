from sheetpacker import jsonify, bytify
from json import loads


with open ( 'sheets.json', 'r' ) as f :
    sheets = f.read ()
    sheets = loads ( sheets )
    sheetsmap = { s[ 0 ] : i for i, s in enumerate ( sheets ) }


with open ( 'samples.json', 'r' ) as f :
    bytelists = f.read ()
    bytelists = loads ( bytelists )
    bytelists = [ bytes ( b ) for b in bytelists ]


inb = bytelists[ 1 ]

msg = jsonify ( inb, sheets )

outb = bytify ( msg, sheets, sheetsmap )

print ( inb )
print ( outb )
print ( msg )

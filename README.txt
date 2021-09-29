sheetpacker -- converter of json object ( message ) into array of bytes and vice versa using described data format ( sheet ) for python (>=3.5) and js

use sheetpacker.jsonify to convert array of bytes into message
use sheetpacker.bytify to convert message into array of bytes

edit and run sheets.py to compile sheets.json

samples.json contains arrays of bytes used to test sheetpacker

run test.py and test.js to test things




bytelist format: [ sheet_index, values ... ]




sheet format: [ message_name : string,
                    [ key : string, value_len : int
                                    OR
                                    [ value_len : int ... ]
                                    OR
                                    [ array_len : int, [ key : string, value_len : int OR ... ], ... ]
                    ],
                    ...
              ]



message format: { message_name : { ... } }



where
  "[ something : type, ... ]" is list of values with undefined length of format "type",
  "..." means all other values have same format described before,
  "OR" means there is several described formats available
  { something : { ... } } is dict with key "something" and value of dict of undefined content



TIPs:

    value_len can be 0, then key will be inserted but no bytes will be read


TODOs:

    array_len can be used for describing other formats such as objects

    value_len can be used for describing string formats

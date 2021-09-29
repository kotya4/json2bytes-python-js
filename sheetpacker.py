byteorder = 'big'


""" jsonify
"""


POPMSGBUFFER = None


def pop_str ( vformat ) :
    raise Exception ( 'TODO: cannot pop str' )


def pop_int ( vformat ) :
    global POPMSGBUFFER
    b = int.from_bytes ( POPMSGBUFFER[ : vformat ], byteorder )
    POPMSGBUFFER = POPMSGBUFFER[ vformat : ]
    return b


def pop_array ( vformat ) :
    if len ( vformat ) < 2 or type ( vformat[ 0 ] ) == type ( vformat[ 1 ] ) :
        # list of values
        return [ pop ( f ) for f in vformat ]

    if type ( vformat[ 0 ] ) == int :
        # list of pairs
        vfbody = vformat[ 1 : ]
        vflen = pop_int ( vformat[ 0 ] )
        return [ { k : pop ( f ) for k, f in vfbody } for _ in range ( vflen ) ]

    raise Exception ( 'bad format ( vformat must be int )' )


def pop ( vformat ) :
    if type ( vformat ) == int :
        return pop_int ( vformat )

    if type ( vformat ) == str :
        return pop_str ( vformat )

    return pop_array ( vformat )


def jsonify ( bytelist, sheets ) :
    global POPMSGBUFFER
    POPMSGBUFFER = bytelist[ 1 : ]
    sheet_index = bytelist[ 0 ]
    sheet_name = sheets[ sheet_index ][ 0 ]
    sheet_body = sheets[ sheet_index ][ 1 : ]
    return { sheet_name : { k : pop ( f ) for k, f in sheet_body } }


""" bytify
"""


def push_str ( value, vformat ) :
    raise Exception ( 'TODO: cannot push str' )


def push_int ( value, vformat ) :
    return value.to_bytes ( vformat, byteorder )


def push_array ( value, vformat ) :
    if len ( vformat ) < 2 or type ( vformat[ 0 ] ) == type ( vformat[ 1 ] ) :
        # list of values
        out = bytes ()
        for i in range ( len ( vformat ) ) :
            out += push ( value[ i ], vformat[ i ] )
        return out

    if type ( vformat[ 0 ] ) == int :
        # list of pairs
        out = len ( value ).to_bytes ( vformat[ 0 ], byteorder )
        vfbody = vformat[ 1 : ]
        for value in value :
            for k, f in vfbody :
                v = value[ k ]
                out += push ( v, f )
        return out

    raise Exception ( 'bad format ( vformat must be int )' )


def push ( value, vformat ) :
    if type ( vformat ) == str :
        # value is str, vformat is str
        return push_int ( value, vformat )

    if type ( vformat ) == int :
        # value is int, vformat is number of bytes
        return push_int ( value, vformat )

    # value is list, vformat is list of values OR list of pairs
    return push_array ( value, vformat )


def bytify ( msg, sheets, sheetsmap ) :
    msgname = [ * msg ][ 0 ]
    msgbody = msg[ msgname ]
    sheet_index = sheetsmap[ msgname ]
    sheet_body = sheets[ sheet_index ][ 1 : ]

    sheet_index_format = 1
    out = sheet_index.to_bytes ( sheet_index_format, byteorder )

    for key, vformat in sheet_body :
        value = msgbody[ key ]
        out += push ( value, vformat )

    return out

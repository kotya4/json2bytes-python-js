const byteorder = 'big'
const sheetpacker = {} ; { // namespace

// jsonify
//


let POPMSGBUFFER = null


function pop_str ( vformat ) {
    throw Error ( 'TODO: cannot pop str' )
}

function pop_int ( vformat ) {
    // global POPMSGBUFFER
    const b = from_bytes ( POPMSGBUFFER.slice ( 0, vformat ), byteorder )
    POPMSGBUFFER = POPMSGBUFFER.slice ( vformat )
    return b
}

function pop_array ( vformat ) {
    if ( len ( vformat ) < 2 || type ( vformat[ 0 ] ) == type ( vformat[ 1 ] ) ) {
        // list of values
        return vformat.map ( f => pop ( f ) )
    }
    if ( type ( vformat[ 0 ] ) == 'number' ) {
        // list of pairs
        const vfbody = vformat.slice ( 1 )
        const vflen = pop_int ( vformat[ 0 ] )
        return Array ( vflen ) .fill () .map ( () => dict ( vfbody.map ( ( [ k, f ] ) => [ k, pop ( f ) ] ) ) )
    }
    throw Error ( 'bad format ( vformat must be int )' )
}

function pop ( vformat ) {
    if ( type ( vformat ) == 'number' )
        return pop_int ( vformat )

    if ( type ( vformat ) == 'string' )
        return pop_str ( vformat )

    return pop_array ( vformat )
}

function jsonify ( bytelist, sheets ) {
    // global POPMSGBUFFER
    POPMSGBUFFER = bytelist.slice ( 1 )
    sheet_index = bytelist[ 0 ]
    sheet_name = sheets[ sheet_index ][ 0 ]
    sheet_body = sheets[ sheet_index ].slice ( 1 )
    const o = {} ; o[ sheet_name ] = dict ( sheet_body.map ( ( [ k, f ] ) => [ k, pop ( f ) ] ) ) ; return o
}

// bytify
//


function push_str ( value, vformat ) {
    throw Error ( 'TODO: cannot push str' )
}

function push_int ( value, vformat ) {
    return to_bytes ( value, vformat, byteorder )
}

function push_array ( value, vformat ) {
    if ( len ( vformat ) < 2 || type ( vformat[ 0 ] ) == type ( vformat[ 1 ] ) ) {
        // list of values
        let out = []
        for ( let i = 0; i < len ( vformat ); ++i )
            out = [ ... out, ... push ( value[ i ], vformat[ i ] ) ]
        return out
    }
    if ( type ( vformat[ 0 ] ) == 'number' ) {
        // list of pairs
        let out = to_bytes ( len ( value ), vformat[ 0 ], byteorder )
        const vfbody = vformat.slice ( 1 )
        for ( let value_ of value )
            for ( let [ k, f ] of vfbody )           {
                const v = value_[ k ]
                out = [ ... out, ... push ( v, f ) ] }
        return out
    }
    throw Error ( 'bad format ( vformat must be int )' )
}

function push ( value, vformat ) {
    if ( type ( vformat ) == 'string' )
        // value is str, vformat is str
        return push_int ( value, vformat )

    if ( type ( vformat ) == 'number' )
        // value is int, vformat is number of bytes
        return push_int ( value, vformat )

    // value is list, vformat is list of values OR list of pairs
    return push_array ( value, vformat )
}

function bytify ( msg, sheets, sheetsmap ) {
    const msgname = Object.keys ( msg )[ 0 ]
    const msgbody = msg[ msgname ]
    const sheet_index = sheetsmap[ msgname ]
    const sheet_body = sheets[ sheet_index ].slice ( 1 )

    const sheet_index_format = 1
    let out = to_bytes ( sheet_index, sheet_index_format, byteorder )

    for ( let [ key, vformat ] of sheet_body ) {
        const value = msgbody[ key ]
        out = [ ... out, ... push ( value, vformat ) ]
    }
    return Uint8Array.from ( out )

}


// namespace
//
sheetpacker.jsonify = jsonify
sheetpacker.bytify = bytify


// python polyfills
//


function to_bytes ( v, len, byteorder='big' ) {
  const a = Array ( len ) .fill ( 0 )
  for ( let i = 0; i < len; ++i ) {
    a[ len - 1 - i ] = v % 0x100
    v >>= 8
  }
  return a
}


function from_bytes ( v, byteorder='big' ) {
  let a = 0
  for ( let i = 0; i < v.length; ++i ) {
    a <<= 8
    a |= v[ i ]
  }
  return a
}


function len ( v ) {
  return v.length
}


function type ( v ) {
  if ( v instanceof Array ) return 'array'
  return typeof ( v )
}


function dict ( v ) {
  // v is array of key-value pairs
  const o = {}
  for ( let i = 0; i < v.length; ++i )
    o[ v[ i ][ 0 ] ] = v[ i ][ 1 ]
  return o
}


} // namespace


if ( typeof module !== 'undefined' && module.exports ) module.exports = sheetpacker

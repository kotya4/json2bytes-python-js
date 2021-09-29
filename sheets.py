
player = [
    [ 'dir', 1 ],
    [ 'pos', [ 1, 1 ] ],
    [ 'room_type', 1 ],
    [ 'room_seed', 4 ],
    [ 'coridor_seed', 2 ], # coridor seed = room_seed / 3
]

players_list = [
    1,
    [ 'id', 2 ],
    * player,
]

server_messages = [

    [ 'spawn',
        [ 'room_type', 1 ],
        [ 'room_seed', 4 ] ],

    [ 'enter_new_room',
        [ 'players_list', players_list ] ],

    [ 'player_loaded',
        [ 'players_list', players_list ],
        * player ],

    [ 'add_player_to_list',
        players_list ],

    # [ 'remove_player_from_list_by_id', 2 ],

    [ 'update_player_fields_by_id',
        [ 'id', 2 ],
        [ 'dir', 1 ],
        [ 'pos', [ 1, 1 ] ],
        [ 'animation_type', 1 ] ],

]

client_messages = [

    [ 'need_spawn',
        [ 'player_hash', 4 ] ],

    [ 'player_spawned',
        [ 'pos', [ 1, 1 ] ],
        [ 'coridor_seed', 2 ] ],

    [ 'room_changed',
        [ 'pos', [ 1, 1 ] ],
        [ 'room_type', 1 ],
        [ 'room_seed', 4 ],
        [ 'coridor_seed', 2 ] ],

    [ 'player_moving',
        [ 'dir', 1 ],
        [ 'pos', [ 1, 1 ] ] ],

    [ 'player_moving_stop',
        [ 'dir', 1 ],
        [ 'pos', [ 1, 1 ] ] ]

]

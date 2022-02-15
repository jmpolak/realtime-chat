const users = []

joinUser = (id, username, room) => {
    const user = { id, username, room }
    users.push(user)
    return user
}

disconnectUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) return users.splice(index, 1)[0]
}

getRoomUsers = (room) => {
    return users.filter(user => user.room === room)
}

getCurrentUser = (id) => {
    return users.find(user =>
        user.id === id
    )
}


module.exports = {
    joinUser, disconnectUser, getCurrentUser, getRoomUsers
}


const users = [];

 exports.adduser=({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser) return { error: 'Username is taken.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
}

  exports.removeuser= (id) =>{
    const index = users.findIndex((user) => user.id===id)
    if(index !== -1)
        return users.splice(index , 1)[0];
}

exports.getuser= (id) => users.find((user) => user.id === id );

exports.getusersinroom= (room) => users.filter((user)=> user.room ===  room);

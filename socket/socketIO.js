const Notification = require('../models/notification');
const {rooms, defaultRoom} = require('../sample');

module.exports = io => {

	io.on('connection', socket => {

	    // emit the rooms array
	    socket.emit('setup', {rooms});

	    // listens for a new user
	    socket.on('app_join', data => {
	        
	        // set current room to default
	        data.currentRoom = defaultRoom;
	        // new user joins the default room
	        socket.join(defaultRoom);        
	        // notify the users of the same room
	        io.in(defaultRoom).emit('room_join', data);
	    });

	    // listens for switching a room
	    socket.on('switch', data => {

	    	// remove from the previous room
	        socket.leave(data.oldRoom);
	        // add to the latest room
	        socket.join(data.currentRoom);
	        // send notification in previous room
	        io.in(data.oldRoom).emit('room_leave', data);
			// send notification in latest room        
	        io.in(data.currentRoom).emit('room_join', data);
	    });

	    // listens for a new notification
	    socket.on('notification', data => {
	        
	        const notification = new Notification({
	            username: data.username,
	            content: data.message,
	            room: data.room.toLowerCase()
	        });

	        notification.save()
				.then(() => {
					io.in(data.room.toLowerCase()).emit('notification', data.message);
					res.json({success: 'Notification added!'})
				})
				.catch(() => res.json({error: 'Error in adding the notification'}));
	    });
	});
}